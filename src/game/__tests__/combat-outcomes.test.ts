import { describe, expect, it } from "vitest";
import { CombatEngine } from "../combat/CombatEngine";
import type { Combatant } from "../types";

const unit = (overrides: Partial<Combatant> & Pick<Combatant, "id" | "name">): Combatant => ({
  id: overrides.id,
  name: overrides.name,
  level: 1, hp: 10, maxHp: 10, defense: 1, speed: 1,
  abilities: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
  proficiencyBonus: 2, attackBonus: 0, damage: 1, damageType: "physical",
  ...overrides
});

describe("Combat team outcomes", () => {
  it("declares victory when the player side defeats all opponents", () => {
    const engine = new CombatEngine(() => 0.99);
    const hero = unit({ id: "hero", name: "Hero", speed: 20, attackBonus: 100, damage: 20 });
    const enemy = unit({ id: "slime", name: "Slime", hp: 5, maxHp: 5, speed: 1 });
    const state = engine.start([hero, enemy], ["hero"]);
    expect(engine.current(state)?.id).toBe("hero");
    expect(engine.act(state, { kind: "attack", targetId: "slime" }).status).toBe("victory");
  });

  it("declares defeat when the player side is eliminated", () => {
    const engine = new CombatEngine(() => 0.99);
    const hero = unit({ id: "hero", name: "Hero", speed: 1, hp: 5, maxHp: 5, defense: 0 });
    const enemy = unit({ id: "wolf", name: "Wolf", speed: 20, attackBonus: 100, damage: 20 });
    const state = engine.start([hero, enemy], ["hero"]);
    expect(engine.current(state)?.id).toBe("wolf");
    expect(engine.act(state, { kind: "attack", targetId: "hero" }).status).toBe("defeat");
  });
});
