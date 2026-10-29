import type { Combatant, DamageType, StatusEffect } from "../types";

export type CombatAction =
  | { kind: "attack"; targetId: string; damageType?: DamageType }
  | { kind: "heal"; targetId: string; amount: number }
  | { kind: "flee" };

export interface CombatEvent {
  round: number;
  actorId: string;
  kind: string;
  message: string;
  timestamp: number;
}

export interface CombatState {
  round: number;
  turnIndex: number;
  order: string[];
  combatants: Combatant[];
  playerSideIds: string[];
  events: CombatEvent[];
  status: "active" | "victory" | "defeat" | "escaped";
}

export const abilityMod = (score: number): number => Math.floor((score - 10) / 2);

export class CombatEngine {
  constructor(private readonly random: () => number = Math.random) {}

  start(combatants: Combatant[], playerSideIds: string[] = [combatants[0]?.id]): CombatState {
    if (combatants.length < 2) throw new Error("Combat requires at least two combatants");
    const ids = new Set(combatants.map(c => c.id));
    if (ids.size !== combatants.length) throw new Error("Combatant IDs must be unique");
    if (!playerSideIds.length || new Set(playerSideIds).size !== playerSideIds.length ||
        playerSideIds.some(id => !ids.has(id))) {
      throw new Error("Player-side IDs must be unique combatant IDs");
    }
    const copies = combatants.map(c => ({
      ...c, abilities: { ...c.abilities }, conditions: [...(c.conditions ?? [])]
    }));
    const order = [...copies]
      .sort((a, b) => (b.speed + this.roll()) - (a.speed + this.roll()))
      .map(c => c.id);
    const state: CombatState = {
      round: 1, turnIndex: 0, order, combatants: copies,
      playerSideIds: [...playerSideIds], events: [], status: "active"
    };
    return this.checkEnd(state);
  }

  current(state: CombatState): Combatant | undefined {
    return state.combatants.find(c => c.id === state.order[state.turnIndex]);
  }

  act(state: CombatState, action: CombatAction): CombatState {
    if (state.status !== "active") throw new Error("Combat is already finished");
    const actor = this.current(state);
    if (!actor || actor.hp <= 0) throw new Error("Current combatant is not able to act");

    if (actor.conditions?.includes("stunned")) {
      this.event(state, actor.id, "skip", `${actor.name} is stunned and loses the turn.`);
      this.advance(state);
      return this.checkEnd(state);
    }
    if (action.kind === "flee") {
      state.status = "escaped";
      this.event(state, actor.id, "flee", `${actor.name} escaped combat.`);
      return state;
    }

    const target = state.combatants.find(c => c.id === action.targetId);
    if (!target || target.hp <= 0) throw new Error("Target does not exist or is defeated");
    if (action.kind === "attack") {
      if (target.id === actor.id) throw new Error("A combatant cannot attack itself");
      const roll = this.roll();
      const total = roll + actor.attackBonus;
      const critical = roll === 20;
      const hit = critical || (roll !== 1 && total >= target.defense);
      if (hit) {
        let damage = Math.max(1, actor.damage + (critical ? actor.damage : 0));
        const type = action.damageType ?? actor.damageType;
        if (target.resistances?.includes(type)) damage = Math.floor(damage / 2);
        if (target.vulnerabilities?.includes(type)) damage *= 2;
        if (target.conditions?.includes("shielded")) damage = Math.max(0, damage - 3);
        target.hp = Math.max(0, target.hp - damage);
        this.event(state, actor.id, "attack", `${actor.name} ${critical ? "critically " : ""}hits ${target.name} for ${damage} ${type} damage (d20 ${roll}).`);
      } else {
        this.event(state, actor.id, "miss", `${actor.name} misses ${target.name} (d20 ${roll}, total ${total}, defense ${target.defense}).`);
      }
    } else {
      if (!Number.isFinite(action.amount) || action.amount < 0) throw new RangeError("Heal amount must be non-negative");
      const before = target.hp;
      target.hp = Math.min(target.maxHp, target.hp + Math.floor(action.amount));
      this.event(state, actor.id, "heal", `${actor.name} restores ${target.hp - before} HP to ${target.name}.`);
    }

    this.tickConditions(state);
    this.advance(state);
    return this.checkEnd(state);
  }

  addCondition(state: CombatState, targetId: string, effect: StatusEffect): void {
    const target = state.combatants.find(c => c.id === targetId);
    if (!target) throw new Error("Unknown target");
    target.conditions ??= [];
    if (!target.conditions.includes(effect)) target.conditions.push(effect);
    this.event(state, targetId, "condition", `${target.name} gains ${effect}.`);
  }

  private roll(): number {
    const value = this.random();
    if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError("Random source must return a value in [0, 1)");
    return 1 + Math.floor(value * 20);
  }

  private event(state: CombatState, actorId: string, kind: string, message: string): void {
    state.events.push({ round: state.round, actorId, kind, message, timestamp: Date.now() });
  }

  private tickConditions(state: CombatState): void {
    for (const combatant of state.combatants) {
      if (combatant.hp <= 0) continue;
      if (combatant.conditions?.includes("burning")) combatant.hp = Math.max(0, combatant.hp - 2);
      if (combatant.conditions?.includes("poisoned")) combatant.hp = Math.max(0, combatant.hp - 1);
    }
  }

  private advance(state: CombatState): void {
    for (let attempts = 0; attempts < state.order.length; attempts++) {
      state.turnIndex++;
      if (state.turnIndex >= state.order.length) {
        state.turnIndex = 0;
        state.round++;
      }
      const next = state.combatants.find(c => c.id === state.order[state.turnIndex]);
      if (next && next.hp > 0) return;
    }
  }

  private checkEnd(state: CombatState): CombatState {
    const alive = state.combatants.filter(c => c.hp > 0);
    const playerAlive = alive.some(c => state.playerSideIds.includes(c.id));
    const opponentAlive = alive.some(c => !state.playerSideIds.includes(c.id));
    if (!playerAlive) state.status = "defeat";
    else if (!opponentAlive) state.status = "victory";
    return state;
  }
}
