# Backend API and Realtime Service

Build the API from the repository root:

```bash
cp .env.example .env
# Set MYSQL_* and AUTH_SECRET (at least 32 random characters).
mysql -u root -p < database/schema.sql
cd server
npm install
npm run build
npm run dev
```

The HTTP API defaults to `http://localhost:3001`; the WebSocket endpoint is `ws://localhost:3001/realtime`.

## HTTP endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | API and database health |
| GET | `/api/config` | Build/API capabilities |
| GET | `/api/world-seed` | Read or initialize the primary seed |
| POST | `/api/guest` | Create a guest player (not an account) |
| POST | `/api/auth/register` | Create account and player |
| POST | `/api/auth/login` | Issue a short-lived bearer token |
| GET | `/api/auth/me` | Read authenticated player profile |
| GET | `/api/saves` | Read authenticated cloud save |
| PUT | `/api/saves` | Replace authenticated cloud save |

Register JSON: `{"displayName":"Wayfarer","email":"player@example.com","password":"a-long-password"}`.

Login JSON: `{"email":"player@example.com","password":"a-long-password"}`.

Authenticated requests use `Authorization: Bearer <token>`. The save endpoint accepts `{"version":1,"save":{...}}` and enforces a 64 KiB serialized payload limit.

## Realtime protocol

Open a WebSocket with subprotocols `earthbound-v1` and `bearer.<access-token>`. Send `{"type":"join","roomId":"frontier"}`, then movement messages `{"type":"move","dx":1,"dy":0}`. A move must be exactly one orthogonal tile and is rate limited. Send `{"type":"ping"}` for a heartbeat.

The relay currently provides ephemeral rooms of up to eight connected players and broadcasts join, leave, and movement events. Room state is in memory, resets on restart, and is not yet tied to generated world collision, persistent sessions, parties, chat, or authoritative combat. Do not present it as production MMORPG networking.

## Security and operations

- Use HTTPS/WSS in deployment and a strong unique `AUTH_SECRET`; rotate it deliberately because rotation invalidates existing tokens.
- Configure `CLIENT_ORIGIN` to the exact production browser origin.
- Add reverse-proxy rate limits, TLS, monitoring, backups, account recovery, email verification, and audit logging before public launch.
- The current bearer tokens expire after one hour; refresh/revocation and session management are not implemented.
- Never commit `.env` or credentials.
