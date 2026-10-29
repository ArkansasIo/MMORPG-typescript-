import { describe, expect, it } from "vitest";
import { rollLoot } from "../data/LootTables";

describe("Creature loot tables", () => {
  it("returns a guaranteed drop when the roll is below its chance", () => {
    const values = [0, 0];
    const drops = rollLoot("slime", () => values.shift() ?? 0);
    expect(drops).toEqual([{ itemId: "small-potion", quantity: 1 }]);
  });

  it("returns no drop when the roll exceeds the chance", () => {
    expect(rollLoot("slime", () => 0.99)).toEqual([]);
  });

  it("returns an empty list for creatures without a loot table", () => {
    expect(rollLoot("unknown-creature", () => 0)).toEqual([]);
  });
});
