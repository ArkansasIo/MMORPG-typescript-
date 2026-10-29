import { describe, expect, it } from "vitest";
import { GameRuntime } from "../GameRuntime";

describe("GameRuntime", () => {
  it("creates a seeded world with starter inventory and registered quests", () => {
    const runtime = GameRuntime.create({ seed: 42, characterName: "Wayfarer", characterClass: "Fighter", characterId: "runtime-hero" });
    expect(runtime.session.map.data.width).toBe(25);
    expect(runtime.session.inventory.quantity("small-potion")).toBe(2);
    expect(runtime.session.inventory.quantity("iron-sword")).toBe(1);
    expect(runtime.session.equipmentBonuses().attackBonus).toBe(2);
    expect(runtime.session.quests.getProgress("meadow-first-steps").status).toBe("active");
    expect(runtime.save().character.id).toBe("runtime-hero");
  });

  it("creates the same map for the same seed", () => {
    const options = { seed: 77, characterName: "A", characterClass: "Ranger" as const };
    const first = GameRuntime.create(options);
    const second = GameRuntime.create(options);
    expect(first.session.map.data.tiles).toEqual(second.session.map.data.tiles);
  });

  it("exposes movement and encounter entry points", () => {
    const runtime = GameRuntime.create({ seed: 9, characterName: "Scout", characterClass: "Ranger", characterId: "scout" });
    expect(typeof runtime.move("east")).toBe("boolean");
    const battle = runtime.startEncounter(["slime"]);
    expect(battle.state.combatants.some(c => c.id === "scout")).toBe(true);
    expect(battle.state.status).toBe("active");
    const randomRuntime = GameRuntime.create({ seed: 10, characterName: "Random", characterClass: "Fighter", characterId: "random-hero" });
    const randomBattle = randomRuntime.startRandomEncounter("meadow");
    expect(randomBattle.state.combatants.length).toBeGreaterThanOrEqual(2);
  });
});
