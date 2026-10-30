# Source Documentation Index
**Document ID:** ER-DOC-REGISTRY-0001 · **Parent:** ER-DOC-MASTER-0001

This is the canonical mapping between IDs, source paths, and sidecar docs. Update it in the same change as source files.

| File ID | Module ID | Source | Sidecar | Status |
|---|---|---|---|---|
| ER-FILE-CLIENT-ENTRY-0001 | ER-MOD-CLIENT-0001 | [src/main.ts](../src/main.ts) | [main.ts.docs.md](./source/main.ts.docs.md) | Partial |
| ER-FILE-CLIENT-STYLES-0001 | ER-MOD-CLIENT-0001 | [src/style.css](../src/style.css) | [style.css.docs.md](./source/style.css.docs.md) | Partial |
| ER-FILE-GAME-TYPES-0001 | ER-MOD-GAME-0001 | [src/game/types.ts](../src/game/types.ts) | [types.ts.docs.md](./source/types.ts.docs.md) | Implemented |
| ER-FILE-PACKAGE-ROOT-0001 | ER-MOD-BUILD-0001 | [package.json](../package.json) | [package.json.docs.md](./source/package.json.docs.md) | Implemented |
| ER-FILE-TS-CONFIG-ROOT-0001 | ER-MOD-BUILD-0001 | [tsconfig.json](../tsconfig.json) | [tsconfig.json.docs.md](./source/tsconfig.json.docs.md) | Implemented |
| ER-FILE-HTML-ENTRY-0001 | ER-MOD-CLIENT-0001 | [index.html](../index.html) | [index.html.docs.md](./source/index.html.docs.md) | Implemented |

IDs are stable and must never be reused. Planned entries must explicitly say Planned; do not list files as implemented unless they exist.

| ER-FILE-CRAFTING-SERVICE-0001 | ER-MOD-CRAFTING-0001 | [CraftingService.ts](../src/game/inventory/CraftingService.ts) | [CraftingService.ts.docs.md](./source/CraftingService.ts.docs.md) | Implemented |
| ER-FILE-STARTER-RECIPES-0001 | ER-MOD-CRAFTING-0001 | [Recipes.ts](../src/game/data/Recipes.ts) | [Recipes.ts.docs.md](./source/Recipes.ts.docs.md) | Implemented |

| ER-FILE-WORLD-TILEMAP-0001 | ER-MOD-WORLD-0001 | [src/game/world/TileMap.ts](../src/game/world/TileMap.ts) | [TileMap.ts.docs.md](./source/TileMap.ts.docs.md) | Partial |
| ER-FILE-WORLD-COLLISION-0001 | ER-MOD-WORLD-0001 | [src/game/world/CollisionSystem.ts](../src/game/world/CollisionSystem.ts) | [CollisionSystem.ts.docs.md](./source/CollisionSystem.ts.docs.md) | Partial |

