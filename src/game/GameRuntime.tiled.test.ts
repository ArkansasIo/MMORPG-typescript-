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

  it("rejects a spawn on a blocked tile", () => {
    const blocked = structuredClone(mapDocument);
    blocked.layers[1].data[4] = 1;
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
