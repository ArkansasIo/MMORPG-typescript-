import { CREATURES, type CreatureDefinition } from "./Creatures";

export interface EncounterTable {
  id: string;
  name: string;
  creatureIds: string[];
}

export const ENCOUNTER_TABLES: Record<string, EncounterTable> = {
  meadow: { id: "meadow", name: "Meadow Encounters", creatureIds: ["slime", "slime", "wolf"] },
  oldRoad: { id: "old-road", name: "Old Road Encounters", creatureIds: ["slime", "wolf", "skeleton"] }
};

export function rollEncounter(tableId: string, random: () => number = Math.random): CreatureDefinition {
  const table = ENCOUNTER_TABLES[tableId];
  if (!table) throw new Error(`Unknown encounter table: ${tableId}`);
  const available = table.creatureIds.map(id => CREATURES[id]).filter((creature): creature is CreatureDefinition => creature !== undefined);
  if (available.length === 0) throw new Error(`Encounter table has no valid creatures: ${tableId}`);
  const total = available.reduce((sum, creature) => sum + creature.encounterWeight, 0);
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError("Random source must return a value in [0, 1)");
  }
  let cursor = value * total;
  for (const creature of available) {
    cursor -= creature.encounterWeight;
    if (cursor < 0) return structuredClone(creature);
  }
  return structuredClone(available[available.length - 1]);
}