| ER-FILE-CHARACTER-CORE-0001 | ER-MOD-CHARACTER-0001 | [Character.ts](../src/game/character/Character.ts) | [Character.ts.docs.md](./source/Character.ts.docs.md) | Partial |
| ER-FILE-COMBAT-ENGINE-0001 | ER-MOD-COMBAT-0001 | [CombatEngine.ts](../src/game/combat/CombatEngine.ts) | [CombatEngine.ts.docs.md](./source/CombatEngine.ts.docs.md) | Partial |
| ER-FILE-EFFECT-SYSTEM-0001 | ER-MOD-EFFECTS-0001 | [EffectSystem.ts](../src/game/effects/EffectSystem.ts) | [EffectSystem.ts.docs.md](./source/EffectSystem.ts.docs.md) | Partial |
| ER-FILE-INVENTORY-ENGINE-0001 | ER-MOD-INVENTORY-0001 | [Inventory.ts](../src/game/inventory/Inventory.ts) | [Inventory.ts.docs.md](./source/Inventory.ts.docs.md) | Partial |
| ER-FILE-QUEST-ENGINE-0001 | ER-MOD-QUESTS-0001 | [QuestEngine.ts](../src/game/quests/QuestEngine.ts) | [QuestEngine.ts.docs.md](./source/QuestEngine.ts.docs.md) | Partial |
| ER-FILE-GAME-ENGINE-0001 | ER-MOD-GAME-0001 | [GameEngine.ts](../src/game/GameEngine.ts) | [GameEngine.ts.docs.md](./source/GameEngine.ts.docs.md) | Partial |
| ER-FILE-ASSET-CATALOG-0001 | ER-MOD-ASSETS-0001 | [AssetCatalog.ts](../src/game/assets/AssetCatalog.ts) | [AssetCatalog.ts.docs.md](./source/AssetCatalog.ts.docs.md) | Partial |
| ER-FILE-SERVER-ENTRY-0001 | ER-MOD-SERVER-APP-0001 | [server/src/index.ts](../server/src/index.ts) | [server-index.ts.docs.md](./source/server-index.ts.docs.md) | Partial |
| ER-FILE-SERVER-DB-POOL-0001 | ER-MOD-SERVER-DB-0001 | [server/src/db/pool.ts](../server/src/db/pool.ts) | [server-pool.ts.docs.md](./source/server-pool.ts.docs.md) | Partial |
| ER-FILE-DB-SCHEMA-0001 | ER-MOD-DATABASE-0001 | [database/schema.sql](../database/schema.sql) | [schema.sql.docs.md](./source/schema.sql.docs.md) | Partial |

| ER-FILE-AUTH-0001 | ER-MOD-AUTH-0001 | [server/src/auth.ts](../server/src/auth.ts) | [auth.ts.docs.md](./source/auth.ts.docs.md) | Implemented |
| ER-FILE-AUTH-ROUTES-0001 | ER-MOD-AUTH-0001 | [server/src/auth-routes.ts](../server/src/auth-routes.ts) | [auth-routes.ts.docs.md](./source/auth-routes.ts.docs.md) | Partial |
| ER-FILE-REALTIME-0001 | ER-MOD-REALTIME-0001 | [server/src/realtime.ts](../server/src/realtime.ts) | [realtime.ts.docs.md](./source/realtime.ts.docs.md) | Partial |
| ER-FILE-SAVE-ROUTES-0001 | ER-MOD-PERSISTENCE-0001 | [server/src/save-routes.ts](../server/src/save-routes.ts) | [save-routes.ts.docs.md](./source/save-routes.ts.docs.md) | Partial |
| ER-FILE-API-CLIENT-0001 | ER-MOD-NETWORK-0001 | [src/game/network/ApiClient.ts](../src/game/network/ApiClient.ts) | [ApiClient.ts.docs.md](./source/ApiClient.ts.docs.md) | Implemented |
| ER-FILE-REALTIME-CLIENT-0001 | ER-MOD-NETWORK-0001 | [src/game/network/RealtimeClient.ts](../src/game/network/RealtimeClient.ts) | [RealtimeClient.ts.docs.md](./source/RealtimeClient.ts.docs.md) | Partial |
| ER-FILE-VITE-CONFIG-0001 | ER-MOD-BUILD-0001 | [vite.config.ts](../vite.config.ts) | [vite.config.ts.docs.md](./source/vite.config.ts.docs.md) | Implemented |

| ER-FILE-TILED-MAP-LOADER-0001 | ER-MOD-WORLD-0001 | [TiledMapLoader.ts](../src/game/world/TiledMapLoader.ts) | [TiledMapLoader.ts.docs.md](./source/TiledMapLoader.ts.docs.md) | Implemented |
| ER-FILE-TILED-MAP-RUNTIME-0001 | ER-MOD-WORLD-0001 | [TiledMapRuntime.ts](../src/game/world/TiledMapRuntime.ts) | [TiledMapRuntime.ts.docs.md](./source/TiledMapRuntime.ts.docs.md) | Implemented |
