export interface LootDropDefinition {
  itemId: string;
  chance: number;
  minQuantity: number;
  maxQuantity: number;
}

export const LOOT_TABLES: Record<string, LootDropDefinition[]> = {
  slime: [{ itemId: "small-potion", chance: 0.12, minQuantity: 1, maxQuantity: 1 }],
  wolf: [{ itemId: "healing-herb", chance: 0.45, minQuantity: 1, maxQuantity: 2 }],
  skeleton: [
    { itemId: "healing-herb", chance: 0.35, minQuantity: 1, maxQuantity: 2 },
    { itemId: "travel-cloak", chance: 0.08, minQuantity: 1, maxQuantity: 1 }
  ]
};

export interface ItemDrop {
  itemId: string;
  quantity: number;
}

export function rollLoot(creatureId: string, random: () => number = Math.random): ItemDrop[] {
  const table = LOOT_TABLES[creatureId] ?? [];
  const drops: ItemDrop[] = [];
  for (const entry of table) {
    const chanceRoll = random();
    if (!Number.isFinite(chanceRoll) || chanceRoll < 0 || chanceRoll >= 1) {
      throw new RangeError("Random source must return a value in [0, 1)");
    }
    if (chanceRoll >= entry.chance) continue;
    const quantityRoll = random();
    if (!Number.isFinite(quantityRoll) || quantityRoll < 0 || quantityRoll >= 1) {
      throw new RangeError("Random source must return a value in [0, 1)");
    }
    const quantity = entry.minQuantity + Math.floor(quantityRoll * (entry.maxQuantity - entry.minQuantity + 1));
    drops.push({ itemId: entry.itemId, quantity });
  }
  return drops;
}
