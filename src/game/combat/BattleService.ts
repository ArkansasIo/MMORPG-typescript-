import type { Character } from "../character/Character";
import { CombatEngine, type CombatAction, type CombatState } from "./CombatEngine";
import type { GameSession, QuestRewardResult } from "../GameSession";
import { getCreature } from "../data/Creatures";
import type { Combatant } from "../types";

export interface BattleResult {
  state: CombatState;
  xpAwarded: number;
  goldAwarded: number;
  questRewards: QuestRewardResult[];
}

export class BattleService {
  private state?: CombatState;
  private enemies: Combatant[] = [];
  private rewarded = new Set<string>();
  private xpAwarded = 0;
  private goldAwarded = 0;
  private questRewards: QuestRewardResult[] = [];

  constructor(
    private readonly session: GameSession,
    private readonly engine = new CombatEngine(),
    private readonly random: () => number = Math.random
  ) {}

  get currentBattle(): CombatState | undefined { return this.state; }

  start(creatureIds: string[]): BattleResult {
    if (this.state?.status === "active") throw new Error("A battle is already active");
    if (creatureIds.length === 0) throw new Error("A battle requires at least one creature");
    const player = this.session.character;
    this.enemies = creatureIds.map((id, index) => {
      const creature = getCreature(id);
      return { ...creature, id: `enemy-${index + 1}-${creature.id}`, abilities: { ...creature.abilities }, conditions: [] };
    });
    const combatants: Combatant[] = [
      this.toCombatant(player),
      ...this.enemies.map(enemy => ({ ...enemy, abilities: { ...enemy.abilities }, conditions: [...(enemy.conditions ?? [])] }))
    ];
    this.rewarded.clear();
    this.xpAwarded = 0;
    this.goldAwarded = 0;
    this.questRewards = [];
    this.state = this.engine.start(combatants, [player.id]);
    this.resolveEnemyTurns();
    return this.result();
  }

  playerAction(action: CombatAction): BattleResult {
    if (!this.state || this.state.status !== "active") throw new Error("No active battle");
    const player = this.session.character;
    if (this.engine.current(this.state)?.id !== player.id) throw new Error("It is not the player's turn");
    if (action.kind === "attack" && !this.enemies.some(e => e.id === action.targetId)) {
      throw new Error("Player attacks must target an enemy");
    }
    this.state = this.engine.act(this.state, action);
    this.syncPlayer();
    this.resolveEnemyTurns();
    this.awardVictoryRewards();
    return this.result();
  }

  private resolveEnemyTurns(): void {
    if (!this.state) return;
    const player = this.session.character;
    while (this.state.status === "active" && this.engine.current(this.state)?.id !== player.id) {
      const actor = this.engine.current(this.state);
      if (!actor) break;
      const target = this.state.combatants.find(c => c.id === player.id);
      if (!target || target.hp <= 0) break;
      this.state = this.engine.act(this.state, { kind: "attack", targetId: player.id });
      this.syncPlayer();
    }
    this.awardVictoryRewards();
  }

  private awardVictoryRewards(): void {
    if (!this.state || this.state.status !== "victory") return;
    const defeated = this.state.combatants.filter(c => c.id !== this.session.character.id && c.hp <= 0);
    for (const enemy of defeated) {
      const sourceId = enemy.id.replace(/^enemy-\d+-/, "");
      if (this.rewarded.has(enemy.id)) continue;
      this.rewarded.add(enemy.id);
      const creature = getCreature(sourceId);
      const goldRange = creature.goldMax - creature.goldMin + 1;
      const roll = this.random();
      const gold = creature.goldMin + Math.floor(Math.min(0.999999999, Math.max(0, roll)) * goldRange);
      this.session.character.gainXp(creature.xpReward);
      this.session.character.gold += gold;
      this.xpAwarded += creature.xpReward;
      this.goldAwarded += gold;
      this.questRewards.push(this.session.recordObjective("kill", creature.id));
    }
  }

  private syncPlayer(): void {
    if (!this.state) return;
    const combatant = this.state.combatants.find(c => c.id === this.session.character.id);
    if (combatant) this.session.character.hp = Math.max(0, Math.min(this.session.character.maxHp, combatant.hp));
  }

  private toCombatant(character: Character): Combatant {
    return {
      id: character.id, name: character.name, level: character.level, hp: character.hp, maxHp: character.maxHp,
      defense: character.defense, speed: character.speed, abilities: { ...character.abilities },
      proficiencyBonus: character.proficiencyBonus, attackBonus: character.attackBonus, damage: character.damage,
      damageType: character.damageType, conditions: [...character.conditions]
    };
  }

  private result(): BattleResult {
    if (!this.state) throw new Error("Battle has not started");
    return { state: this.state, xpAwarded: this.xpAwarded, goldAwarded: this.goldAwarded, questRewards: [...this.questRewards] };
  }
}
