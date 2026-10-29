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
- `docs/CONTROLS.md` — input mapping and browser Gamepad API limitations.
- `database/schema.sql` — MySQL schema.
- `.env.example` — configuration template.

## Security and production readiness
Do not expose the API publicly without authentication, authorization, TLS, input validation, rate limiting, secret management, backups, and server-side state validation. The current scheduled jobs are scaffolding. A multi-replica production deployment needs a distributed lock or a single designated scheduler.

## License
This project is licensed under the MIT License; see `LICENSE`. Third-party packages, geographic datasets, and future art/audio assets may have separate licenses and must be credited according to their terms.