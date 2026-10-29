import type { Combatant, DamageType } from "../types";

export interface CreatureDefinition extends Combatant {
  species: string;
  xpReward: number;
  goldMin: number;
  goldMax: number;
  encounterWeight: number;
}

const baseline = {
  level: 1,
  abilities: { strength: 10, dexterity: 10, constitution: 10, intelligence: 5, wisdom: 8, charisma: 5 },
  proficiencyBonus: 2
};

export const CREATURES: Record<string, CreatureDefinition> = {
  slime: {
    ...baseline, id: "slime", name: "Meadow Slime", species: "slime",
    hp: 12, maxHp: 12, defense: 8, speed: 1, attackBonus: 2, damage: 3,
    damageType: "physical" as DamageType, xpReward: 8, goldMin: 1, goldMax: 3, encounterWeight: 50
  },
  wolf: {
    ...baseline, id: "wolf", name: "Grey Wolf", species: "beast",
    hp: 18, maxHp: 18, defense: 12, speed: 4, attackBonus: 4, damage: 5,
    damageType: "physical" as DamageType, xpReward: 15, goldMin: 2, goldMax: 6, encounterWeight: 30,
    abilities: { ...baseline.abilities, dexterity: 14, constitution: 12 }
  },
  skeleton: {
    ...baseline, id: "skeleton", name: "Roadside Skeleton", species: "undead",
    hp: 16, maxHp: 16, defense: 11, speed: 2, attackBonus: 3, damage: 4,
    damageType: "physical" as DamageType, resistances: ["poison"], xpReward: 18, goldMin: 3, goldMax: 8, encounterWeight: 20,
    abilities: { ...baseline.abilities, strength: 12, constitution: 12 }
  }
};

export function getCreature(id: string): CreatureDefinition {
  const creature = CREATURES[id];
  if (!creature) throw new Error(`Unknown creature: ${id}`);
  return structuredClone(creature);
}

export function listCreatures(): CreatureDefinition[] {
  return Object.values(CREATURES).map(creature => structuredClone(creature));
}
