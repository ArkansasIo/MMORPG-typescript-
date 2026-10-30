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

The current browser renderer does not yet provide a Tiled map picker, tileset image rendering, map transition orchestration, or Tiled-map save restoration.


## Facing-based authored map interactions

- `getFacingNpc(direction)` returns the Tiled NPC in the adjacent tile the player faces, or `undefined` when no imported Tiled map/NPC is present.
- `openFacingDoor(direction, consumeKey)` attempts to open the adjacent authored door. The caller supplies the key-consumption policy; the callback is not invoked when no door is present.
