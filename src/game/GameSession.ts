import { Character } from "./character/Character";
import { Inventory, ShopService, type ItemDefinition } from "./inventory/Inventory";
import { QuestEngine, type ObjectiveKind, type QuestDefinition } from "./quests/QuestEngine";
import { CollisionSystem, type Direction, type Position } from "./world/CollisionSystem";
import { TileMap } from "./world/TileMap";

export interface SessionSave {
  schemaVersion: 1;
  character: ReturnType<Character["toSaveData"]>;
  mapId: string;
  position: Position;
  inventory: ReturnType<Inventory["list"]>;
  equipment: ReturnType<Inventory["equippedItems"]>;
  quests: ReturnType<QuestEngine["getProgress"]>[];
}
export interface QuestRewardResult {
  completedQuestIds: string[];
  xpAwarded: number;
  goldAwarded: number;
  itemRewards: string[];
  unresolvedItemRewards: string[];
}

export class GameSession {
  readonly inventory: Inventory;
  readonly quests = new QuestEngine();
  private readonly questIds = new Set<string>();
  private readonly itemDefinitions = new Map<string, ItemDefinition>();
  private readonly shop = new ShopService();
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

  equipItem(itemId: string): boolean {
    const item = this.itemDefinitions.get(itemId);
    return !!item && this.inventory.equip(item);
  }

  equipmentBonuses(): { attackBonus: number; defense: number } {
    const equipped = this.inventory.equippedItems();
    let attackBonus = 0;
    let defense = 0;
    for (const [slot, itemId] of Object.entries(equipped)) {
      const item = this.itemDefinitions.get(itemId);
      if (!item) continue;
      const bonus = Number.isFinite(item.statBonus) ? Math.max(0, item.statBonus ?? 0) : 0;
      if (slot === "weapon") attackBonus += bonus;
      else defense += bonus;
    }
    return { attackBonus, defense };
  }

  buyItem(itemId: string, quantity = 1): boolean {
    const item = this.itemDefinitions.get(itemId);
    return !!item && this.shop.buy(this.inventory, item, quantity, this.character);
  }

  sellItem(itemId: string, quantity = 1, rate = 0.5): boolean {
    const item = this.itemDefinitions.get(itemId);
    return !!item && this.shop.sell(this.inventory, item, quantity, this.character, rate);
  }

  grantRegisteredItem(itemId: string, quantity = 1): boolean {
    const item = this.itemDefinitions.get(itemId);
    return !!item && this.inventory.add(item, quantity);
  }

  registerItemDefinition(item: ItemDefinition): void {
    if (!item.id.trim()) throw new Error("Item definition requires an ID");
    this.itemDefinitions.set(item.id, { ...item });
  }

  recordObjective(kind: ObjectiveKind, targetId: string, amount = 1): QuestRewardResult {
    const completed = this.quests.record(kind, targetId, amount);
    let xpAwarded = 0;
    let goldAwarded = 0;
    const itemRewards: string[] = [];
    const unresolvedItemRewards: string[] = [];
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
      for (const itemId of quest.reward.itemIds ?? []) {
        const item = this.itemDefinitions.get(itemId);
        if (!item) { unresolvedItemRewards.push(itemId); continue; }
        if (this.inventory.add(item)) itemRewards.push(itemId);
        else unresolvedItemRewards.push(itemId);
      }
    }
    return { completedQuestIds: completed.map(q => q.id), xpAwarded, goldAwarded, itemRewards, unresolvedItemRewards };
  }

  restore(save: SessionSave): void {
    if (save.schemaVersion !== 1 || save.mapId !== this.map.data.id) throw new Error("Save does not match this map or schema");
    if (save.character.id !== this.character.id) throw new Error("Save character does not match this session");
    if (!this.map.inBounds(save.position.x, save.position.y) || !this.collision.canEnter(save.position)) {
      throw new Error("Saved position is outside the map or blocked");
    }
    const knownQuestIds = new Set(this.questIds);
    if (save.quests.some(progress => !knownQuestIds.has(progress.questId))) throw new Error("Save contains an unknown quest");
    this.inventory.restoreSnapshot(save.inventory, save.equipment, [...this.itemDefinitions.values()]);
    this.quests.restoreProgress(save.quests);
    this.currentPosition = { ...save.position };
  }

  save(): SessionSave {
    return {
      schemaVersion: 1,
      character: this.character.toSaveData(),
      mapId: this.map.data.id,
      position: this.position,
      inventory: this.inventory.list(),
      equipment: this.inventory.equippedItems(),
      quests: [...this.questIds].map(id => this.quests.getProgress(id))
    };
  }
}
