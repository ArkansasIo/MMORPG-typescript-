# Game Modes and Multiplayer Plan

## Main menu flow
1. Title screen: Earthbound Realms, build name, build ID, developer credits.
2. Continue: load a local save in offline mode, or request the player's server save after sign-in.
3. New Game: open character creation.
4. Play Offline: local world simulation and local save; no account or network required.
5. Play Online: connect to the game API, authenticate, and join or create a session.
6. Multiplayer: create/join a party or room, invite friends, and see connection state.
7. Settings: input, audio, accessibility, display, and controller settings.
8. Credits: single-person development credit and third-party notices.

## Modes
- Single-player offline: local state, browser storage, no network dependency.
- Single-player online: server-backed save and online world events.
- Multiplayer online: authoritative server validates movement, combat, loot, and party state.
- Offline mode must not pretend to synchronize with other players. When connectivity returns, a future sync layer can submit safe local progression subject to server validation.

## Loading flow
Show an accessible loading screen with the selected mode, current stage, progress indicator, and Cancel button. Stages: loading configuration, loading save, initializing seed, loading region, connecting to server (online only), entering world. If online connection fails, offer Retry or Play Offline where a local save exists.

## Browser architecture
- Client: TypeScript + Vite.
- API: Node.js + Express.
- Persistence: MySQL.
- Multiplayer transport: authenticated WebSocket room relay (implemented as an ephemeral prototype; not a persistent MMO transport).
- Authority: server must validate combat, movement, inventory, currency, and quest completion.
- Offline saves: local browser storage for prototype; use IndexedDB for a production client.
- Session: reconnect tokens must be short-lived and protected; never store passwords in localStorage.

## Multiplayer MVP scope
1. Health/version handshake.
2. Create/join room with capacity and unique room ID.
3. Player join/leave and reconnect.
4. Server-authoritative movement and room state broadcast.
5. Party chat with validation and rate limits.
6. Combat action messages and server-side resolution.
7. Persistent player save/load and basic anti-cheat checks.

## Current implementation status
The browser prototype supports local single-player play, local browser saves, keyboard/mouse controls, and Gamepad API polling. The API now implements account registration/login, bearer-authenticated profile lookup and cloud saves, plus a WebSocket relay with authenticated ephemeral rooms and movement broadcasts. Typed browser API and realtime clients exist, but are not yet integrated into the game UI. Persistent sessions, reconnect, party/chat features, server-authoritative movement against world collision, combat validation, and multi-instance room coordination remain planned. The title-screen and loading-flow requirements are not all implemented.
