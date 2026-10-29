# QuestEngine.ts — Source Documentation
- **Document ID:** ER-DOC-FILE-QUEST-ENGINE-0001
- **Source backlink:** [../../src/game/quests/QuestEngine.ts](../../src/game/quests/QuestEngine.ts)
- **Master:** [../MASTER_DOCUMENTATION.md](../MASTER_DOCUMENTATION.md)

Registers data-driven quests, checks prerequisites, records kill/collect/talk/visit progress, and returns newly completed quest definitions for reward processing. This module does not automatically award rewards or persist quest state; those responsibilities belong in an orchestrator and repository.
