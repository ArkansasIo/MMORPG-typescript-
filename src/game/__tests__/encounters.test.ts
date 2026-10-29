import { describe, expect, it } from "vitest";
import { rollEncounter } from "../data/EncounterTables";

describe("Encounter tables", () => {
  it("selects deterministically from a seeded random value", () => {
    expect(rollEncounter("meadow", () => 0).id).toBe("slime");
    expect(rollEncounter("meadow", () => 0.99).id).toBe("wolf");
  });

  it("returns an independent creature record", () => {
    const creature = rollEncounter("meadow", () => 0);
    creature.hp = 0;
    expect(rollEncounter("meadow", () => 0).hp).toBeGreaterThan(0);
  });

  it("rejects unknown tables and invalid random values", () => {
    expect(() => rollEncounter("unknown", () => 0.5)).toThrow("Unknown encounter table");
    expect(() => rollEncounter("meadow", () => 1)).toThrow(RangeError);
  });
});
