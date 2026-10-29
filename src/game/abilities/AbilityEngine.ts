export type AbilityTarget = "self" | "single-enemy" | "single-ally";
export type AbilityEffect = "damage" | "heal" | "restore-mana";
export interface AbilityDefinition {
  id: string;
  name: string;
  description: string;
  target: AbilityTarget;
  effect: AbilityEffect;
  power: number;
  manaCost: number;
  levelRequired?: number;
}
export interface AbilityUser {
  level: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
}
export interface AbilityResult {
  abilityId: string;
  success: boolean;
  message: string;
  amount: number;
}
export class AbilityEngine {
  private readonly definitions = new Map<string, AbilityDefinition>();
  register(definition: AbilityDefinition): void {
    if (!definition.id.trim() || !definition.name.trim()) throw new Error("Ability id and name are required");
    if (!Number.isFinite(definition.power) || definition.power < 0 ||
        !Number.isFinite(definition.manaCost) || definition.manaCost < 0 ||
        !Number.isInteger(definition.manaCost) ||
        !Number.isInteger(definition.levelRequired ?? 1) || (definition.levelRequired ?? 1) < 1) {
      throw new Error("Ability power, mana cost, or level requirement is invalid");
    }
    this.definitions.set(definition.id, { ...definition });
  }
  get(id: string): AbilityDefinition | undefined {
    const definition = this.definitions.get(id);
    return definition ? { ...definition } : undefined;
  }
  list(): AbilityDefinition[] { return [...this.definitions.values()].map(item => ({ ...item })); }
  use(id: string, caster: AbilityUser, target: AbilityUser): AbilityResult {
    const ability = this.definitions.get(id);
    if (!ability) return { abilityId: id, success: false, message: "Unknown ability.", amount: 0 };
    if (caster.level < (ability.levelRequired ?? 1)) return { abilityId: id, success: false, message: "Your level is too low.", amount: 0 };
    if (caster.mana < ability.manaCost) return { abilityId: id, success: false, message: "Not enough mana.", amount: 0 };
    if (ability.target === "self" && caster !== target) return { abilityId: id, success: false, message: "This ability targets its caster.", amount: 0 };
    if (ability.effect === "damage" && ability.target !== "single-enemy") return { abilityId: id, success: false, message: "Damage abilities must target an enemy.", amount: 0 };
    if (ability.effect !== "damage" && ability.target === "single-enemy") return { abilityId: id, success: false, message: "This effect cannot target an enemy.", amount: 0 };
    caster.mana -= ability.manaCost;
    let amount = 0;
    if (ability.effect === "damage") {
      amount = Math.min(target.hp, Math.floor(ability.power));
      target.hp = Math.max(0, target.hp - amount);
    } else if (ability.effect === "heal") {
      amount = Math.min(Math.floor(ability.power), Math.max(0, target.maxHp - target.hp));
      target.hp += amount;
    } else {
      amount = Math.min(Math.floor(ability.power), Math.max(0, target.maxMana - target.mana));
      target.mana += amount;
    }
    return { abilityId: id, success: true, message: amount > 0 ? `${ability.name} succeeds for ${amount}.` : `${ability.name} succeeds with no change.`, amount };
  }
}
