# World Module
- **Folder ID:** ER-DIR-WORLD-0001
- **Module ID:** ER-MOD-WORLD-0001
- **Parent ID:** ER-MOD-GAME-0001
- **Purpose:** Data-driven tile maps, collision, map exits, and later procedural regions.
- **Current modules:** `TileMap.ts` (ER-FILE-WORLD-TILEMAP-0001), `CollisionSystem.ts` (ER-FILE-WORLD-COLLISION-0001), `TiledMapLoader.ts` (ER-FILE-TILED-MAP-LOADER-0001), and `TiledMapRuntime.ts` (ER-FILE-TILED-MAP-RUNTIME-0001).
- **Documentation:** [Master](../../../docs/MASTER_DOCUMENTATION.md) · [JRPG adaptation plan](../../../docs/CLASSIC_JRPG_ADAPTATION.md) · [Tiled map import](../../../docs/TILED_MAP_IMPORT.md) · [Upstream research](../../../docs/UPSTREAM_DRAGONWARRIORJS.md) · [Registry](../../../docs/SOURCE_DOCUMENTATION_INDEX.md)
- **Status:** Partial. Tiled maps can now instantiate GameRuntime/GameSession through the browser controller facade. The current renderer still uses the procedural map presentation; tileset image rendering, automatic map transitions, and Tiled-map save restoration remain incomplete.
