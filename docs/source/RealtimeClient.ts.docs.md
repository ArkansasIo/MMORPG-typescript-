# Browser realtime client

File: `src/game/network/RealtimeClient.ts` (ER-FILE-REALTIME-CLIENT-0001).

Typed WebSocket wrapper for authenticated connection, room join, movement, heartbeat, and event delivery. It requires a WSS endpoint in production. It is a transport adapter only; it does not synchronize the local GameRuntime or provide server-authoritative combat.