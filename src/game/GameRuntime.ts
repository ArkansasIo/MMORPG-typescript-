/**
 * @file-id ER-FILE-GAME-RUNTIME-0001
 * @module-id ER-MOD-GAME-0001
 * @doc ../../docs/source/GameRuntime.ts.docs.md
 * @master-doc ../../docs/MASTER_DOCUMENTATION.md
 * Purpose: compose playable sessions from procedural or authored Tiled worlds.
 */
import { Character } from "./character/Character";
import { BattleService, type BattleResult } from "./combat/BattleService";
import type { CombatAction } from "./combat/CombatEngine";
import { STARTER_ITEMS, STARTER_QUESTS } from "./data/StarterContent";
import { rollEncounter } from "./data/EncounterTables";
import { GameSession, type SessionSave } from "./GameSession";
import { WorldGenerator } from "./world/WorldGenerator";
import { loadTiledMap, type TiledMapDocument } from "./world/TiledMapLoader";
import { TiledMapRuntime } from "./world/TiledMapRuntime";
import { TiledWorldRegistry, type WarpResolution } from "./world/TiledWorldRegistry";
import type { Position } from "./world/CollisionSystem";

export interface RuntimeOptions {
  seed: number;
  characterName: string;
  characterClass: ConstructorParameters<typeof Character>[1];
  characterId?: string;
}

export interface TiledRuntimeOptions extends RuntimeOptions {
  mapId: string;
  mapName: string;
  document: TiledMapDocument;
  spawn?: Position;
  additionalMaps?: Array<{ mapId: string; mapName: string; document: TiledMapDocument }>;
}

export class GameRuntime {
  readonly session: GameSession;
  readonly battles: BattleService;
  tiledWorld?: TiledMapRuntime;
  readonly tiledRegistry?: TiledWorldRegistry;
  lastWarpResolution?: WarpResolution;
  private readonly tiledDocuments?: Array<{ mapId: string; mapName: string; document: TiledMapDocument }>;

  private constructor(session: GameSession, battles: BattleService, tiledWorld?: TiledMapRuntime, tiledRegistry?: TiledWorldRegistry, tiledDocuments?: Array<{ mapId: string; mapName: string; document: TiledMapDocument }>) {
    this.session = session;
    this.battles = battles;
    this.tiledWorld = tiledWorld;
    this.tiledRegistry = tiledRegistry;
    this.tiledDocuments = tiledDocuments ? structuredClone(tiledDocuments) : undefined;
  }

  static restore(save: SessionSave): GameRuntime {
    if (save.tiledWorld) return GameRuntime.restoreTiledWorld(save);
    const match = /^starter-region-(-?\d+)$/.exec(save.mapId);
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
    GameRuntime.registerStarterContent(session);
    session.addItem(STARTER_ITEMS[0], 2);
    session.addItem(STARTER_ITEMS[3], 4);
    session.addItem(STARTER_ITEMS[1]);
    session.equipItem("iron-sword");
    return new GameRuntime(session, new BattleService(session));
  }

  /** Create a playable runtime from an authored Tiled JSON map. */
  static createFromTiledMap(options: TiledRuntimeOptions): GameRuntime {
    const loaded = loadTiledMap(options.document, { id: options.mapId, name: options.mapName });
    const additional = (options.additionalMaps ?? []).map(entry =>
      loadTiledMap(entry.document, { id: entry.mapId, name: entry.mapName })
    );
    const registry = new TiledWorldRegistry([loaded, ...additional]);
    const spawn = options.spawn ?? { x: Math.floor(loaded.map.width / 2), y: Math.floor(loaded.map.height / 2) };
    const character = new Character(options.characterName, options.characterClass, {
      id: options.characterId
    });
    const session = new GameSession(character, loaded.map, spawn);
    GameRuntime.registerStarterContent(session);
    const mapDocuments = [
      { mapId: options.mapId, mapName: options.mapName, document: options.document },
      ...(options.additionalMaps ?? [])
    ];
    return new GameRuntime(session, new BattleService(session), registry.get(options.mapId), registry, mapDocuments);
  }

  private static restoreTiledWorld(save: SessionSave): GameRuntime {
    const worldSave = save.tiledWorld;
    if (!worldSave || !Array.isArray(worldSave.maps) || worldSave.maps.length < 1 || worldSave.maps.length > 100) {
      throw new Error("Tiled world save catalog is invalid");
    }
    const entries = worldSave.maps.map(entry => {
      if (!entry || typeof entry.mapId !== "string" || !entry.mapId.trim() ||
          typeof entry.mapName !== "string" || !entry.mapName.trim() ||
          !entry.document || typeof entry.document !== "object" || !Array.isArray(entry.openedDoorIds)) {
        throw new Error("Tiled world save entry is invalid");
      }
      return { ...entry, loaded: loadTiledMap(entry.document, { id: entry.mapId, name: entry.mapName }) };
    });
    const registry = new TiledWorldRegistry(entries.map(entry => entry.loaded));
    for (const entry of entries) registry.get(entry.mapId)!.restoreOpenedDoors(entry.openedDoorIds);
    const activeWorld = registry.get(save.mapId);
    if (!activeWorld) throw new Error("Saved active Tiled map is missing from the world catalog");
    const data = save.character;
    if (!Number.isInteger(data.level) || data.level < 1 || !Number.isFinite(data.xp) || data.xp < 0 ||
        !Number.isFinite(data.hp) || !Number.isFinite(data.maxHp) || data.maxHp < 1 ||
        data.hp < 0 || data.hp > data.maxHp || !Number.isSafeInteger(data.gold) || data.gold < 0) {
      throw new Error("Saved character progression is invalid");
    }
    const character = new Character(data.name, data.characterClass, { id: data.id, abilities: data.abilities });
    character.level = data.level;
    character.xp = data.xp;
    character.hp = data.hp;
    character.maxHp = data.maxHp;
    character.gold = data.gold;
    const session = new GameSession(character, activeWorld.source.map, save.position);
    GameRuntime.registerStarterContent(session);
    session.restore(save);
    const mapDocuments = entries.map(({ mapId, mapName, document }) => ({ mapId, mapName, document }));
    return new GameRuntime(session, new BattleService(session), activeWorld, registry, mapDocuments);
  }

  private static registerStarterContent(session: GameSession): void {
    for (const item of STARTER_ITEMS) session.registerItemDefinition(item);
    for (const quest of STARTER_QUESTS) session.registerQuest(quest);
  }

  move(direction: Parameters<GameSession["move"]>[0]): boolean {
    this.lastWarpResolution = undefined;
    const moved = this.session.move(direction);
    if (moved) this.resolveWarpAtCurrentPosition();
    return moved;
  }

  /** Resolve and apply a registered authored warp after the player enters its tile. */
  resolveWarpAtCurrentPosition(): WarpResolution | undefined {
    if (!this.tiledRegistry || !this.tiledWorld) return undefined;
    const resolution = this.tiledRegistry.resolveWarp(this.session.map.data.id, this.session.position);
    this.lastWarpResolution = resolution;
    if (resolution?.status === "ready") {
      this.session.transitionTo(resolution.target.source.map, resolution.position);
      this.tiledWorld = resolution.target;
    }
    return resolution;
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
    const save = this.session.save();
    if (!this.tiledRegistry || !this.tiledDocuments) return save;
    return {
      ...save,
      tiledWorld: {
        maps: this.tiledDocuments.map(entry => ({
          ...entry,
          document: structuredClone(entry.document),
          openedDoorIds: this.tiledRegistry!.get(entry.mapId)?.openedDoorIds ?? []
        }))
      }
    };
  }
}
