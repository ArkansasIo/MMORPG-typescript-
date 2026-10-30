/**
 * @file-id ER-FILE-TILED-MAP-RUNTIME-0001
 * @module-id ER-MOD-WORLD-0001
 * @doc ../../../docs/source/TiledMapRuntime.ts.docs.md
 * @master-doc ../../../docs/MASTER_DOCUMENTATION.md
 * Runtime helpers for map transitions, keyed doors, NPC lookup and encounter regions.
 */
import type { Position } from "./CollisionSystem";
import type { TiledDoor, TiledMapResult, TiledNpc } from "./TiledMapLoader";

export type TiledVisualLayer = "ground" | "overlay";
export type WorldDirection = "north" | "east" | "south" | "west";

function adjacent(position: Position, direction: WorldDirection): Position {
  switch (direction) {
    case "north": return { x: position.x, y: position.y - 1 };
    case "east": return { x: position.x + 1, y: position.y };
    case "south": return { x: position.x, y: position.y + 1 };
    case "west": return { x: position.x - 1, y: position.y };
  }
}

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

  npcAt(position: Position): TiledNpc | undefined {
    return this.source.npcs.find(npc => npc.x === position.x && npc.y === position.y);
  }

  /** Find an NPC on the tile directly in front of the player. */
  npcInFrontOf(position: Position, direction: WorldDirection): TiledNpc | undefined {
    return this.npcAt(adjacent(position, direction));
  }

  doorAt(position: Position): TiledDoor | undefined {
    return this.source.doors.find(door => door.x === position.x && door.y === position.y);
  }

  /** Find a door on the tile directly in front of the player. */
  doorInFrontOf(position: Position, direction: WorldDirection): TiledDoor | undefined {
    return this.doorAt(adjacent(position, direction));
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
    const tileIndex = door.y * this.source.map.width + door.x;
    this.groundGids[tileIndex] = door.replacementTileIndex;
    const currentTile = this.source.map.data.tiles[tileIndex];
    this.source.map.data.tiles[tileIndex] = { ...currentTile, kind: "floor", blocked: false };
    return true;
  }

  /** Attempt to open the adjacent door without consuming a key if none is present. */
  openDoorInFrontOf(position: Position, direction: WorldDirection, consumeKey: () => boolean): boolean {
    const door = this.doorInFrontOf(position, direction);
    return door ? this.openDoor(door.id, consumeKey) : false;
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
