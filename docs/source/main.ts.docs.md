# src/main.ts — Source Documentation
- **Document ID:** ER-DOC-FILE-CLIENT-ENTRY-0001
- **Source ID:** ER-FILE-CLIENT-ENTRY-0001
- **Module ID:** ER-MOD-CLIENT-0001
- **Source backlink:** [../../src/main.ts](../../src/main.ts)
- **Master:** [../MASTER_DOCUMENTATION.md](../MASTER_DOCUMENTATION.md) · [Registry](../SOURCE_DOCUMENTATION_INDEX.md)
- **Status:** Partial

## Purpose
Bootstraps and renders the browser prototype and coordinates input, interface state, local saves, and encounters.

## Efficiency and maintenance
This file is currently a large composition module. As the project grows, extract UI rendering, input adapters, save/load, map generation, and combat orchestration into focused modules. Keep shared state explicit; avoid duplicate event handlers when rerendering. Prefer DOM event delegation or stable listeners and update only the UI region that changed.

## Security and boundaries
Browser state is not trusted by an online server. The client is not an authoritative multiplayer simulation. Real authentication, server-authoritative combat, persistence, and network sessions remain unimplemented.

## Validation
Run `npm install` and `npm run build` at repository root. This document does not claim the build has passed.
