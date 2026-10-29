import { describe, expect, it } from "vitest";
import { Inventory, ShopService, type ItemDefinition } from "../inventory/Inventory";

const potion: ItemDefinition = {
  id: "potion", name: "Potion", kind: "consumable", stackable: true,
  maxStack: 5, price: 10, description: "A test potion."
};

describe("Inventory validation", () => {
  it("rejects invalid stack sizes", () => {
    const inventory = new Inventory(2);
    expect(() => inventory.add({ ...potion, maxStack: 0 })).toThrow();
  });

  it("rejects invalid shop quantities without changing currency", () => {
    const inventory = new Inventory(2);
    const wallet = { gold: 50 };
    const shop = new ShopService();
    expect(shop.buy(inventory, potion, 0, wallet)).toBe(false);
    expect(shop.sell(inventory, potion, -1, wallet)).toBe(false);
    expect(wallet.gold).toBe(50);
    expect(inventory.quantity("potion")).toBe(0);
  });
});
