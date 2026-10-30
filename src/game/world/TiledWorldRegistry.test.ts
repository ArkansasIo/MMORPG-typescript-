import { describe, expect, it } from "vitest";
import { loadTiledMap } from "./TiledMapLoader";
import { TiledWorldRegistry } from "./TiledWorldRegistry";

function map(id: string, options: { target?: string; x?: number; y?: number; blocked?: boolean } = {}) {
  const ground = [1, 1, 1, 1];
  return loadTiledMap({
    type: "map", width: 2, height: 2, tilewidth: 16, tileheight: 16,
    tilesets: [{ firstgid: 1, tiles: [{ id: 0, properties: [{ name: "kind", value: "grass" }] }] }],
    layers: [
      { name: "tileLayer", type: "tilelayer", data: ground },
      { name: "collisionLayer", type: "tilelayer", data: options.blocked ? [1, 0, 0, 0] : [0, 0, 0, 0] },
      ...(options.target ? [{ name: "warpLayer", type: "objectgroup" as const, objects: [{
        id: 1, type: "warp", x: 0, y: 0,
        properties: [
          { name: "map", value: options.target },
          { name: "col", value: options.x ?? 0 },
          { name: "row", value: options.y ?? 0 }
        ]
      }] }] : [])
    ]
  }, { id, name: id });
}

describe("TiledWorldRegistry", () => {
  it("resolves a warp only when the target map and destination are walkable", () => {
    const registry = new TiledWorldRegistry([map("field", { target: "village", x: 1, y: 1 }), map("village")]);
    const result = registry.resolveWarp("field", { x: 0, y: 0 });
    expect(result?.status).toBe("ready");
    if (result?.status === "ready") {
      expect(result.targetMapId).toBe("village");
      expect(result.position).toEqual({ x: 1, y: 1 });
      expect(result.target.source.map.data.id).toBe("village");
    }
  });

  it("reports a missing target map without fabricating a destination", () => {
    const registry = new TiledWorldRegistry([map("field", { target: "missing" })]);
    expect(registry.resolveWarp("field", { x: 0, y: 0 })).toMatchObject({
      status: "missing-map", sourceMapId: "field", targetMapId: "missing"
    });
  });

  it("rejects blocked or out-of-bounds destinations", () => {
    const blocked = new TiledWorldRegistry([map("field", { target: "village" }), map("village", { blocked: true })]);
    expect(blocked.resolveWarp("field", { x: 0, y: 0 })?.status).toBe("blocked-destination");

    const outside = new TiledWorldRegistry([map("field", { target: "village", x: 9 }), map("village")]);
    expect(outside.resolveWarp("field", { x: 0, y: 0 })?.status).toBe("blocked-destination");
  });

  it("returns undefined when the player is not standing on a warp", () => {
    const registry = new TiledWorldRegistry([map("field", { target: "village" }), map("village")]);
    expect(registry.resolveWarp("field", { x: 1, y: 1 })).toBeUndefined();
  });

  it("prevents duplicate map ids and rejects unknown source maps", () => {
    const registry = new TiledWorldRegistry([map("field")]);
    expect(() => registry.register(map("field"))).toThrow(/already contains/);
    expect(() => registry.resolveWarp("unknown", { x: 0, y: 0 })).toThrow(/Unknown source map/);
  });
});
