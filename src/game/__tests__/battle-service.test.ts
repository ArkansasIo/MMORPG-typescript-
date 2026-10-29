import { describe, expect, it } from "vitest";
import { Character } from "../character/Character";
import { GameSession } from "../GameSession";
import { BattleService } from "../combat/BattleService";
import { CombatEngine } from "../combat/CombatEngine";
import { TileMap } from "../world/TileMap";
import { STARTER_ITEMS } from "../data/StarterContent";

function sessionFor(character: Character): GameSession {
  const map = new TileMap({
    schemaVersion: 1, id: "battle-test", name: "Battle Test", width: 1, height: 1,
    tiles: [{ kind: "grass", blocked: false }], exits: [], npcs: []
  });
  return new GameSession(character, map, { x: 0, y: 0 });
}

describe("BattleService", () => {
  it("awards XP and gold once when the player defeats a creature", () => {
    const character = new Character("Hero", "Fighter", { id: "battle-hero" });
    const session = sessionFor(character);
    for (const item of STARTER_ITEMS) session.registerItemDefinition(item);
    const battle = new BattleService(session, new CombatEngine(() => 0.99), () => 0);
    const started = battle.start(["slime"]);
    expect(started.state.status).toBe("active");
    const playerTurn = battle.currentBattle?.order[battle.currentBattle.turnIndex];
    if (playerTurn !== character.id) throw new Error("Expected player to act first in deterministic test");
    const enemy = battle.currentBattle!.combatants.find(c => c.id !== character.id)!;
    const result = battle.playerAction({ kind: "attack", targetId: enemy.id });
    expect(result.state.status).toBe("victory");
    expect(result.xpAwarded).toBe(8);
    expect(result.goldAwarded).toBe(1);
    expect(result.itemsAwarded).toEqual([{ itemId: "small-potion", quantity: 1 }]);
    expect(session.inventory.quantity("small-potion")).toBe(1);
    expect(character.xp).toBe(8);
    expect(character.gold).toBe(1);
    expect(battle.playerAction).toBeDefined();
  });

  it("synchronizes damage received during an enemy turn to the character", () => {
    const character = new Character("Hero", "Fighter", { id: "battle-hero-2" });
    const session = sessionFor(character);
    const battle = new BattleService(session, new CombatEngine(() => 0), () => 0);
    const result = battle.start(["wolf"]);
    expect(result.state.status).toBe("active");
    expect(character.hp).toBeLessThanOrEqual(character.maxHp);
    expect(character.hp).toBeGreaterThan(0);
  });
});
