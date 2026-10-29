/**
 * @file-id ER-FILE-CRAFTING-SERVICE-0001
 * @module-id ER-MOD-CRAFTING-0001
 * @doc ../../../docs/source/CraftingService.ts.docs.md
 * @master-doc ../../../docs/MASTER_DOCUMENTATION.md
 * Purpose: validate recipes and convert inventory materials into crafted items.
 */
import { Inventory, type ItemDefinition } from "./Inventory";

export interface RecipeIngredient {
  itemId: string;
  quantity: number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  output: { itemId: string; quantity: number };
  description?: string;
}

export type CraftResult =
  | { success: true; recipeId: string; outputItemId: string; outputQuantity: number; message: string }
  | { success: false; recipeId: string; message: string };

export class CraftingService {
  private readonly recipes = new Map<string, CraftingRecipe>();
  private readonly catalog = new Map<string, ItemDefinition>();

  constructor(items: ItemDefinition[] = []) {
    for (const item of items) this.registerItem(item);
  }

  registerItem(item: ItemDefinition): void {
    if (!item.id.trim()) throw new Error("Crafting item requires an ID");
    this.catalog.set(item.id, { ...item });
  }

  registerRecipe(recipe: CraftingRecipe): void {
    if (!recipe.id.trim() || !recipe.name.trim()) throw new Error("Recipe requires an ID and name");
    if (this.recipes.has(recipe.id)) throw new Error(`Duplicate recipe: ${recipe.id}`);
    if (!recipe.ingredients.length || !Number.isInteger(recipe.output.quantity) || recipe.output.quantity < 1) {
      throw new Error("Recipe requires ingredients and a positive output quantity");
    }
    if (!this.catalog.has(recipe.output.itemId)) throw new Error(`Unknown recipe output: ${recipe.output.itemId}`);
    const seen = new Set<string>();
    for (const ingredient of recipe.ingredients) {
      if (!this.catalog.has(ingredient.itemId)) throw new Error(`Unknown recipe ingredient: ${ingredient.itemId}`);
      if (!Number.isInteger(ingredient.quantity) || ingredient.quantity < 1 || seen.has(ingredient.itemId)) {
        throw new Error("Recipe ingredients must be unique and have positive integer quantities");
      }
      if (ingredient.itemId === recipe.output.itemId) throw new Error("Recipe output cannot also be an ingredient");
      seen.add(ingredient.itemId);
    }
    this.recipes.set(recipe.id, structuredClone(recipe));
  }

  listRecipes(): CraftingRecipe[] {
    return [...this.recipes.values()].map(recipe => structuredClone(recipe));
  }

  canCraft(recipeId: string, inventory: Inventory): boolean {
    const recipe = this.requireRecipe(recipeId);
    return recipe.ingredients.every(ingredient => inventory.quantity(ingredient.itemId) >= ingredient.quantity);
  }

  craft(recipeId: string, inventory: Inventory): CraftResult {
    const recipe = this.requireRecipe(recipeId);
    const missing = recipe.ingredients.filter(ingredient => inventory.quantity(ingredient.itemId) < ingredient.quantity);
    if (missing.length) {
      return { success: false, recipeId, message: `Missing materials: ${missing.map(item => item.itemId).join(", ")}.` };
    }
    const output = this.catalog.get(recipe.output.itemId)!;
    if (!inventory.add(output, recipe.output.quantity)) {
      return { success: false, recipeId, message: "Inventory has no room for the crafted item." };
    }
    for (const ingredient of recipe.ingredients) {
      if (!inventory.remove(ingredient.itemId, ingredient.quantity)) {
        inventory.remove(output.id, recipe.output.quantity);
        return { success: false, recipeId, message: "Crafting was cancelled because the inventory changed." };
      }
    }
    return {
      success: true,
      recipeId,
      outputItemId: recipe.output.itemId,
      outputQuantity: recipe.output.quantity,
      message: `Crafted ${recipe.output.quantity} × ${output.name}.`
    };
  }

  private requireRecipe(id: string): CraftingRecipe {
    const recipe = this.recipes.get(id);
    if (!recipe) throw new Error(`Unknown recipe: ${id}`);
    return recipe;
  }
}
