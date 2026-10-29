# GameRuntime.ts — Prototype Runtime Composition

**Source:** `src/game/GameRuntime.ts`  
**Tests:** `src/game/__tests__/game-runtime.test.ts`

## Purpose

`GameRuntime.create(options)` is the composition entry point for a local gameplay session. It creates a character, generates a seeded 25 × 17 region, validates the center spawn, registers starter item and quest data, grants two starter potions, and constructs the battle service.

## Public API

- `GameRuntime.create(options)` creates a new runtime.
- `move(direction)` delegates movement to the session collision system.
- `startEncounter(creatureIds)` starts a battle from creature catalog IDs.
- `act(action)` submits a player combat action.
- `save()` returns a versioned session snapshot.

## Current boundaries

This runtime is not yet the browser UI's sole state owner. The legacy `src/main.ts` still maintains separate prototype state, so the next integration step is to migrate the UI to this runtime and remove duplicated combat/inventory state. Save snapshots also need a restore API and server-side persistence before they can be used as production saves.
