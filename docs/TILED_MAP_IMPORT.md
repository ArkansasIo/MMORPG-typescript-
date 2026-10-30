# Tiled JSON world adapter

This project contains an original TypeScript Tiled JSON adapter at `src/game/world/TiledMapLoader.ts`. It converts the supported Tiled layer convention into the existing `TileMap` model. The adapter and runtime are independent implementations informed by documented RPG map concepts; they do not contain copied DragonWarriorJS source or assets.

## Supported layers

- `tileLayer`: required tile GIDs, exactly width × height.
- `tileLayer2`: optional second visual layer, retained as raw GIDs for interior/roof rendering.
- `collisionLayer`: optional collision GIDs; non-zero cells block movement.
- `warpLayer`: object entries of type `warp` with `map`, `col`, `row`, and optional `dir`.
- `npcLayer`: `npc`, `door`, and `talkAcross` object types.
- `enemyTerritoryLayer`: optional per-cell encounter group GIDs.

## Runtime interactions

`TiledMapRuntime` exposes tile lookups for NPCs, doors, warps, talk-across markers, encounter groups, and visual GIDs. Directional helpers `npcInFrontOf(position, direction)` and `doorInFrontOf(position, direction)` resolve entities in the adjacent tile the player faces. `openDoorInFrontOf` opens a matching adjacent door, consumes a key only after a door is found, and updates both its visual GID and collision state. The browser binds E to NPC dialogue and F to door opening. The door action consumes one `iron-key` item only when a matching closed door is present.

## Cross-map warp catalog

`TiledWorldRegistry` registers loaded authored maps and resolves a warp at a source coordinate. It distinguishes a missing target map from a blocked or out-of-bounds arrival tile, and returns a validated target runtime plus arrival coordinate when ready. `GameRuntime` registers the starting document plus `additionalMaps`. When movement enters a warp tile, it switches the active `GameSession` map and spawn position only if the destination map is registered and the arrival tile is walkable. Missing or blocked destinations are reported without changing maps.

## Tileset properties and coordinates

Tile definitions can declare `kind` or `terrain` (one of the project's TileKind values), `blocked` (boolean), and `encounterTableId`. Unrecognized tile kinds default to grass; water, mountains, and walls are blocked by default.

Tiled object pixel coordinates are converted to tile coordinates using floor(x / tilewidth) and floor(y / tileheight). Warp destination `col` maps to target X and `row` maps to target Y.

## Runtime integration

Use `GameRuntime.createFromTiledMap` to create a playable domain session directly from an authored map. The browser facade exposes `startTiledMap(options)`; the title screen accepts multiple Tiled JSON files: the first selected file is the starting map, remaining files are registered as destinations, and the first walkable tile is selected as spawn. The sample `starter-village.json` and `north-road.json` files form a two-way route.

The renderer currently uses the existing pixel-style glyph presentation. Actual Tiled tileset atlas rendering remains incomplete. Tiled save snapshots include all registered map documents and opened-door IDs, allowing local restoration after a reload.

## Included sample map

Two original metadata-based sample maps are available: [starter-village.json](../public/maps/starter-village.json) and [north-road.json](../public/maps/north-road.json). Select both files in the title screen importer, keeping `starter-village.json` first. They contain reciprocal warp destinations. The village also includes a village elder, a keyed storehouse door, and a talk-across marker. Buy an Iron Key in the Shop to open the door. Neither sample requires a third-party image atlas.
