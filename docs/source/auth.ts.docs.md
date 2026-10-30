# Auth token module

**File:** `server/src/auth.ts`  
**ID:** `ER-FILE-AUTH-0001`

Uses Node's scrypt password derivation with a per-password random salt and HMAC-SHA256 signed, one-hour bearer tokens. Verification uses timing-safe comparison. `AUTH_SECRET` must be at least 32 characters. Tokens are not refreshable or individually revocable in this prototype.
