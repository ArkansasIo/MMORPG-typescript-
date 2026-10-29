import { describe, expect, it } from "vitest";
import { Character } from "../character/Character";
import { GameSession } from "../GameSession";
import { TileMap } from "../world/TileMap";
import { SaveRepository, type SaveStorage } from "../persistence/SaveRepository";

class MemoryStorage implements SaveStorage {
  values = new Map<string, string>();
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  setItem(key: string, value: string): void { this.values.set(key, value); }
  removeItem(key: string): void { this.values.delete(key); }
}
function sampleSave() {
  const map = new TileMap({ schemaVersion: 1, id: "map", name: "Map", width: 1, height: 1, tiles: [{ kind: "grass", blocked: false }], exits: [], npcs: [] });
  return new GameSession(new Character("Hero", "Fighter", { id: "hero" }), map, { x: 0, y: 0 }).save();
}
describe("SaveRepository", () => {
  it("round-trips a validated save in a named slot", () => {
    const storage = new MemoryStorage();
    const repository = new SaveRepository({ storage });
    const save = sampleSave();
    repository.save("slot-1", save);
    expect(repository.has("slot-1")).toBe(true);
    expect(repository.load("slot-1")).toEqual(save);
    repository.delete("slot-1");
    expect(repository.load("slot-1")).toBeUndefined();
  });
  it("rejects unsafe slot names and oversized saves", () => {
    const storage = new MemoryStorage();
    const repository = new SaveRepository({ storage, maxSerializedBytes: 5 });
    expect(() => repository.save("../bad", sampleSave())).toThrow(/slot/);
    expect(() => repository.save("main", sampleSave())).toThrow(/size limit/);
  });
  it("rejects corrupted serialized data when loading", () => {
    const storage = new MemoryStorage();
    storage.setItem("earthbound-realms:save:main", "{broken");
    const repository = new SaveRepository({ storage });
    expect(() => repository.load("main")).toThrow(/valid JSON/);
  });
});
