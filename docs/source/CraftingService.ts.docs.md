# CraftingService — Source Documentation

- **Document ID:** ER-DOC-FILE-CRAFTING-SERVICE-0001
- **Source ID:** ER-FILE-CRAFTING-SERVICE-0001
- **Module ID:** ER-MOD-CRAFTING-0001
- **Source backlink:** [../../src/game/inventory/CraftingService.ts](../../src/game/inventory/CraftingService.ts)
- **Master:** [../MASTER_DOCUMENTATION.md](../MASTER_DOCUMENTATION.md)
- **Status:** Implemented as a reusable inventory service

## Purpose
Validates recipe definitions, reports craftability, and consumes ingredients to produce an item in an Inventory.

## Public API
- `registerItem(item)`: adds or replaces an item catalog definition.
- `registerRecipe(recipe)`: validates and registers a recipe. IDs must be unique; output and ingredient IDs must exist; quantities must be positive integers.
- `listRecipes()`: returns cloned recipe definitions.
- `canCraft(recipeId, inventory)`: checks ingredient quantities.
- `craft(recipeId, inventory)`: returns a typed result; insufficient materials or output capacity leave ingredients untouched.

## Example
```ts
const crafting = new CraftingService(STARTER_ITEMS);
STARTER_RECIPES.forEach(recipe => crafting.registerRecipe(recipe));
const result = crafting.craft("small-potion-herbal", session.inventory);
```

## Limits
This is a local single-player inventory service. It does not persist crafting history, implement crafting stations or time costs, or coordinate multiplayer transactions. Recipe catalog data is currently starter content.
