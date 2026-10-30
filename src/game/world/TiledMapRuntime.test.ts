import { describe, expect, it, vi } from "vitest";
import { loadTiledMap } from "./TiledMapLoader";
import { TiledMapRuntime } from "./TiledMapRuntime";

const source = loadTiledMap({
  type: "map", width: 2, height: 2, tilewidth: 16, tileheight: 16,
  tilesets: [{ firstgid: 1, tiles: [{ id: 0, properties: [{ name: "kind", value: "grass" }] }] }],
  layers: [
    { name: "tileLayer", type: "tilelayer", data: [1, 1, 1, 1] },
    { name: "tileLayer2", type: "tilelayer", data: [0, 0, 1, 0] },
    { name: "enemyTerritoryLayer", type: "tilelayer", data: [0, 9, 0, 0] },
    { name: "warps", type: "objectgroup", objects: [{ id: 1, type: "warp", x: 16, y: 0, properties: [
      { name: "map", value: "village" }, { name: "col", value: 0 }, { name: "row", value: 1 }
    ] }] },
    { name: "npcLayer", type: "objectgroup", objects: [
      { id: 2, type: "npc", name: "Guard", x: 0, y: 0 },
      { id: 3, type: "door", x: 16, y: 16, properties: [{ name: "replacementTileIndex", value: 7 }] },
      { id: 4, type: "talkAcross", x: 16, y: 0 }
    ] }
  ]
}, { id: "runtime-test", name: "Runtime Test" });

describe("TiledMapRuntime", () => {
  it("resolves warps, NPCs, talk-across markers and encounter regions", () => {
    const runtime = new TiledMapRuntime(source);
    expect(runtime.warpAt({ x: 1, y: 0 })?.targetMapId).toBe("village");
    expect(runtime.npcAt({ x: 0, y: 0 })?.name).toBe("Guard");
    expect(runtime.canTalkAcross({ x: 1, y: 0 })).toBe(true);
    expect(runtime.encounterTableAt({ x: 1, y: 0 })).toBe("9");
  });

  it("opens a keyed door once and updates the visual tile GID", () => {
    const runtime = new TiledMapRuntime(source);
    const consumeKey = vi.fn(() => true);
    expect(runtime.source.map.getTile(1, 1)?.blocked).toBe(true);
    expect(runtime.openDoor("3", consumeKey)).toBe(true);
    expect(runtime.tileGidAt({ x: 1, y: 1 })).toBe(7);
    expect(runtime.source.map.getTile(1, 1)).toMatchObject({ kind: "floor", blocked: false });
    expect(runtime.isDoorOpen("3")).toBe(true);
    expect(runtime.openDoor("3", consumeKey)).toBe(true);
    expect(consumeKey).toHaveBeenCalledTimes(1);
  });

  it("does not consume a key for an unknown door or failed key check", () => {
    const runtime = new TiledMapRuntime(source);
    const consumeKey = vi.fn(() => false);
    expect(runtime.openDoor("missing", consumeKey)).toBe(false);
    expect(runtime.openDoor("3", consumeKey)).toBe(false);
    expect(consumeKey).toHaveBeenCalledTimes(1);
  });

  it("retains optional overlay layer GIDs and rejects out-of-bounds access", () => {
    const runtime = new TiledMapRuntime(source);
    expect(runtime.tileGidAt({ x: 0, y: 1 }, "overlay")).toBe(1);
    expect(runtime.tileGidAt({ x: 3, y: 3 })).toBeUndefined();
  });
});
