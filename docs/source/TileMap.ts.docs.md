# TileMap.ts — Source Documentation
- **Document ID:** ER-DOC-FILE-WORLD-TILEMAP-0001
- **Source ID:** ER-FILE-WORLD-TILEMAP-0001
- **Module ID:** ER-MOD-WORLD-0001
- **Source backlink:** [../../../src/game/world/TileMap.ts](../../../src/game/world/TileMap.ts)
- **Master:** [Master documentation](../MASTER_DOCUMENTATION.md) · [JRPG adaptation plan](../CLASSIC_JRPG_ADAPTATION.md)

## Purpose
Provides a validated, immutable-by-copy representation of a rectangular grid map, including exits and NPC spawns.

## Public API
- `TileMap(data)`: validates schema version, dimensions, tile count, exit bounds, and NPC bounds.
- `inBounds(x, y)`: checks integer grid coordinates.
- `getTile(x, y)`: returns a tile or undefined when out of bounds.
- `getExitAt(x, y)`: finds a map transition at a coordinate.
- `getNpcsAt(x, y)`: lists NPC spawns at a coordinate.

## Notes
This validates structural consistency, not every content rule. The caller must still verify that referenced target maps and dialogue IDs exist. `structuredClone` requires a modern runtime.
