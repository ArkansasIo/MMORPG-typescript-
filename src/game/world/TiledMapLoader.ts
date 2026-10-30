/**
 * @file-id ER-FILE-TILED-MAP-LOADER-0001
 * @module-id ER-MOD-WORLD-0001
 * @doc ../../../docs/source/TiledMapLoader.ts.docs.md
 * @master-doc ../../../docs/MASTER_DOCUMENTATION.md
 * Converts Tiled JSON maps into the validated Earthbound Realms world model.
 * This is an original TypeScript adapter; it does not copy DragonWarriorJS source.
 */
import { TileMap, type TileKind, type TileMapData } from "./TileMap";

export type TiledPropertyValue = string | number | boolean;
export interface TiledProperty { name: string; type?: string; value: TiledPropertyValue; }
export interface TiledLayer {
  id?: number; name: string; type: "tilelayer" | "objectgroup"; width?: number; height?: number;
  data?: number[]; objects?: TiledObject[]; visible?: boolean;
}
export interface TiledObject {
  id: number; name?: string; type?: string; class?: string; x: number; y: number;
  width?: number; height?: number; properties?: TiledProperty[];
}
export interface TiledTileDefinition { id: number; properties?: TiledProperty[]; }
export interface TiledTileset { firstgid: number; tiles?: TiledTileDefinition[]; }
export interface TiledMapDocument {
  type: "map"; orientation?: string; width: number; height: number;
  tilewidth: number; tileheight: number; layers: TiledLayer[]; tilesets?: TiledTileset[];
  properties?: TiledProperty[];
}
export interface TiledWarp {
  id: string; x: number; y: number; targetMapId: string; targetX: number; targetY: number;
  direction?: "north" | "east" | "south" | "west";
}
export interface TiledNpc {
  id: string; name: string; x: number; y: number; npcType: string;
  dialogueId: string; wanders: boolean; direction?: "north" | "east" | "south" | "west";
}
export interface TiledDoor {
  id: string; x: number; y: number; replacementTileIndex: number;
}
export interface TiledMapResult {
  map: TileMap;
  tileLayerGids: number[];
  secondTileLayerGids?: number[];
  warps: TiledWarp[];
  npcs: TiledNpc[];
  doors: TiledDoor[];
  talkAcross: Array<{ x: number; y: number }>;
  mapProperties: Record<string, TiledPropertyValue>;
  logicFile?: string;
}

const DIRECTIONS = new Set(["north", "east", "south", "west"]);
const TILE_KINDS = new Set<TileKind>(["grass", "forest", "water", "mountain", "town", "wall", "floor", "door"]);

function properties(value: TiledProperty[] | undefined): Record<string, TiledPropertyValue> {
  return Object.fromEntries((value ?? []).map(property => [property.name, property.value]));
}
function layerByName(document: TiledMapDocument, name: string): TiledLayer | undefined {
  return document.layers.find(layer => layer.name === name);
}
function objectType(object: TiledObject): string {
  return (object.type ?? object.class ?? "").toLowerCase();
}
function tilePosition(object: TiledObject, tileWidth: number, tileHeight: number): { x: number; y: number } {
  return { x: Math.floor(object.x / tileWidth), y: Math.floor(object.y / tileHeight) };
}
function parseDirection(value: TiledPropertyValue | undefined): TiledNpc["direction"] | TiledWarp["direction"] | undefined {
  return typeof value === "string" && DIRECTIONS.has(value.toLowerCase())
    ? value.toLowerCase() as TiledNpc["direction"] : undefined;
}
function tileProperties(gid: number, tilesets: TiledTileset[]): Record<string, TiledPropertyValue> {
  const cleanGid = (gid >>> 0) & 0x1fffffff; // Strip Tiled horizontal/vertical/diagonal flip flags.
  if (cleanGid <= 0) return {};
  let selected: TiledTileset | undefined;
  for (const tileset of tilesets) if (tileset.firstgid <= cleanGid && (!selected || tileset.firstgid > selected.firstgid)) selected = tileset;
  if (!selected) return {};
  const tile = selected.tiles?.find(entry => entry.id === cleanGid - selected!.firstgid);
  return properties(tile?.properties);
}
function terrainKind(gid: number, tilesets: TiledTileset[]): TileKind {
  const value = tileProperties(gid, tilesets).kind ?? tileProperties(gid, tilesets).terrain;
  if (typeof value === "string" && TILE_KINDS.has(value as TileKind)) return value as TileKind;
  return "grass";
}

