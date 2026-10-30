# Deployment Guide

## Browser client — GitHub Pages

The `Deploy GitHub Pages` workflow builds the Vite client and publishes `dist/` on pushes to `main`. The Vite base path is configured for the repository project site:

`https://arkansasio.github.io/MMORPG-typescript-/`

In GitHub repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The first workflow run may require this one-time setting. The client runs as a local browser prototype; GitHub Pages does not host the Express/MySQL/WebSocket backend.

## Backend

Deploy the Express API and WebSocket process to a Node.js host with persistent networking and a MySQL 8 database. Set `PORT`, `CLIENT_ORIGIN`, `AUTH_SECRET`, and `MYSQL_*` environment variables. Apply `database/schema.sql` to a new database. Configure HTTPS/WSS at the host or reverse proxy.

## Production caveats

The realtime relay is process-local and ephemeral. It is suitable for integration testing, not multi-instance production. Before public launch implement persistent room coordination (e.g. Redis), authoritative world simulation and combat, anti-cheat validation, rate limiting, account recovery, observability, backups, and database migrations.
