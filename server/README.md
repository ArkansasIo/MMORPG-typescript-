# Backend API
- **Folder ID:** ER-DIR-SERVER-0001
- **Module ID:** ER-MOD-SERVER-APP-0001
- **Parent ID:** ER-ROOT-0001
- **Purpose:** Node.js/Express TypeScript API and MySQL persistence.
- **Database:** schema in `database/schema.sql`.
- **Master documentation:** [../docs/MASTER_DOCUMENTATION.md](../docs/MASTER_DOCUMENTATION.md)
- **Status:** Partial prototype; authentication and online multiplayer are not implemented.

## Setup
1. Install Node.js 20+ and MySQL 8+.
2. Copy `.env.example` to `.env` and set credentials. Never commit `.env`.
3. Initialize schema: `mysql -u root -p < database/schema.sql` from repository root.
4. In this directory run `npm install`, then `npm run dev`.
5. Check `GET http://localhost:3001/api/health`.

## Endpoints
- `GET /api/health`: API and database readiness.
- `GET /api/config`: build identity and capability flags.
- `GET /api/world-seed`: persistent primary world seed.
- `POST /api/guest`: creates a basic stored player profile; not authentication.

Before public deployment, add authentication, rate limiting, request schema validation, structured logging, database migrations, and server-authoritative gameplay. Do not expose detailed database errors in production.
