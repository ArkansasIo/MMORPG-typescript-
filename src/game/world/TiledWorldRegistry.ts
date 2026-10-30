/**
 * @file-id ER-FILE-TILED-WORLD-REGISTRY-0001
 * @module-id ER-MOD-WORLD-0001
 * @doc ../../../docs/source/TiledWorldRegistry.ts.docs.md
 * @master-doc ../../../docs/MASTER_DOCUMENTATION.md
 * Resolves cross-map warp destinations across validated authored Tiled maps.
 */
import type { Position } from "./CollisionSystem";
import type { TiledMapResult, TiledWarp } from "./TiledMapLoader";
import { TiledMapRuntime } from "./TiledMapRuntime";

export type WarpResolution =
  | { status: "ready"; warp: TiledWarp; sourceMapId: string; targetMapId: string; position: Position; target: TiledMapRuntime }
  | { status: "missing-map"; warp: TiledWarp; sourceMapId: string; targetMapId: string }
  | { status: "blocked-destination"; warp: TiledWarp; sourceMapId: string; targetMapId: string; position: Position };

/**
 * In-memory catalog for authored maps. It validates that warp targets exist,
 * are in bounds, and are walkable before returning a transition candidate.
 * It deliberately does not mutate a GameSession; the caller owns session swapping.
 */
export class TiledWorldRegistry {
  private readonly maps = new Map<string, TiledMapRuntime>();

  constructor(maps: TiledMapResult[] = []) {
    for (const map of maps) this.register(map);
  }

  register(map: TiledMapResult): TiledMapRuntime {
    const id = map.map.data.id;
    if (!id.trim()) throw new Error("Tiled world map id is required");
    if (this.maps.has(id)) throw new Error(`Tiled world already contains map: ${id}`);
    const runtime = new TiledMapRuntime(map);
    this.maps.set(id, runtime);
    return runtime;
  }

  get(mapId: string): TiledMapRuntime | undefined {
    return this.maps.get(mapId);
  }

  has(mapId: string): boolean {
    return this.maps.has(mapId);
  }

  get mapIds(): string[] {
    return [...this.maps.keys()];
  }

  resolveWarp(sourceMapId: string, position: Position): WarpResolution | undefined {
    const source = this.maps.get(sourceMapId);
    if (!source) throw new Error(`Unknown source map: ${sourceMapId}`);
    const warp = source.warpAt(position);
    if (!warp) return undefined;

    const target = this.maps.get(warp.targetMapId);
    if (!target) return { status: "missing-map", warp, sourceMapId, targetMapId: warp.targetMapId };

    const destination = { x: warp.targetX, y: warp.targetY };
    const tile = target.source.map.getTile(destination.x, destination.y);
    if (!tile || tile.blocked) {
      return {
        status: "blocked-destination",
        warp,
        sourceMapId,
        targetMapId: warp.targetMapId,
        position: destination
      };
    }

    return {
      status: "ready",
      warp,
      sourceMapId,
      targetMapId: warp.targetMapId,
      position: destination,
      target
    };
  }
}
