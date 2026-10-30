# Tiled JSON world adapter

This project contains an original TypeScript Tiled JSON adapter at `src/game/world/TiledMapLoader.ts`. It converts the supported Tiled layer convention into the existing `TileMap` model.

## Supported layers

- `tileLayer`: required tile GIDs, exactly width × height.
- `tileLayer2`: optional second visual layer, retained as raw GIDs for interior/roof rendering.
- `collisionLayer`: optional collision GIDs; non-zero cells block movement.
- `warpLayer`: object entries of type `warp` with `map`, `col`, `row`, and optional `dir`.
- `npcLayer`: `npc`, `door`, and `talkAcross` object types.
- `enemyTerritoryLayer`: optional per-cell encounter group GIDs.

## Tileset properties

Tile definitions can declare `kind` or `terrain` (one of the project's TileKind values), `blocked` (boolean), and `encounterTableId`. Unrecognized tile kinds default to grass; water, mountains, and walls are blocked by default.

## Coordinate convention

Tiled object pixel coordinates are converted to tile coordinates using floor(x / tilewidth) and floor(y / tileheight). Warp destination `col` maps to target X and `row` maps to target Y.

## Use

```ts
import { loadTiledMap } from "./world/TiledMapLoader";
const result = loadTiledMap(tiledJson, { id: "starter-village", name: "Starter Village" });
const map = result.map;
```

The result retains the visual GID layers and typed warps, NPC metadata, doors, talk-across markers, and map properties so the renderer and interaction systems can consume them without coupling Tiled parsing to game rules.
