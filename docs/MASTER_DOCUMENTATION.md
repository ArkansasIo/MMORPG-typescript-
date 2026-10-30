# Earthbound Realms — Master Documentation

- **Build ID:** ER-TS-MMORPG-0.1.0
- **Documentation ID:** ER-DOC-MASTER-0001
- **Owner:** Stephen Delaine Jr.
- **Status:** Prototype architecture; some systems are planned, not implemented.
- **Index version:** 1.0.0

## Documentation navigation
- [Repository structure and naming standard](./REPOSITORY_STRUCTURE.md) — `ER-DOC-ARCH-0001`
- [Programming and scripting](./PROGRAMMING_AND_SCRIPTING.md) — `ER-DOC-LANG-0001`
- [Game design](./GAME_DESIGN_DOCUMENT.md)
- [Architecture and UML](./ARCHITECTURE_AND_UML.md)
- [Multiplayer and modes](./MULTIPLAYER_AND_MODES.md)
- [Source documentation registry](./SOURCE_DOCUMENTATION_INDEX.md) — `ER-DOC-REGISTRY-0001`

## Rules
1. Every module, submodule, folder, and source file receives a stable unique ID and a human-readable name.
2. Every source file starts with a documentation flag that names its ID, module path, and sidecar documentation file.
3. Each source file has a sibling `*.docs.md` file explaining purpose, public API, dependencies, important comments, examples, limitations, and tests.
4. Each module folder contains a `README.md` with its own folder ID, parent ID, child modules, and navigation.
5. The source file links to documentation; documentation links back to the source using a repository-relative path.
6. Update `SOURCE_DOCUMENTATION_INDEX.md` whenever files or IDs change.
7. IDs are immutable once published. Do not recycle IDs after deleting files.
8. The ID in a filename is optional; the manifest records the canonical ID. Keep conventional import filenames for tool compatibility.
9. Comments should explain intent, invariants, non-obvious algorithms, security assumptions, and trade-offs—not merely repeat each line.
10. Documentation describes actual implementation separately from planned functionality.

## Status vocabulary
- **Implemented:** code exists in this repository.
- **Partial:** a prototype exists with important limitations.
- **Planned:** documented but not implemented.
- **Verified:** automated or manual validation has actually been performed. Do not use this status without evidence.

## Folder tree
See [REPOSITORY_STRUCTURE.md](./REPOSITORY_STRUCTURE.md). The current repository is a prototype; the full target structure is a governed plan and should be created incrementally.

- [Classic JRPG / Dragon Warrior adaptation plan](./CLASSIC_JRPG_ADAPTATION.md) — `ER-DOC-JRPG-ADAPT-0001`.
- [Backend API and Realtime Service](./server/README.md) — account API, cloud saves, and prototype WebSocket rooms.
