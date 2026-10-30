# Repository Structure and Naming Standard
**Document ID:** ER-DOC-ARCH-0001 · **Parent:** ER-DOC-MASTER-0001

## Naming and traceability
Every folder/module has a unique immutable ID, a readable name, a parent ID, a branch path, and an implementation status. Every source file has a file ID, module ID, documentation flag, sidecar document, and backlinks. IDs are registry keys—not line numbers, array indexes, or folder-order numbers. Never recycle an ID.

Every source file starts with a syntax-appropriate comment containing `@file-id`, `@module-id`, `@doc`, `@master-doc`, and a short purpose. Each sidecar links back to the exact source file. Each module folder contains a README explaining its ID, parent, purpose, child modules, docs, and status.

## Current tree and intended growth
```text
EarthboundRealms [ER-ROOT-0001]
├── docs [ER-DIR-DOCS-0001]
│   ├── MASTER_DOCUMENTATION.md
│   ├── REPOSITORY_STRUCTURE.md
│   ├── SOURCE_DOCUMENTATION_INDEX.md
│   ├── server/README.md        # backend API and realtime contract
│   ├── DEPLOYMENT.md            # Pages and backend deployment
│   └── source/                 # per-file sidecar documents
├── src [ER-DIR-CLIENT-0001]
│   ├── main.ts                 # browser composition root
│   ├── style.css               # interface presentation
│   └── game [ER-DIR-GAME-0001]
│       ├── types.ts            # shared domain contracts
│       └── game/world/         # tile map, collision, Tiled JSON importer/runtime
│       └── network/             # typed HTTP and WebSocket clients
├── database/                   # MySQL schema
├── server/                     # Express API, account auth, cloud saves, WebSocket relay
├── vite.config.ts              # GitHub Pages base path and Vite build
├── scripts/                    # planned tooling
└── tests/                      # planned automated tests
```

## Folder README template
```md
# Module name
- Folder ID: ER-DIR-...
- Module ID: ER-MOD-...
- Parent ID: ER-MOD-... or ER-ROOT-0001
- Purpose: ...
- Child modules: ...
- Documentation: link to master and registry
- Status: Implemented | Partial | Planned
```

## Comment quality
Comments should capture intent, invariants, tricky algorithms, security assumptions, and trade-offs. Do not narrate obvious statements. Document exported APIs and public data contracts. Mark unfinished work with a specific limitation rather than claiming it works.

## Status definitions
- **Implemented:** source exists.
- **Partial:** prototype exists with material gaps.
- **Planned:** design only; not yet present.
- **Verified:** only after an actual test/build has passed.
