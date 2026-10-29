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
