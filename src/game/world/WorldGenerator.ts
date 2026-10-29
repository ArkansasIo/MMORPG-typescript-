import { TileMap, type Tile, type TileKind, type TileMapData } from "./TileMap";

export interface WorldGenerationOptions {
  seed: number;
  id: string;
  name: string;
  width: number;
  height: number;
  waterChance?: number;
  forestChance?: number;
  mountainChance?: number;
}

export class WorldGenerator {
  generate(options: WorldGenerationOptions): TileMap {
    const { seed, id, name, width, height } = options;
    if (!Number.isSafeInteger(seed)) throw new Error("World seed must be a safe integer");
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 3 || height < 3) {
      throw new Error("Generated maps must be at least 3 by 3");
    }
    const waterChance = options.waterChance ?? 0.12;
    const forestChance = options.forestChance ?? 0.24;
    const mountainChance = options.mountainChance ?? 0.10;
    for (const chance of [waterChance, forestChance, mountainChance]) {
      if (!Number.isFinite(chance) || chance < 0 || chance > 1) {
        throw new Error("Terrain chances must be between zero and one");
      }
    }

    const random = seededRandom(seed);
    const tiles: Tile[] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const border = x === 0 || y === 0 || x === width - 1 || y === height - 1;
        if (border) {
          tiles.push({ kind: "wall", blocked: true });
          continue;
        }
        const roll = random();
        let kind: TileKind = "grass";
        if (roll < waterChance) kind = "water";
        else if (roll < waterChance + mountainChance) kind = "mountain";
        else if (roll < waterChance + mountainChance + forestChance) kind = "forest";
        tiles.push({ kind, blocked: kind === "water" || kind === "mountain" });
      }
    }

    // Keep a predictable, walkable starting area regardless of the seed.
    const spawnIndex = Math.floor(height / 2) * width + Math.floor(width / 2);
    tiles[spawnIndex] = { kind: "grass", blocked: false };
    const data: TileMapData = { schemaVersion: 1, id, name, width, height, tiles, exits: [], npcs: [] };
    return new TileMap(data);
  }
}

function seededRandom(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6D2B79F5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}
