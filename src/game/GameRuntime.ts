import { Character } from "./character/Character";
import { BattleService, type BattleResult } from "./combat/BattleService";
import type { CombatAction } from "./combat/CombatEngine";
import { STARTER_ITEMS, STARTER_QUESTS } from "./data/StarterContent";
import { rollEncounter } from "./data/EncounterTables";
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

  static restore(save: SessionSave): GameRuntime {
    const match = /^starter-region-(-?\\d+)$/.exec(save.mapId);
    if (!match) throw new Error("Save does not identify a restorable starter region");
    const seed = Number(match[1]);
    if (!Number.isSafeInteger(seed)) throw new Error("Saved world seed is invalid");
    const data = save.character;
    if (!Number.isInteger(data.level) || data.level < 1 ||
        !Number.isFinite(data.xp) || data.xp < 0 ||
        !Number.isFinite(data.hp) || !Number.isFinite(data.maxHp) ||
        data.maxHp < 1 || data.hp < 0 || data.hp > data.maxHp ||
        !Number.isSafeInteger(data.gold) || data.gold < 0) {
      throw new Error("Saved character progression is invalid");
    }
    const character = new Character(data.name, data.characterClass, {
      id: data.id,
      abilities: data.abilities
    });
    character.level = data.level;
    character.xp = data.xp;
    character.hp = data.hp;
    character.maxHp = data.maxHp;
    character.gold = data.gold;
    const map = new WorldGenerator().generate({
      seed,
      id: save.mapId,
      name: "The Old World Frontier",
      width: 25,
      height: 17
    });
    const session = new GameSession(character, map, { x: Math.floor(map.width / 2), y: Math.floor(map.height / 2) });
    for (const item of STARTER_ITEMS) session.registerItemDefinition(item);
    for (const quest of STARTER_QUESTS) session.registerQuest(quest);
    session.restore(save);
    return new GameRuntime(session, new BattleService(session));
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
    session.addItem(STARTER_ITEMS[1]);
    session.equipItem("iron-sword");
    return new GameRuntime(session, new BattleService(session));
  }

  move(direction: Parameters<GameSession["move"]>[0]): boolean {
    return this.session.move(direction);
  }

  startEncounter(creatureIds: string[] = ["slime"]): BattleResult {
    return this.battles.start(creatureIds);
  }

  startRandomEncounter(tableId = "meadow"): BattleResult {
    return this.battles.start([rollEncounter(tableId).id]);
  }

  act(action: CombatAction): BattleResult {
    return this.battles.playerAction(action);
  }

  save(): SessionSave {
    return this.session.save();
  }
}
