# Cloud save routes

**File:** `server/src/save-routes.ts`  
**ID:** `ER-FILE-SAVE-ROUTES-0001`

Requires bearer authentication and stores one version-1 JSON save per player. Rejects arrays/non-objects, unsupported versions, and payloads larger than 64 KiB. Save schema migration, conflict resolution, anti-cheat validation, and rollback history are future work.
