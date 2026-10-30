# Earthbound Realms — TypeScript RPG/MMORPG Prototype

**Build name:** Earthbound Realms TypeScript MMORPG Prototype  
**Build ID:** ER-TS-MMORPG-0.1.0  
**Version:** 0.1.0  
**Developer:** Stephen Delaine Jr. — solo development

Earthbound Realms is an original retro fantasy RPG prototype combining classic menu-driven JRPG exploration, creature-inspired turn-based encounters, a D20/tabletop-inspired rules direction, and MMORPG-style systems. The repository is a foundation and design roadmap, not a finished production MMORPG.

## Included now
- TypeScript + Vite browser client with a retro-fantasy panel interface.
- Title screen with New Game, Continue, Play Offline, Play Online, Settings, and Credits entries.
- Character name/class/seed setup, named local save slot, and continue-from-save flow powered by the game runtime.
- Seeded procedural tile region rendered from the game runtime, with collision-aware movement and zoom.
- Keyboard (WASD/arrows), mouse tile clicks, on-screen directional pad, and browser Gamepad API movement/action input where supported.
- Runtime-backed encounters, turn-based combat, HP, XP, leveling, gold, equipment bonuses, consumables, a buy/sell shop, crafting recipes, quests, and NPC dialogue.
- Express API starter, MySQL schema, environment template, and cron-job scaffolding.
- Design documents for game systems, modes, story campaign, realms, and architecture/UML.


### Shop
The Shop tab lists starter catalog items and allows buying or selling one item per action. Buying checks available gold and inventory capacity; selling pays half the listed item price. Transactions use the existing game-session shop service.

### Crafting
The browser includes a Crafting tab with two starter recipes: two healing herbs make one Small Potion, and four healing herbs make one Travel Cloak. Crafting checks ingredient counts and inventory capacity before consuming materials. The local character starts with four healing herbs to exercise the system.

### Browser UI integration status
The current `src/main.ts` delegates state to `BrowserGameController` and `GameRuntime`. The Character, Inventory, Quests, World Map, and Codex tabs read from runtime state; potion use, quest progression, NPC dialogue choices, battle actions, movement, and save/continue use domain services. The browser stores the local save in the `earthbound-realms:save:main` slot. This is still a single-player prototype: multiplayer authentication, server-authoritative state, and online shared worlds are not implemented.

## Planned design targets
- Nine character classes and D20-inspired checks, attacks, saving throws, and conditions.
- Twelve story acts and fifty chapters.
- Nine Norse-inspired realms with medieval fantasy and outer-space zones.
- 42 trials, 18 raids, and 12 towers of up to 100 floors each.
- Real Earth geographic data, countries, roads, settlements, and a fantasy overlay.
- Original 8-bit sprites, sound effects, and 24 music tracks.
- Online multiplayer with server-authoritative state, accounts, parties, and instance sessions.

These are targets, not completed content. The current map is schematic and is not a real Earth map. The backend now provides account registration/login, authenticated cloud-save endpoints, and an authenticated ephemeral WebSocket room relay. The browser game UI is not yet wired to those services, and shared persistent worlds, server-authoritative combat, parties, and cross-process room coordination remain unfinished.


## Classic 8-bit RPG presentation

The browser client now uses an original retro console-RPG visual direction inspired by early 8-bit fantasy adventures:
- Limited blue-and-gold palette, hard pixel borders, square command buttons, and monospaced text.
- Classic title menu and quest-start flow.
- Top-down tile-map glyphs, player marker, and compact field/status panels.
- Blue dialogue panels and retro battle cards with enemy glyph portraits.
- Responsive layout for desktop and mobile screens.

The visual refresh is presentation-only: it keeps the existing TypeScript game runtime, character progression, inventory, quests, shops, crafting, saves, and combat actions. The current enemy portraits are temporary glyph-based representations; a dedicated original pixel-art sprite atlas and tile set remain a follow-on asset task.

## Tiled JRPG map integration

