import { describe, expect, it } from "vitest";
import { GameRuntime } from "./GameRuntime";

const mapDocument = {
  type: "map" as const,
  width: 3,
  height: 3,
  tilewidth: 16,
  tileheight: 16,
  tilesets: [{
    firstgid: 1,
    tiles: [{ id: 0, properties: [{ name: "kind", value: "grass" }] }]
  }],
  layers: [
    { name: "tileLayer", type: "tilelayer" as const, data: [1, 1, 1, 1, 1, 1, 1, 1, 1] },
    { name: "collisionLayer", type: "tilelayer" as const, data: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: "npcLayer", type: "objectgroup" as const, objects: [
      { id: 7, type: "npc", name: "Elder", x: 16, y: 16 }
    ] }
  ]
};

describe("GameRuntime Tiled integration", () => {
  it("creates a playable session from an authored map and exposes map runtime metadata", () => {
    const game = GameRuntime.createFromTiledMap({
      seed: 1,
      characterName: "Ada",
      characterClass: "Fighter",
      mapId: "village",
      mapName: "Village",
      document: mapDocument,
      spawn: { x: 1, y: 1 }
    });

    expect(game.session.map.data.id).toBe("village");
    expect(game.session.position).toEqual({ x: 1, y: 1 });
    expect(game.tiledWorld?.npcAt({ x: 1, y: 1 })?.name).toBe("Elder");
    expect(game.session.inventory.list().length).toBe(0);
  });

  it("automatically transitions through a registered warp after movement", () => {
    const targetDocument = {
      type: "map" as const,
      width: 3, height: 3, tilewidth: 16, tileheight: 16,
      tilesets: [{ firstgid: 1, tiles: [{ id: 0, properties: [{ name: "kind", value: "grass" }] }] }],
      layers: [
        { name: "tileLayer", type: "tilelayer" as const, data: [1, 1, 1, 1, 1, 1, 1, 1, 1] },
        { name: "collisionLayer", type: "tilelayer" as const, data: [0, 0, 0, 0, 0, 0, 0, 0, 0] }
      ]
    };
    const sourceDocument = {
      ...targetDocument,
      layers: [
        ...targetDocument.layers,
        { name: "warpLayer", type: "objectgroup" as const, objects: [{
          id: 20, type: "warp", x: 16, y: 0,
          properties: [
            { name: "map", value: "north-road" },
            { name: "col", value: 1 },
            { name: "row", value: 1 }
          ]
        }] }
      ]
    };
    const game = GameRuntime.createFromTiledMap({
      seed: 2, characterName: "Ada", characterClass: "Fighter",
      mapId: "starter-village", mapName: "Starter Village",
      document: sourceDocument, spawn: { x: 0, y: 0 },
      additionalMaps: [{ mapId: "north-road", mapName: "North Road", document: targetDocument }]
    });

    expect(game.move("east")).toBe(true);
    expect(game.lastWarpResolution?.status).toBe("ready");
    expect(game.session.map.data.id).toBe("north-road");
    expect(game.session.position).toEqual({ x: 1, y: 1 });
    expect(game.tiledWorld?.source.map.data.id).toBe("north-road");
  });

  it("does not change maps when a warp target has not been loaded", () => {
    const sourceDocument = {
      ...mapDocument,
      layers: [
        ...mapDocument.layers,
        { name: "warpLayer", type: "objectgroup" as const, objects: [{
          id: 21, type: "warp", x: 16, y: 0,
          properties: [
            { name: "map", value: "not-loaded" },
            { name: "col", value: 1 },
            { name: "row", value: 1 }
          ]
        }] }
      ]
    };
    const game = GameRuntime.createFromTiledMap({
      seed: 3, characterName: "Ada", characterClass: "Fighter",
      mapId: "field", mapName: "Field", document: sourceDocument, spawn: { x: 0, y: 0 }
    });
    expect(game.move("east")).toBe(true);
    expect(game.lastWarpResolution?.status).toBe("missing-map");
    expect(game.session.map.data.id).toBe("field");
  });

  it("rejects a spawn on a blocked tile", () => {
    const blocked = structuredClone(mapDocument);
    blocked.layers[1].data![4] = 1;
    expect(() => GameRuntime.createFromTiledMap({
      seed: 1,
      characterName: "Ada",
      characterClass: "Fighter",
      mapId: "blocked-village",
      mapName: "Blocked Village",
      document: blocked,
      spawn: { x: 1, y: 1 }
    })).toThrow("Spawn is blocked");
  });
});
