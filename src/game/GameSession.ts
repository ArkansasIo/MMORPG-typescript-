import { Character } from "./character/Character";
import { Inventory, type ItemDefinition } from "./inventory/Inventory";
import { QuestEngine, type ObjectiveKind, type QuestDefinition } from "./quests/QuestEngine";
import { CollisionSystem, type Direction, type Position } from "./world/CollisionSystem";
import { TileMap } from "./world/TileMap";

export interface SessionSave {
  schemaVersion: 1;
  character: ReturnType<Character["toSaveData"]>;
  mapId: string;
  position: Position;
  inventory: ReturnType<Inventory["list"]>;
  quests: ReturnType<QuestEngine["getProgress"]>[];
}
export interface QuestRewardResult {
  completedQuestIds: string[];
  xpAwarded: number;
  goldAwarded: number;
  itemRewards: string[];
}

export class GameSession {
  readonly inventory: Inventory;
  readonly quests = new QuestEngine();
  private readonly questIds = new Set<string>();
  private readonly collision: CollisionSystem;
  private currentPosition: Position;

  constructor(readonly character: Character, readonly map: TileMap, spawn: Position, capacity = 30) {
    if (!map.inBounds(spawn.x, spawn.y)) throw new Error("Spawn is outside the map");
    if (!new CollisionSystem(map).canEnter(spawn)) throw new Error("Spawn is blocked");
    this.currentPosition = { ...spawn };
    this.inventory = new Inventory(capacity);
    this.collision = new CollisionSystem(map);
  }

  get position(): Position { return { ...this.currentPosition }; }

  move(direction: Direction): boolean {
    const next = this.collision.tryMove(this.currentPosition, direction);
    if (!next) return false;
    this.currentPosition = next;
    this.recordObjective("visit", `${this.map.data.id}:${next.x},${next.y}`);
    const exit = this.map.getExitAt(next.x, next.y);
    if (exit) this.recordObjective("visit", exit.id);
    for (const npc of this.map.getNpcsAt(next.x, next.y)) this.recordObjective("visit", npc.id);
    return true;
  }

  registerQuest(quest: QuestDefinition): void {
    this.quests.register(quest);
    this.questIds.add(quest.id);
  }
  acceptQuest(id: string): boolean { return this.quests.accept(id); }
  addItem(item: ItemDefinition, quantity = 1): boolean { return this.inventory.add(item, quantity); }

  recordObjective(kind: ObjectiveKind, targetId: string, amount = 1): QuestRewardResult {
    const completed = this.quests.record(kind, targetId, amount);
    let xpAwarded = 0;
    let goldAwarded = 0;
    const itemRewards: string[] = [];
    for (const quest of completed) {
      const xp = Math.floor(quest.reward.xp);
      const gold = Math.floor(quest.reward.gold);
      if (Number.isFinite(xp) && xp >= 0) {
        this.character.gainXp(xp);
        xpAwarded += xp;
      }
      if (Number.isSafeInteger(gold) && gold >= 0 && Number.isSafeInteger(this.character.gold + gold)) {
        this.character.gold += gold;
        goldAwarded += gold;
      }
      itemRewards.push(...(quest.reward.itemIds ?? []));
    }
    return { completedQuestIds: completed.map(q => q.id), xpAwarded, goldAwarded, itemRewards };
  }

  save(): SessionSave {
    return {
      schemaVersion: 1,
      character: this.character.toSaveData(),
      mapId: this.map.data.id,
      position: this.position,
      inventory: this.inventory.list(),
      quests: [...this.questIds].map(id => this.quests.getProgress(id))
    };
  }
}
