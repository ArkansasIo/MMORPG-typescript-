# src/game/types.ts — Source Documentation
- **Document ID:** ER-DOC-FILE-GAME-TYPES-0001
- **Source ID:** ER-FILE-GAME-TYPES-0001
- **Module ID:** ER-MOD-GAME-0001
- **Source backlink:** [../../src/game/types.ts](../../src/game/types.ts)
- **Folder:** [Game module README](../../src/game/README.md)
- **Master:** [../MASTER_DOCUMENTATION.md](../MASTER_DOCUMENTATION.md) · [Registry](../SOURCE_DOCUMENTATION_INDEX.md)
- **Status:** Implemented

## Purpose
Defines shared compile-time types for damage types, status effects, character classes, ability scores, combatants, and combat log entries.

## Important limitation
TypeScript interfaces are erased at runtime. Validate API payloads with runtime schemas before trusting incoming data. Update this document whenever public fields or enums change.
