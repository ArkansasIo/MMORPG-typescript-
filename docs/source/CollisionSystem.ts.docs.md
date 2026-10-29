# CollisionSystem.ts — Source Documentation
- **Document ID:** ER-DOC-FILE-WORLD-COLLISION-0001
- **Source ID:** ER-FILE-WORLD-COLLISION-0001
- **Module ID:** ER-MOD-WORLD-0001
- **Source backlink:** [../../../src/game/world/CollisionSystem.ts](../../../src/game/world/CollisionSystem.ts)
- **Master:** [Master documentation](../MASTER_DOCUMENTATION.md) · [JRPG adaptation plan](../CLASSIC_JRPG_ADAPTATION.md)

## Purpose
Implements deterministic grid movement and blocking checks without depending on UI or rendering.

## Public API
- `canEnter(position)`: true only if a tile exists and is not blocked.
- `nextPosition(position, direction)`: computes the adjacent coordinate.
- `tryMove(position, direction)`: returns the destination when walkable, otherwise null.

## Notes
This is a tile-level collision check; entity occupancy, movement animation, diagonal movement, and server-authoritative validation are outside this module.
