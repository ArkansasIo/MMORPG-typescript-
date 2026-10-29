# Game Domain Module
- **Folder ID:** ER-DIR-GAME-0001
- **Module ID:** ER-MOD-GAME-0001
- **Parent ID:** ER-MOD-CLIENT-0001
- **Purpose:** UI-independent gameplay rules and domain systems.
- **Core facade:** `GameEngine.ts` (ER-FILE-GAME-ENGINE-0001).
- **Submodules:** `world/` maps/collision; `character/` attributes/progression; `combat/` turn-based battle; `effects/` buffs/debuffs; `inventory/` items/equipment/shop; `quests/` objectives/rewards; `assets/` media catalog/audio playback.
- **Documentation:** [Master](../../docs/MASTER_DOCUMENTATION.md), [registry](../../docs/SOURCE_DOCUMENTATION_INDEX.md), [classic JRPG plan](../../docs/CLASSIC_JRPG_ADAPTATION.md).
- **Status:** Core rules foundations implemented; not yet all wired into the UI or multiplayer server.
