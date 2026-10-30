# Browser Game Controller

The framework-independent `BrowserGameController` is the intended bridge between a UI and the game-domain modules. It can start a new runtime, load and save named slots, move the character, use registered consumables, and progress NPC dialogue choices.

## Storage
Pass a `SaveStorage` adapter to the constructor. A browser app can supply `window.localStorage`; tests use an in-memory adapter. The controller does not read browser globals directly.

## Integration example
```ts
const controller = new BrowserGameController(window.localStorage);
controller.startNew({ seed: 42, characterName: "Mira", characterClass: "Cleric" });
controller.saveGame("main");
controller.continueGame("main");
```

## Scope
This facade does not render UI or automatically replace the existing prototype state in `src/main.ts`. A subsequent UI change should route menus and inputs through this controller. Save data remains client-controlled and must not be trusted for authoritative multiplayer state.


## Tiled map session support

`startTiledMap(options)` now creates a runtime through `GameRuntime.createFromTiledMap` and resets the interaction service against that imported map's `GameSession`. The caller supplies the typed Tiled document, map ID/name, character details, and optional walkable spawn coordinate.

The title screen accepts multiple Tiled JSON files: the first selected file is the starting map and the remaining files are registered as warp destinations. The browser resolves registered warps automatically after movement, supports E to speak to the NPC in front of the player, and F to open a facing door by consuming one Iron Key. The included village and north-road sample maps form a two-way route. Tiled tileset image rendering remains incomplete. Local saves now include imported map documents, the active map/position, and opened-door state so Continue can restore a Tiled world.


## Facing-based authored map interactions

- `getFacingNpc(direction)` returns the Tiled NPC in the adjacent tile the player faces, or `undefined` when no imported Tiled map/NPC is present.
- `beginFacingNpcDialogue(direction)` resolves that NPC's `dialogueId` against registered dialogue trees.
- `openFacingDoor(direction, consumeKey)` attempts to open the adjacent authored door. The caller supplies the key-consumption policy; the callback is not invoked when no door is present.


## Resource gathering integration
- `listResourceNodes()` exposes cloned node status for the UI.
- `gatherResource(nodeId, hasTool?)` gathers into the active session inventory and records successful quantities against collect quest objectives.
- Node state is currently in-memory only; save persistence is a known limitation.
