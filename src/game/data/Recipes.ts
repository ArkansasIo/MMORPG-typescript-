/**
 * @file-id ER-FILE-STARTER-RECIPES-0001
 * @module-id ER-MOD-CRAFTING-0001
 * @doc ../../../docs/source/Recipes.ts.docs.md
 * @master-doc ../../../docs/MASTER_DOCUMENTATION.md
 * Purpose: starter crafting recipes available in the first region.
 */
import type { CraftingRecipe } from "../inventory/CraftingService";

export const STARTER_RECIPES: CraftingRecipe[] = [
  {
    id: "small-potion-herbal",
    name: "Brew a Small Potion",
    description: "Combine two healing herbs into a basic restorative potion.",
    ingredients: [{ itemId: "healing-herb", quantity: 2 }],
    output: { itemId: "small-potion", quantity: 1 }
  },
  {
    id: "travel-cloak",
    name: "Patch a Travel Cloak",
    description: "Use four healing herbs as sturdy plant-fiber material for a travel cloak.",
    ingredients: [{ itemId: "healing-herb", quantity: 4 }],
    output: { itemId: "travel-cloak", quantity: 1 }
  }
];
