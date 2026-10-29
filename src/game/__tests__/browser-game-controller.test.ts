import { describe, expect, it } from "vitest";
import { BrowserGameController } from "../BrowserGameController";
import type { SaveStorage } from "../persistence/SaveRepository";

class MemoryStorage implements SaveStorage {
  private readonly data = new Map<string, string>();
  getItem(key: string): string | null { return this.data.get(key) ?? null; }
  setItem(key: string, value: string): void { this.data.set(key, value); }
  removeItem(key: string): void { this.data.delete(key); }
}
describe("BrowserGameController", () => {
  it("starts, saves, and continues a game in a named slot", () => {
    const storage = new MemoryStorage();
    const controller = new BrowserGameController(storage);
    controller.startNew({ seed: 55, characterName: "Mira", characterClass: "Cleric", characterId: "mira" });
    controller.game.session.character.gold = 123;
    controller.saveGame("slot-a");
    expect(controller.hasSave("slot-a")).toBe(true);
    const resumed = new BrowserGameController(storage);
    resumed.continueGame("slot-a");
    expect(resumed.game.session.character.name).toBe("Mira");
    expect(resumed.game.session.character.gold).toBe(123);
    expect(resumed.game.session.inventory.quantity("small-potion")).toBe(2);
  });
  it("uses an inventory potion and refuses to consume it at full health", () => {
    const controller = new BrowserGameController(new MemoryStorage());
    controller.startNew({ seed: 55, characterName: "Mira", characterClass: "Cleric", characterId: "mira" });
    const hero = controller.game.session.character;
    hero.takeDamage(10);
    expect(controller.useItem("small-potion").success).toBe(true);
    expect(controller.game.session.inventory.quantity("small-potion")).toBe(1);
    hero.heal(999);
    expect(controller.useItem("small-potion").success).toBe(false);
    expect(controller.game.session.inventory.quantity("small-potion")).toBe(1);
  });
  it("connects NPC dialogue to available quest progression", () => {
    const controller = new BrowserGameController(new MemoryStorage());
    controller.startNew({ seed: 55, characterName: "Mira", characterClass: "Cleric", characterId: "mira" });
    controller.game.session.recordObjective("visit", "meadow-marker");
    const result = controller.chooseDialogue("meadow-elder", "greeting", "offer-help");
    expect(result.questAccepted).toBe("slime-trouble");
  });
});

  it("crafts a recipe from starter materials through the browser controller", () => {
    const controller = new BrowserGameController(new MemoryStorage());
    controller.startNew({ seed: 55, characterName: "Mira", characterClass: "Cleric", characterId: "mira" });
    expect(controller.canCraft("small-potion-herbal")).toBe(true);
    const result = controller.craftItem("small-potion-herbal");
    expect(result.success).toBe(true);
    expect(controller.game.session.inventory.quantity("healing-herb")).toBe(2);
    expect(controller.game.session.inventory.quantity("small-potion")).toBe(3);
  });

  it("supports shop purchases and sales through the browser controller", () => {
    const controller = new BrowserGameController(new MemoryStorage());
    controller.startNew({ seed: 55, characterName: "Mira", characterClass: "Cleric", characterId: "mira" });
    const hero = controller.game.session.character;
    hero.gold = 100;
    const startingGold = hero.gold;
    expect(controller.buyItem("healing-herb", 2)).toBe(true);
    expect(hero.gold).toBe(startingGold - 8);
    expect(controller.game.session.inventory.quantity("healing-herb")).toBe(6);
    expect(controller.sellItem("healing-herb", 2)).toBe(true);
    expect(hero.gold).toBe(startingGold - 4);
    expect(controller.game.session.inventory.quantity("healing-herb")).toBe(4);
    hero.gold = 0;
    expect(controller.buyItem("iron-sword", 1)).toBe(false);
  });
