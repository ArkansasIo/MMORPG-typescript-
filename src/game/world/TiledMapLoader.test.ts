import { describe, expect, it } from "vitest";
import { loadTiledMap } from "./TiledMapLoader";

const fixture = {
  type: "map", width: 3, height: 2, tilewidth: 16, tileheight: 16,
  properties: [{ name: "logicFile", type: "string", value: "meadow.ts" }],
  tilesets: [{ firstgid: 1, tiles: [
    { id: 0, properties: [{ name: "kind", value: "grass" }] },
    { id: 1, properties: [{ name: "kind", value: "water" }] },
    { id: 2, properties: [{ name: "kind", value: "town" }] }
  ] }],
  layers: [
    { name: "tileLayer", type: "tilelayer", data: [1, 1, 3, 1, 2, 1] },
    { name: "collisionLayer", type: "tilelayer", data: [0, 0, 1, 0, 0, 0] },
    { name: "enemyTerritoryLayer", type: "tilelayer", data: [0, 4, 0, 0, 0, 0] },
    { name: "warpLayer", type: "objectgroup", objects: [
      { id: 10, type: "warp", x: 32, y: 16, properties: [
        { name: "map", value: "town-square" }, { name: "col", value: 2 },
        { name: "row", value: 1 }, { name: "dir", value: "west" }
      ] }
    ] },
    { name: "npcLayer", type: "objectgroup", objects: [
      { id: 11, type: "npc", name: "Village Elder", x: 16, y: 16, properties: [
        { name: "type", value: "elder" }, { name: "wanders", value: false }
      ] },
      { id: 12, type: "door", x: 0, y: 16, properties: [{ name: "replacementTileIndex", value: 3 }] },
      { id: 13, type: "talkAcross", x: 16, y: 0 }
    ] }
  ]
};

describe("loadTiledMap", () => {
  it("converts Tiled terrain, collision and enemy territory into a TileMap", () => {
    const result = loadTiledMap(fixture, { id: "test-map", name: "Test Map" });
    expect(result.map.width).toBe(3);
    expect(result.map.getTile(1, 0)?.encounterTableId).toBe("4");
    expect(result.map.getTile(2, 0)?.blocked).toBe(true);
    expect(result.map.getTile(1, 1)?.kind).toBe("water");
  });

  it("loads warps, NPCs, doors, talk-across objects and map metadata", () => {
    const result = loadTiledMap(fixture, { id: "test-map", name: "Test Map" });
    expect(result.warps[0]).toMatchObject({ targetMapId: "town-square", targetX: 2, targetY: 1, direction: "west" });
    expect(result.npcs[0]).toMatchObject({ name: "Village Elder", dialogueId: "meadow-elder", npcType: "elder" });
    expect(result.doors[0]).toMatchObject({ replacementTileIndex: 3, x: 0, y: 1 });
    expect(result.talkAcross).toEqual([{ x: 1, y: 0 }]);
    expect(result.logicFile).toBe("meadow.ts");
  });

  it("rejects invalid layer dimensions and malformed warps", () => {
    expect(() => loadTiledMap({ ...fixture, layers: [{ name: "tileLayer", type: "tilelayer", data: [1] }] }, { id: "x", name: "X" })).toThrow();
    const broken = structuredClone(fixture);
    const warpLayer = broken.layers[3] as { objects: Array<{ properties: Array<{ name: string; value: string | number | boolean }> }> };
    warpLayer.objects[0].properties = [];
    expect(() => loadTiledMap(broken, { id: "x", name: "X" })).toThrow(/Warp object/);
  });
});
