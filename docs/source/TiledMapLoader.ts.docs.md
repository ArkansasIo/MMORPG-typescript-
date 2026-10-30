# TiledMapLoader.ts

- **File ID:** ER-FILE-TILED-MAP-LOADER-0001
- **Module:** ER-MOD-WORLD-0001
- **Source:** `src/game/world/TiledMapLoader.ts`

## Purpose

Validate Tiled JSON map input and convert its tile/object layers into the existing typed `TileMap` domain model. It keeps rendering GIDs and Tiled-specific object metadata alongside the domain map.

## Public API

- `loadTiledMap(input, { id, name }): TiledMapResult`
- `TiledMapResult`: domain map, ground/overlay GIDs, warps, NPCs, doors, talk-across markers, map properties, optional logic file.

## Supported data

See [Tiled map import guide](../../TILED_MAP_IMPORT.md). Unknown tile kinds default to grass. Water, mountain, and wall tiles block movement. Non-zero collision GIDs block movement. NPC objects can set a `dialogueId` string property. When omitted, the loader derives a slug from the NPC name, with elder names mapped to the starter `meadow-elder` dialogue. The parser validates dimensions, warp properties, and door replacement tile indexes.

## Dependencies

- `TileMap.ts` — validated world map model.

## Tests

- `TiledMapLoader.test.ts` — terrain, collision, encounter metadata, warps, NPCs, doors, talk-across, and malformed input.
