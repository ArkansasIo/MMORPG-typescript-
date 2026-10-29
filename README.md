# Earthbound Realms — TypeScript RPG/MMORPG Prototype

**Build name:** Earthbound Realms TypeScript MMORPG Prototype  
**Build ID:** ER-TS-MMORPG-0.1.0  
**Version:** 0.1.0  
**Developer:** Stephen Delaine Jr. — solo development

Earthbound Realms is an original retro fantasy RPG prototype combining classic menu-driven JRPG exploration, creature-inspired turn-based encounters, a D20/tabletop-inspired rules direction, and MMORPG-style systems. The repository is a foundation and design roadmap, not a finished production MMORPG.

## Included now
- TypeScript + Vite browser client with a retro-fantasy panel interface.
- Title screen with New Game, Continue, Play Offline, Play Online, Settings, and Credits entries.
- Basic character-name/class selection, loading overlay, and local browser save flow.
- Seeded procedural demonstration region with tile movement and terrain blocking.
- Keyboard (WASD/arrows), mouse, and browser Gamepad API input where supported.
- Basic encounter/attack loop, HP, XP, leveling, and gold.
- Express API starter, MySQL schema, environment template, and cron-job scaffolding.
- Design documents for game systems, modes, story campaign, realms, and architecture/UML.

## Planned design targets
- Nine character classes and D20-inspired checks, attacks, saving throws, and conditions.
- Twelve story acts and fifty chapters.
- Nine Norse-inspired realms with medieval fantasy and outer-space zones.
- 42 trials, 18 raids, and 12 towers of up to 100 floors each.
- Real Earth geographic data, countries, roads, settlements, and a fantasy overlay.
- Original 8-bit sprites, sound effects, and 24 music tracks.
- Online multiplayer with server-authoritative state, accounts, parties, and instance sessions.

These are targets, not completed content. The current map is schematic and is not a real Earth map. The online menu entry checks for a local API, but actual authentication, WebSocket multiplayer, and shared online sessions are not implemented yet.

## Requirements
- Node.js 20 or later
- npm
- MySQL 8 or later for API/database features

## Run the browser client
At the repository root:
```bash
npm install
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
From repository root, copy `.env.example` to `.env`, set your MySQL credentials, then initialize the schema with `mysql -u root -p < database/schema.sql`. In a separate terminal run `cd server && npm install && npm run dev`. The guest endpoint is a basic stored profile, not an authentication system. Online multiplayer, account authentication, and authoritative combat still require implementation.
