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

`TiledMapRuntime` exposes tile lookups for NPCs, doors, warps, talk-across markers, encounter groups, and visual GIDs. Directional helpers `npcInFrontOf(position, direction)` and `doorInFrontOf(position, direction)` resolve entities in the adjacent tile the player faces. `openDoorInFrontOf` opens a matching adjacent door, consumes a key only after a door is found, and updates both its visual GID and collision state. These are domain APIs; browser controls are not yet wired to them.

## Tileset properties and coordinates

Tile definitions can declare `kind` or `terrain` (one of the project's TileKind values), `blocked` (boolean), and `encounterTableId`. Unrecognized tile kinds default to grass; water, mountains, and walls are blocked by default.

Tiled object pixel coordinates are converted to tile coordinates using floor(x / tilewidth) and floor(y / tileheight). Warp destination `col` maps to target X and `row` maps to target Y.

## Runtime integration

Use `GameRuntime.createFromTiledMap` to create a playable domain session directly from an authored map. The browser facade exposes `startTiledMap(options)`; the title screen accepts a Tiled JSON upload and selects the first walkable tile as spawn.

The renderer currently uses the existing pixel-style glyph presentation. Actual Tiled tileset atlas rendering, automatic cross-map warp transitions, full browser NPC/door controls, and Tiled-map save restoration remain incomplete.

## Included sample map

An original metadata-based sample is available at [public/maps/starter-village.json](../public/maps/starter-village.json). It includes walkable grassland, blocked water/forest terrain, a collision boundary, a village elder, a keyed storehouse door, a talk-across marker, and a warp object. The sample has no third-party image atlas.
