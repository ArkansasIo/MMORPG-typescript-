# World Module
- **Folder ID:** ER-DIR-WORLD-0001
- **Module ID:** ER-MOD-WORLD-0001
- **Parent ID:** ER-MOD-GAME-0001
- **Purpose:** Data-driven tile maps, collision, authored Tiled maps, and procedural regions.
- **Current modules:** `TileMap.ts`, `CollisionSystem.ts`, `TiledMapLoader.ts`, `TiledMapRuntime.ts`, and `TiledWorldRegistry.ts`.
- **Documentation:** [Master](../../../docs/MASTER_DOCUMENTATION.md) · [JRPG adaptation plan](../../../docs/CLASSIC_JRPG_ADAPTATION.md) · [Tiled map import](../../../docs/TILED_MAP_IMPORT.md) · [Upstream research](../../../docs/UPSTREAM_DRAGONWARRIORJS.md) · [Registry](../../../docs/SOURCE_DOCUMENTATION_INDEX.md)
- **Status:** Partial. Authored Tiled maps can instantiate playable sessions. The runtime supports NPC/door facing-adjacency queries and keyed door opening with collision/GID updates. `TiledWorldRegistry` validates authored warp targets across registered maps. The browser supports NPC dialogue (E), keyed doors (F), and automatic warp transitions between loaded maps. Import `starter-village.json` first and `north-road.json` second to play the included two-way sample route. Tileset atlas rendering remains incomplete. Save/continue persists all registered Tiled map documents and opened door IDs.
