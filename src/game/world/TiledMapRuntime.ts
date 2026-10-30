/**
 * @file-id ER-FILE-TILED-MAP-RUNTIME-0001
 * @module-id ER-MOD-WORLD-0001
 * @doc ../../../docs/source/TiledMapRuntime.ts.docs.md
 * @master-doc ../../../docs/MASTER_DOCUMENTATION.md
 * Runtime helpers for map transitions, keyed doors, NPC lookup and encounter regions.
 */
import type { Position } from "./CollisionSystem";
import type { TiledMapResult } from "./TiledMapLoader";

export type TiledVisualLayer = "ground" | "overlay";

export class TiledMapRuntime {
  private readonly openedDoors = new Set<string>();
  private readonly groundGids: number[];
  private readonly overlayGids?: number[];

  constructor(readonly source: TiledMapResult) {
    this.groundGids = [...source.tileLayerGids];
    this.overlayGids = source.secondTileLayerGids ? [...source.secondTileLayerGids] : undefined;
  }

  warpAt(position: Position) {
    return this.source.warps.find(warp => warp.x === position.x && warp.y === position.y);
  }

  npcAt(position: Position) {
    return this.source.npcs.find(npc => npc.x === position.x && npc.y === position.y);
  }

  canTalkAcross(position: Position): boolean {
    return this.source.talkAcross.some(marker => marker.x === position.x && marker.y === position.y);
  }

  encounterTableAt(position: Position): string | undefined {
    return this.source.map.getTile(position.x, position.y)?.encounterTableId;
  }

  isDoorOpen(doorId: string): boolean {
    return this.openedDoors.has(doorId);
  }

  /** A key is consumed only after a matching, still-closed door is found. */
  openDoor(doorId: string, consumeKey: () => boolean): boolean {
    const door = this.source.doors.find(entry => entry.id === doorId);
    if (!door) return false;
    if (this.openedDoors.has(doorId)) return true;
    if (!consumeKey()) return false;
    this.openedDoors.add(doorId);
    this.groundGids[door.y * this.source.map.width + door.x] = door.replacementTileIndex;
    return true;
  }

  tileGidAt(position: Position, layer: TiledVisualLayer = "ground"): number | undefined {
    const { x, y } = position;
    if (!this.source.map.inBounds(x, y)) return undefined;
    const data = layer === "overlay" ? this.overlayGids : this.groundGids;
    return data?.[y * this.source.map.width + x];
  }

  get openedDoorIds(): string[] {
    return [...this.openedDoors];
  }
}
