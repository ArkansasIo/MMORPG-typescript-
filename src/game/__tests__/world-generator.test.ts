import { describe, expect, it } from "vitest";
import { WorldGenerator } from "../world/WorldGenerator";

describe("WorldGenerator", () => {
  it("returns the same map for the same seed", () => {
    const generator = new WorldGenerator();
    const options = { seed: 2026, id: "demo", name: "Demo", width: 8, height: 8 };
    expect(generator.generate(options).data.tiles).toEqual(generator.generate(options).data.tiles);
  });

  it("rejects terrain chances whose sum exceeds one", () => {
    const generator = new WorldGenerator();
    expect(() => generator.generate({
      seed: 1, id: "bad", name: "Bad", width: 5, height: 5,
      waterChance: 0.6, forestChance: 0.3, mountainChance: 0.2
    })).toThrow("sum");
  });
});
