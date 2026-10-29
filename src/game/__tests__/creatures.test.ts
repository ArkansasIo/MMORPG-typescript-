import { describe, expect, it } from "vitest";
import { getCreature, listCreatures } from "../data/Creatures";

describe("Creature catalog", () => {
  it("provides independent creature definitions", () => {
    const first = getCreature("slime");
    first.hp = 0;
    expect(getCreature("slime").hp).toBe(12);
  });

  it("lists creatures with non-negative rewards and encounter weights", () => {
    const creatures = listCreatures();
    expect(creatures.length).toBeGreaterThanOrEqual(3);
    for (const creature of creatures) {
      expect(creature.xpReward).toBeGreaterThanOrEqual(0);
      expect(creature.goldMin).toBeLessThanOrEqual(creature.goldMax);
      expect(creature.encounterWeight).toBeGreaterThan(0);
    }
  });

  it("throws for unknown creature IDs", () => {
    expect(() => getCreature("not-a-creature")).toThrow("Unknown creature");
  });
});
