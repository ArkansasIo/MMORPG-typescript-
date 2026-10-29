import { describe, expect, it } from "vitest";
import { CraftingService } from "../inventory/CraftingService";
import { Inventory, type ItemDefinition } from "../inventory/Inventory";

const herb: ItemDefinition = { id: "herb", name: "Healing Herb", kind: "material", stackable: true, maxStack: 20, price: 4, description: "A common herb." };
const potion: ItemDefinition = { id: "potion", name: "Small Potion", kind: "consumable", stackable: true, maxStack: 10, price: 12, description: "Restores health." };
const service = () => {
  const crafting = new CraftingService([herb, potion]);
  crafting.registerRecipe({ id: "herbal-potion", name: "Herbal Potion", ingredients: [{ itemId: "herb", quantity: 2 }], output: { itemId: "potion", quantity: 1 } });
  return crafting;
};

describe("CraftingService", () => {
  it("consumes ingredients and produces the configured output", () => {
    const inventory = new Inventory();
    inventory.add(herb, 3);
    const result = service().craft("herbal-potion", inventory);
    expect(result.success).toBe(true);
    expect(inventory.quantity("herb")).toBe(1);
    expect(inventory.quantity("potion")).toBe(1);
  });
  it("does not consume materials when ingredients are missing", () => {
    const inventory = new Inventory();
    inventory.add(herb, 1);
    const result = service().craft("herbal-potion", inventory);
    expect(result.success).toBe(false);
    expect(inventory.quantity("herb")).toBe(1);
    expect(inventory.quantity("potion")).toBe(0);
  });
  it("does not consume ingredients when the inventory cannot fit the output", () => {
    const inventory = new Inventory(1);
    inventory.add(herb, 2);
    inventory.add({ ...potion, id: "other" });
    const result = service().craft("herbal-potion", inventory);
    expect(result.success).toBe(false);
    expect(inventory.quantity("herb")).toBe(2);
  });
  it("rejects unknown items, duplicate recipes, and invalid ingredient amounts", () => {
    const crafting = service();
    expect(() => crafting.registerRecipe({ id: "bad", name: "Bad", ingredients: [{ itemId: "missing", quantity: 1 }], output: { itemId: "potion", quantity: 1 } })).toThrow(/Unknown recipe ingredient/);
    expect(() => crafting.registerRecipe({ id: "herbal-potion", name: "Duplicate", ingredients: [{ itemId: "herb", quantity: 1 }], output: { itemId: "potion", quantity: 1 } })).toThrow(/Duplicate recipe/);
    expect(() => crafting.registerRecipe({ id: "invalid", name: "Invalid", ingredients: [{ itemId: "herb", quantity: 0 }], output: { itemId: "potion", quantity: 1 } })).toThrow(/positive integer/);
  });
});
