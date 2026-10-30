# Account route module

**File:** `server/src/auth-routes.ts`  
**ID:** `ER-FILE-AUTH-ROUTES-0001`

Implements registration, login, and authenticated profile lookup. Registration inserts the player and account within one database transaction. Duplicate email addresses return HTTP 409. Passwords are hashed before storage; plaintext passwords and hashes are never returned. Production hardening still requires rate limiting, email verification, password reset, and abuse monitoring.
