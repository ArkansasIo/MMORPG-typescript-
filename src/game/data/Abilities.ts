import type { AbilityDefinition } from "../abilities/AbilityEngine";

export const STARTER_ABILITIES: AbilityDefinition[] = [
  { id: "spark", name: "Spark", description: "A small bolt of arcane energy.", target: "single-enemy", effect: "damage", power: 8, manaCost: 3 },
  { id: "heavy-strike", name: "Heavy Strike", description: "A committed weapon strike.", target: "single-enemy", effect: "damage", power: 12, manaCost: 2 },
  { id: "mend", name: "Mend", description: "Restore a small amount of health.", target: "single-ally", effect: "heal", power: 10, manaCost: 4 },
  { id: "second-wind", name: "Second Wind", description: "Recover a little mana.", target: "self", effect: "restore-mana", power: 6, manaCost: 0, levelRequired: 2 }
];

export function getAbility(id: string): AbilityDefinition | undefined {
  const ability = STARTER_ABILITIES.find(entry => entry.id === id);
  return ability ? { ...ability } : undefined;
}
