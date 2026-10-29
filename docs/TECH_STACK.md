# Technology Stack and Language Architecture

## Recommended architecture

- **Frontend:** TypeScript, HTML, CSS, Vite. TypeScript is the primary client language because it supports typed game state, combat rules, UI, input, and asset metadata.
- **Browser rendering:** Canvas 2D for the map and sprite renderer; DOM/CSS for menus, dialogs, inventory, quest log, and accessible controls.
- **Backend API:** Node.js + TypeScript + Express for accounts, characters, quests, inventory, matchmaking, and administration.
- **Real-time multiplayer:** WebSocket (for example, ws or Socket.IO) with server-authoritative movement, combat, party, and instance state.
- **Database:** MySQL 8 for accounts, characters, inventory, quests, guilds, instance records, world seeds, and audit events.
- **Scheduled jobs:** node-cron for a single instance; a distributed lock or dedicated worker for multi-server deployments.
- **AJAX:** The historical term for asynchronous browser requests. Use modern `fetch()` with JSON over HTTP for API calls; use WebSocket for real-time state.
- **Java:** Optional separate service for a larger backend if there is a concrete need for JVM libraries or a Java team. It is not required for this project.
- **JavaScript:** Runs in the browser and Node.js; TypeScript compiles to JavaScript. Avoid maintaining parallel JavaScript and TypeScript implementations of the same system.
- **SQL:** Schema, indexes, transactions, and migrations for MySQL.
- **Bash/PowerShell:** Local developer scripts and CI helpers.
- **JSON/YAML:** Game data/configuration and CI workflows. Use schema validation for externally supplied data.

## Client/server boundary

The browser owns presentation, input collection, local offline simulation, and rendering. The server must own trusted online state: inventory grants, currency, combat outcomes, quest completion, loot rolls, guild permissions, and instance lockouts. Never trust client-supplied damage, loot, level, or reward values.

## API shape

- `GET /api/health` — liveness and dependency status.
- `GET /api/config` — safe public game/build configuration.
- `POST /api/auth/register`, `POST /api/auth/login` — planned; use secure password hashing and rate limits.
- `GET /api/characters`, `POST /api/characters` — planned character list/create.
- `GET /api/quests`, `POST /api/quests/:id/accept` — planned quest journal actions.
- `POST /api/rooms`, `POST /api/rooms/:id/join` — planned multiplayer room management.
- WebSocket events — planned authenticated room join, movement intent, combat intent, party updates, and state snapshots.

## Implementation order

1. Keep TypeScript as the single source of truth for game rules shared by client and server.
2. Extract rules into a shared package with deterministic unit tests.
3. Add backend authentication and database migrations.
4. Add WebSocket sessions and authoritative state.
5. Add browser Canvas renderer and asset pipeline.
6. Add optional Java service only if a specific workload justifies it.

This document describes the target architecture; not every listed endpoint or service currently exists.