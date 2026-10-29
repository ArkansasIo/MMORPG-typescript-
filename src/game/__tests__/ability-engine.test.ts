import { describe, expect, it } from "vitest";
import { AbilityEngine } from "../abilities/AbilityEngine";
import { STARTER_ABILITIES } from "../data/Abilities";

const unit = (overrides: Partial<{level:number;hp:number;maxHp:number;mana:number;maxMana:number}> = {}) => ({
  level: 1, hp: 20, maxHp: 20, mana: 10, maxMana: 10, ...overrides
});

describe("AbilityEngine", () => {
  it("registers starter abilities and applies damage", () => {
    const engine = new AbilityEngine();
    STARTER_ABILITIES.forEach(ability => engine.register(ability));
    const caster = unit();
    const target = unit({ hp: 15 });
    const result = engine.use("spark", caster, target);
    expect(result.success).toBe(true);
    expect(result.amount).toBe(8);
    expect(target.hp).toBe(7);
    expect(caster.mana).toBe(7);
  });
  it("does not spend mana when the caster cannot afford an ability", () => {
    const engine = new AbilityEngine();
    engine.register(STARTER_ABILITIES[0]);
    const caster = unit({ mana: 1 });
    const target = unit();
    expect(engine.use("spark", caster, target).success).toBe(false);
    expect(caster.mana).toBe(1);
    expect(target.hp).toBe(20);
  });
  it("heals without exceeding maximum health", () => {
    const engine = new AbilityEngine();
    engine.register(STARTER_ABILITIES[2]);
    const caster = unit();
    const target = unit({ hp: 17 });
    const result = engine.use("mend", caster, target);
    expect(result.amount).toBe(3);
    expect(target.hp).toBe(20);
  });
  it("rejects mismatched self targets and low-level abilities", () => {
    const engine = new AbilityEngine();
    engine.register(STARTER_ABILITIES[3]);
    const caster = unit();
    expect(engine.use("second-wind", caster, unit()).success).toBe(false);
    caster.level = 2;
    expect(engine.use("second-wind", caster, caster).success).toBe(true);
  });
});
