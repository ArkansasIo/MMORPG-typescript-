import { describe, expect, it } from "vitest";
import { Character } from "../character/Character";
import { GameSession } from "../GameSession";
import { TileMap } from "../world/TileMap";

function makeMap(): TileMap {
  return new TileMap({
    schemaVersion: 1, id: "starter", name: "Starter Meadow", width: 2, height: 1,
    tiles: [{ kind: "grass", blocked: false }, { kind: "town", blocked: false }],
    exits: [], npcs: []
  });
}

describe("Integrated game session", () => {
  it("moves through walkable tiles and rejects blocked or out-of-bounds movement", () => {
    const map = new TileMap({
      schemaVersion: 1, id: "test", name: "Test", width: 2, height: 1,
      tiles: [{ kind: "grass", blocked: false }, { kind: "wall", blocked: true }],
      exits: [], npcs: []
    });
    const session = new GameSession(new Character("Hero", "Fighter", { id: "hero" }), map, { x: 0, y: 0 });
    expect(session.move("east")).toBe(false);
    expect(session.move("west")).toBe(false);
    expect(session.position).toEqual({ x: 0, y: 0 });
  });

  it("awards quest XP and gold once when movement completes an objective", () => {
    const character = new Character("Hero", "Fighter", { id: "hero" });
    const session = new GameSession(character, makeMap(), { x: 0, y: 0 });
    session.registerQuest({
      id: "visit-town", title: "Visit Town", description: "Walk into the town.",
      prerequisites: [],
      objectives: [{ id: "enter-town", kind: "visit", targetId: "starter:1,0", required: 1 }],
      reward: { xp: 25, gold: 7 }
    });
    expect(session.acceptQuest("visit-town")).toBe(true);
    expect(session.move("east")).toBe(true);
    expect(session.quests.getProgress("visit-town").status).toBe("completed");
    expect(character.gold).toBe(7);
    expect(session.recordObjective("visit", "starter:1,0").completedQuestIds).toEqual([]);
    expect(character.gold).toBe(7);
  });

  it("creates an isolated save snapshot", () => {
    const session = new GameSession(new Character("Hero", "Fighter", { id: "hero" }), makeMap(), { x: 0, y: 0 });
    const save = session.save();
    save.position.x = 99;
    expect(session.position).toEqual({ x: 0, y: 0 });
    expect(session.save().schemaVersion).toBe(1);
    expect(session.save().mapId).toBe("starter");
  });

  it("rejects a blocked spawn", () => {
    const map = new TileMap({
      schemaVersion: 1, id: "blocked", name: "Blocked", width: 1, height: 1,
      tiles: [{ kind: "wall", blocked: true }], exits: [], npcs: []
    });
    expect(() => new GameSession(new Character("Hero", "Fighter"), map, { x: 0, y: 0 })).toThrow("blocked");
  });
});
