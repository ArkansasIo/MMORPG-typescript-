# TiledMapRuntime.ts

- **File ID:** ER-FILE-TILED-MAP-RUNTIME-0001
- **Module:** ER-MOD-WORLD-0001
- **Source:** `src/game/world/TiledMapRuntime.ts`

## Purpose

Expose runtime operations over a parsed Tiled map without coupling Tiled parsing to browser rendering or game-session state.

## Public API

- `warpAt(position)` — find a map transition at a tile.
- `npcAt(position)` — find an NPC on a tile.
- `npcInFrontOf(position, direction)` — resolve an NPC in the player's facing-adjacent tile.
- `doorAt(position)` / `doorInFrontOf(position, direction)` — resolve a keyed door by tile or facing direction.
- `canTalkAcross(position)` — query talk-across markers.
- `encounterTableAt(position)` — return the tile's encounter table ID.
- `openDoor(doorId, consumeKey)` — consume a key callback and replace the door's visual GID and collision state.
- `openDoorInFrontOf(position, direction, consumeKey)` — attempt to open the facing-adjacent door; does not consume a key when no door is present.
- `tileGidAt(position, layer)` — read ground or overlay visual GID.
- `openedDoorIds` — snapshot of opened door IDs.
- `restoreOpenedDoors(ids)` — restore known opened-door IDs without consuming player inventory; unknown IDs are rejected.

## Tests

- `TiledMapRuntime.test.ts` — warps, NPC and door proximity, encounter lookup, key consumption, door tile replacement, overlay layer, and bounds checks.
