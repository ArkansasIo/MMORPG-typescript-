# server/src/db/pool.ts — Source Documentation
- **Document ID:** ER-DOC-FILE-SERVER-DB-POOL-0001
- **Source backlink:** [../../server/src/db/pool.ts](../../server/src/db/pool.ts)
- **Master:** [../MASTER_DOCUMENTATION.md](../MASTER_DOCUMENTATION.md)

Creates the shared mysql2/promise pool using environment variables, bounded connections, and keepalive. Do not place credentials in source control. Ensure the schema is applied before using data endpoints.
