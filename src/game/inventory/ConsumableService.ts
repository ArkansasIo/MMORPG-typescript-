import type { Character } from "../character/Character";
import type { Inventory } from "./Inventory";

export interface ConsumableDefinition {
  itemId: string;
  effect: "heal";
  amount: number;
}
export interface ConsumableResult {
  success: boolean;
  itemId: string;
  amountRestored: number;
  message: string;
}
export class ConsumableService {
  private readonly definitions = new Map<string, ConsumableDefinition>();
  register(definition: ConsumableDefinition): void {
    if (!definition.itemId.trim() || !Number.isFinite(definition.amount) || definition.amount <= 0) {
      throw new Error("Consumable definition requires an item ID and positive effect amount");
    }
    this.definitions.set(definition.itemId, { ...definition });
  }
  use(itemId: string, inventory: Inventory, character: Character): ConsumableResult {
    const definition = this.definitions.get(itemId);
    if (!definition) return { success: false, itemId, amountRestored: 0, message: "This item has no usable effect." };
    if (inventory.quantity(itemId) < 1) return { success: false, itemId, amountRestored: 0, message: "You do not have this item." };
    if (definition.effect === "heal" && character.hp >= character.maxHp) {
      return { success: false, itemId, amountRestored: 0, message: "Health is already full." };
    }
    const before = character.hp;
    if (definition.effect === "heal") character.heal(definition.amount);
    const restored = character.hp - before;
    if (restored <= 0) return { success: false, itemId, amountRestored: 0, message: "The item had no effect." };
    if (!inventory.remove(itemId, 1)) {
      character.hp = before;
      return { success: false, itemId, amountRestored: 0, message: "Could not consume the item." };
    }
    return { success: true, itemId, amountRestored: restored, message: `Restored ${restored} health.` };
  }
}
