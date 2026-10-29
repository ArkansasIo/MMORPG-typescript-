import { GameRuntime, type RuntimeOptions } from "./GameRuntime";
import { ConsumableService } from "./inventory/ConsumableService";
import { CraftingService, type CraftResult, type CraftingRecipe } from "./inventory/CraftingService";
import { STARTER_ITEMS } from "./data/StarterContent";
import { STARTER_RECIPES } from "./data/Recipes";
import { STARTER_CONSUMABLES } from "./data/Consumables";
import { InteractionService } from "./interactions/InteractionService";
import { STARTER_DIALOGUE } from "./data/Dialogue";
import { SaveRepository, type SaveStorage } from "./persistence/SaveRepository";
import type { Direction } from "./world/CollisionSystem";
import type { InteractionResult } from "./interactions/InteractionService";
import type { ConsumableResult } from "./inventory/ConsumableService";

/** UI-facing facade; framework-independent and safe to test without a browser DOM. */
export class BrowserGameController {
  private runtime?: GameRuntime;
  private interactions?: InteractionService;
  private readonly saves: SaveRepository;
  private readonly consumables = new ConsumableService();
  private readonly crafting = new CraftingService(STARTER_ITEMS);

  constructor(storage: SaveStorage, namespace = "earthbound-realms") {
    this.saves = new SaveRepository({ storage, namespace });
    STARTER_CONSUMABLES.forEach(definition => this.consumables.register(definition));
    STARTER_RECIPES.forEach(recipe => this.crafting.registerRecipe(recipe));
  }

  get game(): GameRuntime {
    if (!this.runtime) throw new Error("Start a new game or load a save first");
    return this.runtime;
  }

  startNew(options: RuntimeOptions): GameRuntime {
    this.runtime = GameRuntime.create(options);
    this.interactions = new InteractionService(this.runtime.session, STARTER_DIALOGUE);
    return this.runtime;
  }

  continueGame(slot = "main"): GameRuntime {
    const save = this.saves.load(slot);
    if (!save) throw new Error(`No saved game exists in slot: ${slot}`);
    this.runtime = GameRuntime.restore(save);
    this.interactions = new InteractionService(this.runtime.session, STARTER_DIALOGUE);
    return this.runtime;
  }

  saveGame(slot = "main"): void {
    this.saves.save(slot, this.game.save());
  }

  hasSave(slot = "main"): boolean { return this.saves.has(slot); }
  deleteSave(slot = "main"): void { this.saves.delete(slot); }

  move(direction: Direction): boolean { return this.game.move(direction); }

  useItem(itemId: string): ConsumableResult {
    return this.consumables.use(itemId, this.game.session.inventory, this.game.session.character);
  }

  listRecipes(): CraftingRecipe[] { return this.crafting.listRecipes(); }

  craftItem(recipeId: string): CraftResult {
    return this.crafting.craft(recipeId, this.game.session.inventory);
  }

  canCraft(recipeId: string): boolean {
    return this.crafting.canCraft(recipeId, this.game.session.inventory);
  }

  beginDialogue(treeId: string) {
    if (!this.interactions) throw new Error("Start a new game or load a save first");
    return this.interactions.beginDialogue(treeId);
  }

  chooseDialogue(treeId: string, nodeId: string, choiceId: string): InteractionResult {
    if (!this.interactions) throw new Error("Start a new game or load a save first");
    return this.interactions.chooseDialogue(treeId, nodeId, choiceId);
  }
}
