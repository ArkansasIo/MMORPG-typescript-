# Browser API client

File: `src/game/network/ApiClient.ts` (ER-FILE-API-CLIENT-0001).

Provides typed registration, login, profile, and cloud-save requests. The caller supplies the API base URL and bearer token. The module intentionally does not persist credentials; applications should use a deliberate secure session strategy and must not put passwords in browser storage.