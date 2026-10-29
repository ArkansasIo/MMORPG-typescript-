import { describe, expect, it } from "vitest";
import { Character } from "../character/Character";
import { GameSession } from "../GameSession";
import { decodeSave, encodeSave } from "../persistence/SaveCodec";
import { TileMap } from "../world/TileMap";

function createSave() {
  const map = new TileMap({
    schemaVersion: 1, id: "save-map", name: "Save Map", width: 1, height: 1,
    tiles: [{ kind: "grass", blocked: false }], exits: [], npcs: []
  });
  return new GameSession(new Character("Saver", "Ranger", { id: "save-hero" }), map, { x: 0, y: 0 }).save();
}

describe("Save codec", () => {
  it("round-trips a versioned session snapshot", () => {
    const source = createSave();
    expect(decodeSave(encodeSave(source))).toEqual(source);
  });

  it("rejects malformed JSON and unknown save versions", () => {
    expect(() => decodeSave("{broken")).toThrow("JSON");
    expect(() => decodeSave(JSON.stringify({ schemaVersion: 999 }))).toThrow("version");
  });

  it("rejects corrupted inventory stacks", () => {
    const source = createSave();
    source.inventory = [{ itemId: "potion", quantity: 0 }];
    expect(() => encodeSave(source)).toThrow("inventory");
  });

  it("returns a detached object when decoding", () => {
    const source = createSave();
    const loaded = decodeSave(encodeSave(source));
    loaded.position.x = 123;
    expect(source.position.x).toBe(0);
  });
});
