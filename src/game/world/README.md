# World Module
- **Folder ID:** ER-DIR-WORLD-0001
- **Module ID:** ER-MOD-WORLD-0001
- **Parent ID:** ER-MOD-GAME-0001
- **Purpose:** Data-driven tile maps, collision, authored Tiled maps, and procedural regions.
- **Current modules:** `TileMap.ts`, `CollisionSystem.ts`, `TiledMapLoader.ts`, `TiledMapRuntime.ts`, and `TiledWorldRegistry.ts`.
- **Documentation:** [Master](../../../docs/MASTER_DOCUMENTATION.md) · [JRPG adaptation plan](../../../docs/CLASSIC_JRPG_ADAPTATION.md) · [Tiled map import](../../../docs/TILED_MAP_IMPORT.md) · [Upstream research](../../../docs/UPSTREAM_DRAGONWARRIORJS.md) · [Registry](../../../docs/SOURCE_DOCUMENTATION_INDEX.md)
- **Status:** Partial. Authored Tiled maps can instantiate playable sessions. The runtime supports NPC/door facing-adjacency queries and keyed door opening with collision/GID updates. `TiledWorldRegistry` validates authored warp targets across registered maps. The browser still needs controls for those APIs, automatic browser warp triggers and session map swapping, tileset atlas rendering, and Tiled-map save restoration.
