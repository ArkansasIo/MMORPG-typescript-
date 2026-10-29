import { Character } from "./character/Character";
import { BattleService, type BattleResult } from "./combat/BattleService";
import { CombatAction } from "./combat/CombatEngine";
import { STARTER_ITEMS, STARTER_QUESTS } from "./data/StarterContent";
import { GameSession, type SessionSave } from "./GameSession";
import { WorldGenerator } from "./world/WorldGenerator";

export interface RuntimeOptions {
  seed: number;
  characterName: string;
  characterClass: ConstructorParameters<typeof Character>[1];
  characterId?: string;
}

export class GameRuntime {
  readonly session: GameSession;
  readonly battles: BattleService;

  private constructor(session: GameSession, battles: BattleService) {
    this.session = session;
    this.battles = battles;
  }

  static create(options: RuntimeOptions): GameRuntime {
    const character = new Character(options.characterName, options.characterClass, {
      id: options.characterId
    });
    const map = new WorldGenerator().generate({
      seed: options.seed,
      id: `starter-region-${options.seed}`,
      name: "The Old World Frontier",
      width: 25,
      height: 17
    });
    const spawn = { x: Math.floor(map.data.width / 2), y: Math.floor(map.data.height / 2) };
    const session = new GameSession(character, map, spawn);
    for (const item of STARTER_ITEMS) session.registerItemDefinition(item);
    for (const quest of STARTER_QUESTS) session.registerQuest(quest);
    session.addItem(STARTER_ITEMS[0], 2);
    return new GameRuntime(session, new BattleService(session));
  }

  move(direction: Parameters<GameSession["move"]>[0]): boolean {
    return this.session.move(direction);
  }

  startEncounter(creatureIds: string[] = ["slime"]): BattleResult {
    return this.battles.start(creatureIds);
  }

  act(action: CombatAction): BattleResult {
    return this.battles.playerAction(action);
  }

  save(): SessionSave {
    return this.session.save();
  }
}