/** Load and validate a Tiled JSON map document. All tile/object coordinates become tile coordinates. */
export function loadTiledMap(input: unknown, options: { id: string; name: string }): TiledMapResult {
  if (!input || typeof input !== "object") throw new Error("Tiled map must be an object");
  const document = input as TiledMapDocument;
  if (document.type !== "map" || !Number.isInteger(document.width) || !Number.isInteger(document.height) ||
      !Number.isInteger(document.tilewidth) || !Number.isInteger(document.tileheight) ||
      document.width < 1 || document.height < 1 || document.tilewidth < 1 || document.tileheight < 1 ||
      !Array.isArray(document.layers)) throw new Error("Tiled map header or dimensions are invalid");

  const expected = document.width * document.height;
  const ground = layerByName(document, "tileLayer");
  if (!ground || ground.type !== "tilelayer" || !Array.isArray(ground.data) || ground.data.length !== expected) {
    throw new Error("Tiled map requires a tileLayer with width × height GIDs");
  }
  const collision = layerByName(document, "collisionLayer");
  if (collision && (!Array.isArray(collision.data) || collision.data.length !== expected)) {
    throw new Error("collisionLayer data length must equal width × height");
  }
  const second = layerByName(document, "tileLayer2");
  if (second && (!Array.isArray(second.data) || second.data.length !== expected)) {
    throw new Error("tileLayer2 data length must equal width × height");
  }
  const territory = layerByName(document, "enemyTerritoryLayer");
  if (territory && (!Array.isArray(territory.data) || territory.data.length !== expected)) {
    throw new Error("enemyTerritoryLayer data length must equal width × height");
  }

  const tilesets = document.tilesets ?? [];
  const tiles = ground.data.map((gid, index) => {
    if (!Number.isSafeInteger(gid) || gid < 0) throw new Error("Tiled tile GIDs must be non-negative integers");
    const definition = tileProperties(gid, tilesets);
    const kind = terrainKind(gid, tilesets);
    const blockedByCollision = (collision?.data?.[index] ?? 0) > 0;
    const blockedByDefinition = definition.blocked === true;
    const encounterGid = territory?.data?.[index] ?? 0;
    return {
      kind,
      blocked: blockedByCollision || blockedByDefinition || kind === "water" || kind === "mountain" || kind === "wall",
      ...(encounterGid > 0 ? { encounterTableId: String(tileProperties(encounterGid, tilesets).encounterTableId ?? encounterGid) } : {})
    };
  });

  const objectLayers = document.layers.filter(layer => layer.type === "objectgroup");
  const objects = objectLayers.flatMap(layer => layer.objects ?? []);
  const warps: TiledWarp[] = [];
  const npcs: TiledNpc[] = [];
  const doors: TiledDoor[] = [];
  const talkAcross: Array<{ x: number; y: number }> = [];
  for (const object of objects) {
    const type = objectType(object);
    const position = tilePosition(object, document.tilewidth, document.tileheight);
    const props = properties(object.properties);
    const id = String(object.id);
    if (type === "warp") {
      const targetMapId = props.map;
      const targetX = props.col;
      const targetY = props.row;
      if (typeof targetMapId !== "string" || !targetMapId.trim() || !Number.isSafeInteger(targetX) || !Number.isSafeInteger(targetY) || Number(targetX) < 0 || Number(targetY) < 0) {
        throw new Error(`Warp object ${id} requires map, col, and row properties`);
      }
      warps.push({ id, ...position, targetMapId, targetX: Number(targetX), targetY: Number(targetY), direction: parseDirection(props.dir) });
    } else if (type === "npc") {
      const name = object.name?.trim();
      const npcType = typeof props.type === "string" ? props.type : "villager";
      if (!name) throw new Error(`NPC object ${id} requires a name`);
      const normalizedName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const dialogueId = typeof props.dialogueId === "string" && props.dialogueId.trim()
        ? props.dialogueId.trim()
        : normalizedName.includes("elder") ? "meadow-elder" : normalizedName;
      npcs.push({ id, name, ...position, npcType, dialogueId, wanders: props.wanders === true, direction: parseDirection(props.dir) });
    } else if (type === "door") {
      if (!Number.isInteger(props.replacementTileIndex) || Number(props.replacementTileIndex) < 0) {
        throw new Error(`Door object ${id} requires replacementTileIndex`);
      }
      if (position.x < 0 || position.y < 0 || position.x >= document.width || position.y >= document.height) throw new Error(`Door object ${id} is outside the map`);
      doors.push({ id, ...position, replacementTileIndex: Number(props.replacementTileIndex) });
    } else if (type === "talkacross") {
      talkAcross.push(position);
    }
  }

  const exits = warps.map(warp => ({
    id: warp.id, x: warp.x, y: warp.y, targetMapId: warp.targetMapId,
    targetX: warp.targetX, targetY: warp.targetY
  }));
  const mapNpcs = npcs.map(npc => ({ id: npc.id, name: npc.name, x: npc.x, y: npc.y, dialogueId: npc.dialogueId }));
  const mapData: TileMapData = {
    schemaVersion: 1, id: options.id, name: options.name,
    width: document.width, height: document.height, tiles, exits, npcs: mapNpcs
  };
  return {
    map: new TileMap(mapData), tileLayerGids: [...ground.data],
    ...(second?.data ? { secondTileLayerGids: [...second.data] } : {}),
    warps, npcs, doors, talkAcross,
    mapProperties: properties(document.properties),
    ...(typeof properties(document.properties).logicFile === "string" ? { logicFile: String(properties(document.properties).logicFile) } : {})
  };
}
