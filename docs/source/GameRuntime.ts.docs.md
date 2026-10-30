# GameRuntime.ts — Prototype Runtime Composition

**Source:** `src/game/GameRuntime.ts`  
**Tests:** `src/game/__tests__/game-runtime.test.ts`

## Purpose

`GameRuntime.create(options)` is the composition entry point for a local gameplay session. It creates a character, generates a seeded 25 × 17 region, validates the center spawn, registers starter item and quest data, grants two starter potions, and constructs the battle service.

## Public API

- `GameRuntime.create(options)` creates a new runtime.
- `move(direction)` delegates movement to the session collision system and resolves a registered Tiled warp when the player enters one.
- `startEncounter(creatureIds)` starts a battle from creature catalog IDs.
- `act(action)` submits a player combat action.
- `save()` returns a versioned session snapshot.

## Current boundaries

This runtime is not yet the browser UI's sole state owner. The legacy `src/main.ts` still maintains separate prototype state, so the next integration step is to migrate the UI to this runtime and remove duplicated combat/inventory state. Save snapshots are local client data; server-side persistence and server-authoritative validation are still required for production multiplayer.


## Tiled map integration

`GameRuntime.createFromTiledMap(options)` now supports authored Tiled JSON maps. It validates the document through `loadTiledMap`, creates a normal `GameSession` using the imported `TileMap`, and attaches `TiledMapRuntime` as the optional `tiledWorld` property. The existing procedural `create` and `restore` paths remain available.

The browser facade exposes the same capability through `BrowserGameController.startTiledMap(options)`. The title-screen importer accepts multiple JSON files; the first file is the active map and the remaining documents are registered as transition targets. On successful warp, the same `GameSession` preserves character, inventory, and quest progress while changing map and position. `additionalMaps` registers more Tiled documents in the same world catalog. Successful warps replace the active session map and arrival coordinate; unresolved destinations leave the player on the source map and are exposed through `lastWarpResolution`.

## Current limitations

Tiled maps are now usable by the domain session, but the browser renderer still uses its existing procedural tile presentation. Tiled tileset image rendering remains future work. `save()` stores the registered map documents and opened-door IDs; `restore()` reconstructs the registry and resumes on the saved active map. `lastWarpResolution` records ready, missing-map, or blocked-destination results. The Tiled integration tests are in `src/game/GameRuntime.tiled.test.ts`.
