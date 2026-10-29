# Earthbound Realms — TypeScript MMORPG Starter

A TypeScript browser RPG starter with classic turn-based exploration, procedural seeded regions, a responsive MMORPG-style interface, an Express API, MySQL schema, and scheduled job scaffolding.

## Stack
- TypeScript + Vite browser client
- Node.js + Express API
- MySQL 8 persistence schema
- node-cron scheduled jobs
- Deterministic seed-based region generation

## Run locally
1. Install Node.js 20+ and MySQL 8+.
2. Copy `.env.example` to `.env` and set database credentials.
3. Run `mysql -u root -p < database/schema.sql`.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open http://localhost:5173; API health is at http://localhost:3001/api/health.

This is a foundation, not a production-ready MMORPG. Authentication, authoritative multiplayer, real Earth geographic data, full D&D 5e rules, large-scale raids/towers, and a finished audio/asset library remain future modules. The UI uses broad MMORPG conventions and original styling rather than copying proprietary game art.
