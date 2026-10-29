import { describe, expect, it } from "vitest";
import { Character } from "../character/Character";
import { CombatEngine } from "../combat/CombatEngine";
import { QuestEngine } from "../quests/QuestEngine";
import type { Combatant } from "../types";

const fighter: Combatant = {
  id: "hero", name: "Hero", level: 1, hp: 30, maxHp: 30, defense: 10, speed: 10,
  abilities: { strength: 14, dexterity: 10, constitution: 12, intelligence: 10, wisdom: 10, charisma: 10 },
  proficiencyBonus: 2, attackBonus: 4, damage: 6, damageType: "physical"
};
const slime: Combatant = {
  id: "slime", name: "Slime", level: 1, hp: 30, maxHp: 30, defense: 10, speed: 1,
  abilities: { strength: 8, dexterity: 8, constitution: 8, intelligence: 2, wisdom: 5, charisma: 2 },
  proficiencyBonus: 2, attackBonus: 1, damage: 2, damageType: "physical"
};

describe("Character progression", () => {
  it("normalizes blank names and levels up with valid XP", () => {
    const character = new Character("  ", "Fighter", { id: "test-hero" });
    expect(character.name).toBe("Wayfarer");
    expect(character.gainXp(1000)).toBeGreaterThan(0);
    expect(character.level).toBeGreaterThan(1);
    expect(character.hp).toBe(character.maxHp);
  });

  it("rejects negative XP", () => {
    const character = new Character("Tester", "Wizard", { id: "test-wizard" });
    expect(() => character.gainXp(-1)).toThrow(RangeError);
  });
});

describe("Combat engine", () => {
  it("resolves a deterministic critical hit and records an event", () => {
    const engine = new CombatEngine(() => 0.99);
    const state = engine.start([fighter, slime]);
    expect(engine.current(state)?.id).toBe("hero");
    engine.act(state, { kind: "attack", targetId: "slime" });
    expect(state.combatants.find(c => c.id === "slime")?.hp).toBe(18);
    expect(state.events.at(-1)?.kind).toBe("attack");
    expect(state.events.at(-1)?.message).toContain("critically");
  });

  it("rejects duplicate combatant IDs", () => {
    const engine = new CombatEngine(() => 0.5);
    expect(() => engine.start([fighter, { ...slime, id: "hero" }])).toThrow("unique");
  });

  it("supports fleeing", () => {
    const engine = new CombatEngine(() => 0.5);
    const state = engine.start([fighter, slime]);
    engine.act(state, { kind: "flee" });
    expect(state.status).toBe("escaped");
  });
});

describe("Quest progression", () => {
  it("unlocks dependent quests only after prerequisites complete", () => {
    const quests = new QuestEngine();
    quests.register({
      id: "first", title: "First Hunt", description: "Defeat a slime.", prerequisites: [],
      objectives: [{ id: "slime-kill", kind: "kill", targetId: "slime", required: 1 }],
      reward: { xp: 25, gold: 5 }
    });
    quests.register({
      id: "second", title: "The Next Trail", description: "Continue the journey.", prerequisites: ["first"],
      objectives: [{ id: "visit-town", kind: "visit", targetId: "town", required: 1 }],
      reward: { xp: 50, gold: 10 }
    });
    expect(quests.accept("second")).toBe(false);
    expect(quests.record("kill", "slime")).toHaveLength(1);
    expect(quests.accept("second")).toBe(true);
    expect(quests.record("visit", "town")).toHaveLength(1);
    expect(quests.getProgress("second").status).toBe("completed");
  });
});
