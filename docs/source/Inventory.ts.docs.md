# Inventory.ts — Source Documentation
- **Document ID:** ER-DOC-FILE-INVENTORY-ENGINE-0001
- **Source backlink:** [../../src/game/inventory/Inventory.ts](../../src/game/inventory/Inventory.ts)
- **Master:** [../MASTER_DOCUMENTATION.md](../MASTER_DOCUMENTATION.md)

Provides item stacks, capacity limits, quantity queries, add/remove, equipment slots, and shop buy/sell transactions. Inventory additions are transactional: a failed add does not change stacks. Wallet persistence, item catalog validation, and server-side transaction locking remain future work.
