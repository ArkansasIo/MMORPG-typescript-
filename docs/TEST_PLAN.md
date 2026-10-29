# Test Plan

## Prototype smoke tests
1. Run `npm install` and `npm run dev`; verify Vite serves the browser client.
2. Verify title screen and Offline Play flow.
3. Create a character and verify name/class persistence and display.
4. Move with WASD/arrows and confirm water/mountain collision.
5. Click an adjacent tile and confirm one-step movement.
6. Trigger an encounter; test attack, spell, flee, XP, gold and level-up.
7. Save, reload and verify local state restoration.
8. Connect a supported controller and verify Gamepad API detection.
9. Run `npm run build` and resolve TypeScript/build failures.
10. If MySQL is configured, apply `database/schema.sql` and check `/api/health`.

## Required automated tests
- Seed generator determinism and version compatibility.
- Combat turn order, d20 checks, hits/misses, critical rules, damage modifiers, resistances, conditions and healing.
- Quest prerequisite validation and duplicate-event idempotency.
- Inventory transaction safety and currency invariants.
- Authentication, authorization, rate limiting and session expiry.
- Multiplayer reconnection, room capacity, invalid movement, duplicate requests and server authority.
- Instance lockouts, scheduled resets, loot generation and duplicate cron execution.
- Map projection, geographic import and tile/polygon consistency.

## Release gate
Do not call a build production-ready until build, lint, unit tests, integration tests, database migration checks, dependency audit and security review pass. Online mode must clearly report when the server is unavailable rather than implying multiplayer is active.
