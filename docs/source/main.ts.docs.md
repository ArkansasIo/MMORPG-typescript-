# src/main.ts — Source Documentation
- **Document ID:** ER-DOC-FILE-CLIENT-ENTRY-0001
- **Source ID:** ER-FILE-CLIENT-ENTRY-0001
- **Module ID:** ER-MOD-CLIENT-0001
- **Source backlink:** [../../src/main.ts](../../src/main.ts)
- **Master:** [../MASTER_DOCUMENTATION.md](../MASTER_DOCUMENTATION.md) · [Registry](../SOURCE_DOCUMENTATION_INDEX.md)
- **Status:** Partial

## Purpose
Bootstraps the browser UI and delegates gameplay state to BrowserGameController/GameRuntime. Renders the seeded tile map, character stats, inventory/consumables, shop buy/sell actions, crafting recipes, quest status, NPC dialogue, combat, and save/continue flows. Keyboard, mouse, and browser Gamepad API input are handled at the UI boundary.

## Efficiency and maintenance
This file remains the browser composition module. Domain rules live in src/game; controller calls are the state boundary. The current renderer replaces the app DOM on state changes and reattaches scoped event handlers. Extract rendering and input adapters into focused modules as the UI expands.

## Shop and crafting integration
The Shop tab calls the BrowserGameController and GameSession shop methods; transaction validation remains in ShopService. The Crafting tab reads the starter recipe catalog and uses CraftingService to verify materials and inventory capacity before consuming ingredients. These systems run locally and are not safe as client-authoritative online transactions.

## Security and boundaries
Browser state is not trusted by an online server. The client is not an authoritative multiplayer simulation. Real authentication, server-authoritative combat, persistence, and network sessions remain unimplemented.

## Validation
Run `npm install` and `npm run build` at repository root. This document does not claim the build has passed.
