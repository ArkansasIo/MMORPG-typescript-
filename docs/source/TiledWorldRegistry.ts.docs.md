# TiledWorldRegistry

`src/game/world/TiledWorldRegistry.ts` provides an in-memory catalog for validated authored Tiled maps.

## API

- `new TiledWorldRegistry(maps?)` registers an initial collection of loaded `TiledMapResult` values.
- `register(map)` adds a map and returns its `TiledMapRuntime`. Duplicate map IDs throw.
- `get(mapId)` and `has(mapId)` inspect the catalog.
- `mapIds` returns registered map IDs.
- `resolveWarp(sourceMapId, position)` returns `undefined` if there is no warp at the source position. Otherwise it returns one of:
  - `ready` with the target runtime and validated arrival coordinate;
  - `missing-map` when the warp references an unregistered map;
  - `blocked-destination` when the target coordinate is outside the map or blocked.

The registry intentionally returns a transition candidate rather than mutating `GameSession`. Session map replacement, browser warp triggers, and persistence of multiple authored maps remain separate integration tasks.
