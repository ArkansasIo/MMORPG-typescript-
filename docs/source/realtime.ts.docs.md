# Realtime room relay

**File:** `server/src/realtime.ts`  
**ID:** `ER-FILE-REALTIME-0001`

Authenticates WebSocket connections using the bearer token supplied in the `bearer.<token>` subprotocol. Supports room join, ping/pong, one-tile orthogonal movement, and room broadcasts. Room state is ephemeral and process-local. It does not validate map collision, persist coordinates, resolve combat, or support horizontal scaling.
