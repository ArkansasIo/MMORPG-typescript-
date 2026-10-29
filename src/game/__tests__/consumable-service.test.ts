import { describe, expect, it } from "vitest";
import { Character } from "../character/Character";
import { ConsumableService } from "../inventory/ConsumableService";
import { Inventory } from "../inventory/Inventory";
import { STARTER_ITEMS } from "../data/StarterContent";
import { STARTER_CONSUMABLES } from "../data/Consumables";

function setup() {
  const inventory = new Inventory();
  inventory.add(STARTER_ITEMS[0], 2);
  const character = new Character("Hero", "Fighter", { id: "hero" });
  character.takeDamage(20);
  const service = new ConsumableService();
  STARTER_CONSUMABLES.forEach(item => service.register(item));
  return { inventory, character, service };
}
describe("ConsumableService", () => {
  it("restores health and consumes exactly one potion", () => {
    const { inventory, character, service } = setup();
    const before = character.hp;
    const result = service.use("small-potion", inventory, character);
    expect(result.success).toBe(true);
    expect(result.amountRestored).toBe(15);
    expect(character.hp).toBe(before + 15);
    expect(inventory.quantity("small-potion")).toBe(1);
  });
  it("does not consume a potion when health is full", () => {
    const { inventory, character, service } = setup();
    character.heal(999);
    const result = service.use("small-potion", inventory, character);
    expect(result.success).toBe(false);
    expect(inventory.quantity("small-potion")).toBe(2);
  });
  it("does not consume inventory when the item is missing or unusable", () => {
    const { inventory, character, service } = setup();
    expect(service.use("missing", inventory, character).success).toBe(false);
    inventory.remove("small-potion", 2);
    expect(service.use("small-potion", inventory, character).success).toBe(false);
  });
});
