import { describe, expect, it } from "vitest";
import { WorldGenerator } from "../world/WorldGenerator";

describe("WorldGenerator", () => {
  it("returns the same map for the same seed", () => {
    const generator = new WorldGenerator();
    const options = { seed: 2026, id: "demo", name: "Demo", width: 8, height: 8 };
    expect(generator.generate(options).data.tiles).toEqual(generator.generate(options).data.tiles);
  });
});
