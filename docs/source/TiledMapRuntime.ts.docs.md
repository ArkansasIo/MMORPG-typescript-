# TiledMapRuntime.ts

- **File ID:** ER-FILE-TILED-MAP-RUNTIME-0001
- **Module:** ER-MOD-WORLD-0001
- **Source:** `src/game/world/TiledMapRuntime.ts`

## Purpose

Expose small runtime operations over a parsed Tiled map without coupling Tiled parsing to browser rendering or game-session state.

## Public API

- `warpAt(position)` — find a map transition at a tile.
- `npcAt(position)` — find an NPC on a tile.
- `canTalkAcross(position)` — query talk-across markers.
- `encounterTableAt(position)` — return the tile's encounter table ID.
- `openDoor(doorId, consumeKey)` — consume a key callback and replace the door's visual GID.
- `tileGidAt(position, layer)` — read ground or overlay visual GID.
- `openedDoorIds` — snapshot of opened door IDs.

## Tests

- `TiledMapRuntime.test.ts` — warps, NPC lookup, encounter lookup, key consumption, door tile replacement, overlay layer, and bounds checks.