An original TypeScript adapter now imports Tiled JSON maps into the existing world model. Select multiple map files when importing: the first selected file is the starting region and the others are registered as cross-map warp destinations. The included `starter-village.json` and `north-road.json` maps are linked in both directions. It supports layered tile GIDs, terrain and collision metadata, enemy territory encounter IDs, map warps, NPC metadata, keyed doors, and talk-across markers. The adapter, warp registry, automatic session transitions, NPC dialogue, and keyed-door interactions are covered by Vitest tests. The included `public/maps/starter-village.json` and `public/maps/north-road.json` provide a two-way sample route; import both files together to test it. Buy an Iron Key from the Shop to open the sample storehouse door. See [Tiled Map Import](docs/TILED_MAP_IMPORT.md) and [upstream research/licensing notes](docs/UPSTREAM_DRAGONWARRIORJS.md).

The reference project, [bobbylight/DragonWarriorJS](https://github.com/bobbylight/DragonWarriorJS), is itself primarily TypeScript, despite its repository description mentioning JavaScript. Its README documents Tiled map and RPG features. No license file or license grant was found in the inspected upstream root/README, so no upstream source code or assets have been copied into this repository. The new adapter is an independent implementation of documented concepts.

## Requirements
- Node.js 20 or later
- npm
- MySQL 8 or later for API/database features

## Verify the project

Run `npm test` to execute the Vitest unit tests for character progression, combat, and quest prerequisites. Run `npm run build` to type-check and build the browser client. GitHub Actions runs these checks and separately type-checks the API server.

## Run the browser client
At the repository root:
```bash
npm install
npm test
npm run build
npm run dev
```
Open the Vite URL shown in the terminal (normally http://localhost:5173). The client can run independently of MySQL for local prototype play.

## Run the API
In a second terminal:
```bash
cp .env.example .env
```
Edit `.env` and set your local MySQL connection details. Do not commit `.env` or real credentials. Then initialize the schema:
```bash
mysql -u root -p < database/schema.sql
```
Install and start the API:
```bash
cd server
npm install
npm run dev
```
The health endpoint is http://localhost:3001/api/health. Configure `MYSQL_USER`, `MYSQL_PASSWORD`, and other settings in `.env` before use.

## Controls
- Move: WASD or arrow keys.
- Mouse: click a neighboring tile.
- Gamepad: left stick or D-pad; Cross/button 0 attacks during an encounter when the browser reports a compatible controller.
- Browser controller support depends on operating system, browser, connection, and focus. This is not a native PlayStation 5 build.

## Documentation
- `docs/GAME_DESIGN_DOCUMENT.md` — design pillars, classes, combat rules, campaign, nine realms, quests, instances, audio, assets, and milestones.
- `docs/MULTIPLAYER_AND_MODES.md` — title/loading flow and single-player/offline/online/multiplayer architecture.
- `docs/ARCHITECTURE_AND_UML.md` — Mermaid system context, class diagram, online join sequence, and database ER model.
- `docs/TECH_STACK.md` — language roles, API boundary, and recommended client/server stack.
- `docs/CONTROLS.md` — keyboard, mouse, and browser gamepad mappings.
- `docs/ASSET_AUDIO_PIPELINE.md` — original pixel-art and 8-bit audio pipeline plan.
- `docs/TEST_PLAN.md` — prototype smoke tests and release gates.
- `.github/workflows/ci.yml` — GitHub Actions build/type-check jobs for client and API.
- `docs/CONTROLS.md` — input mapping and browser Gamepad API limitations.
- `database/schema.sql` — MySQL schema.
- `.env.example` — configuration template.

## Security and production readiness
Do not expose the API publicly without authentication, authorization, TLS, input validation, rate limiting, secret management, backups, and server-side state validation. The current scheduled jobs are scaffolding. A multi-replica production deployment needs a distributed lock or a single designated scheduler.

## License
This project is licensed under the MIT License; see `LICENSE`. Third-party packages, geographic datasets, and future art/audio assets may have separate licenses and must be credited according to their terms.

## Documentation and source organization

The canonical documentation entry point is [Master Documentation](docs/MASTER_DOCUMENTATION.md). It links to the [repository structure standard](docs/REPOSITORY_STRUCTURE.md), [source documentation registry](docs/SOURCE_DOCUMENTATION_INDEX.md), [game design](docs/GAME_DESIGN_DOCUMENT.md), [architecture/UML](docs/ARCHITECTURE_AND_UML.md), and [multiplayer plan](docs/MULTIPLAYER_AND_MODES.md).

Source modules use stable file and module IDs, documentation flags, sidecar explanations, and backlinks. See the registry for the source-to-documentation map. JSON files cannot contain comments without becoming invalid JSON, so their IDs and documentation links are kept in the registry and sidecar documents instead.

### Efficiency and implementation status

The browser prototype still has a relatively large `src/main.ts` composition file. The documented refactor path is to split UI rendering, input, persistence, map generation, and combat orchestration into modules with clear ownership and tests. Avoid creating excessive tiny folders; add a submodule when it provides a meaningful boundary. Current code and documentation describe a prototype, not a production-ready MMORPG. Run `npm run build` locally or in CI to verify compilation; do not infer build success from a commit alone.

## Engine source modules
- [Game engine facade](src/game/GameEngine.ts)
- [Character stats and progression](src/game/character/Character.ts)
- [Turn-based combat engine](src/game/combat/CombatEngine.ts)
- [Buffs, debuffs, and conditions](src/game/effects/EffectSystem.ts)
- [Inventory, equipment, and shop transactions](src/game/inventory/Inventory.ts)
- [Quest progression](src/game/quests/QuestEngine.ts)
- [Tile maps and collision](src/game/world/TileMap.ts), [collision rules](src/game/world/CollisionSystem.ts)
- [Image/audio asset catalog](src/game/assets/AssetCatalog.ts) — preserves media support; add actual media under `public/assets/` with license notes.
- [MySQL schema](database/schema.sql) and [backend setup](server/README.md)

### Start the backend
From repository root, copy `.env.example` to `.env`, set your MySQL credentials, then initialize the schema with `mysql -u root -p < database/schema.sql`. In a separate terminal run `cd server && npm install && npm run dev`. The guest endpoint is a basic stored profile, not an authentication system. The room relay and account API are early integration foundations; the browser UI still needs to connect them, and authoritative combat remains unimplemented.


### Integrated gameplay modules

- [Game session orchestration](src/game/GameSession.ts) — movement, quests, rewards, inventory, and save snapshots.
- [Versioned save codec](src/game/persistence/SaveCodec.ts) — JSON serialization and runtime structure checks.
- [Seeded procedural world generator](src/game/world/WorldGenerator.ts) — deterministic walkable/blocking terrain for prototype regions.
- [Game session module notes](docs/source/GameSession.ts.docs.md).
- [Save codec module notes](docs/source/SaveCodec.ts.docs.md).

These systems are early prototype foundations. The save codec does not authenticate save data, item reward IDs still need a data-driven item resolver, and the world generator does not produce real-world geography or settlements yet.

### Runtime save restoration and browser controller

- [Game runtime restoration](src/game/GameRuntime.ts) — reconstructs the starter world and restores validated character state from a save snapshot.
- [Session restore](src/game/GameSession.ts) — restores legal position, inventory, equipment, and registered quest progress.
- [Inventory snapshot restore](src/game/inventory/Inventory.ts) and [quest progress restore](src/game/quests/QuestEngine.ts).
- [Browser game controller](src/game/BrowserGameController.ts) — UI-facing facade for new/continue game, save slots, movement, consumables, and dialogue.
- [Controller tests](src/game/__tests__/browser-game-controller.test.ts) and [runtime restore tests](src/game/__tests__/game-runtime.test.ts).
- [Controller documentation](docs/source/BrowserGameController.ts.docs.md).

These modules provide a tested integration boundary. The existing `src/main.ts` prototype still has its own state and must be migrated to the controller before these flows become the live UI behavior.

### Consumable items

- [Consumable service](src/game/inventory/ConsumableService.ts) — validates inventory ownership, applies healing, and consumes one item transactionally.
- [Starter consumable effects](src/game/data/Consumables.ts) — Small Potion restores up to 15 HP.
- [Consumable tests](src/game/__tests__/consumable-service.test.ts).
- [Consumable documentation](docs/source/ConsumableService.ts.docs.md).

The effect service is a tested gameplay module; it still needs to be wired into the browser inventory UI.

### Save slots and game interactions

- [Save repository](src/game/persistence/SaveRepository.ts) — namespaced save slots, payload-size limits, and codec validation.
- [Save repository tests](src/game/__tests__/save-repository.test.ts).
- [Save repository notes](docs/source/SaveRepository.ts.docs.md).
- [Interaction service](src/game/interactions/InteractionService.ts) — connects dialogue choices to quest acceptance.
- [Interaction tests](src/game/__tests__/interaction-service.test.ts).

These modules are tested independently. Save snapshots are not yet restored into a live runtime, and browser UI integration remains a separate step.

### NPC dialogue

- [Dialogue engine](src/game/dialogue/DialogueEngine.ts) — validated, branching conversation trees.
- [Starter NPC dialogue](src/game/data/Dialogue.ts) — village elder warning and quest-related choices.
- [Dialogue engine tests](src/game/__tests__/dialogue-engine.test.ts).
- [Dialogue engine notes](docs/source/DialogueEngine.ts.docs.md).

Dialogue choices expose optional quest IDs for the UI to process. Dialogue rendering, persistent conversation flags, and automatic quest acceptance still need integration.

### Abilities and spell rules

- [Ability engine](src/game/abilities/AbilityEngine.ts) — validates target type, level, mana cost, and resolves damage, healing, and mana restoration.
- [Starter abilities](src/game/data/Abilities.ts) — Spark, Heavy Strike, Mend, and Second Wind examples.
- [Ability engine tests](src/game/__tests__/ability-engine.test.ts).
- [Ability engine module notes](docs/source/AbilityEngine.ts.docs.md).

The ability engine is a reusable rules module. It is not yet connected as the browser's only combat path, and the current character model still needs a first-class mana field before full integration.

### Starter game data

- [Starter items and quest definitions](src/game/data/StarterContent.ts) — sample consumables, equipment, and quest objectives/rewards.
- [Creature catalog](src/game/data/Creatures.ts) — initial slime, wolf, and skeleton combat stats and rewards.
- [Creature catalog tests](src/game/__tests__/creatures.test.ts).

Quest item rewards are granted only when their item definitions have been registered with the session. Unknown rewards or inventory-capacity failures are returned in `unresolvedItemRewards` so the game can surface them instead of silently losing them.
- [Weighted encounter tables](src/game/data/EncounterTables.ts) — starter meadow and old-road creature selection with injectable randomness.
- [Encounter selection tests](src/game/__tests__/encounters.test.ts).
- [BattleService](src/game/combat/BattleService.ts) — connects combat encounters to character HP, creature XP/gold, and quest kill objectives.
- [BattleService module notes](docs/source/BattleService.ts.docs.md).
- [Battle integration tests](src/game/__tests__/battle-service.test.ts).
- [GameRuntime](src/game/GameRuntime.ts) — composition factory for seeded region, character, starter inventory/quests, and battle service.
- [GameRuntime module notes](docs/source/GameRuntime.ts.docs.md).
- [GameRuntime tests](src/game/__tests__/game-runtime.test.ts).
- [Runtime factory](src/game/GameRuntime.ts) now equips the starter iron sword and exposes random encounter startup.
- Session equipment slots are included in save snapshots, and equipped weapon/armor bonuses are applied when battle stats are created.
- [Combat outcome regression tests](src/game/__tests__/combat-outcomes.test.ts) cover both player victory and defeat.
- [Creature loot tables](src/game/data/LootTables.ts) — chance-based drops, quantity ranges, and deterministic test support.
- [Loot table tests](src/game/__tests__/loot-tables.test.ts).
- Creature victory rewards now include XP, gold, kill-quest progress, and registered item drops through [BattleService](src/game/combat/BattleService.ts).
- [Loot table documentation](docs/source/LootTables.ts.docs.md) explains drop probabilities and unresolved item handling.


## Backend account, cloud-save, and realtime services

The API now includes account registration/login with scrypt password hashes and one-hour signed bearer tokens, authenticated profile lookup, versioned cloud-save endpoints, and an authenticated WebSocket room relay. The relay supports ephemeral room membership and validated one-tile movement broadcasts; it is not yet a persistent authoritative MMO simulation. Configure `AUTH_SECRET` in `.env` before starting the API and initialize the updated MySQL schema. See [Backend API and Realtime Service](docs/server/README.md) for endpoint contracts and limitations.


## Import an authored Tiled map

The title screen now supports importing an authored Tiled JSON map. Choose **Or load a Tiled JSON map**, select a map exported from Tiled, and press **Start on Imported Map**. The game validates the document and places the character on the first walkable tile.

A small original example map is included at [public/maps/starter-village.json](public/maps/starter-village.json). See [Tiled map import documentation](docs/TILED_MAP_IMPORT.md) for supported layers, tile properties, and current limitations. The current renderer displays imported terrain using its native pixel glyph palette; it does not yet draw external Tiled tileset image atlases or the optional overlay layer.
