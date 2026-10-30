/** @file-id ER-FILE-AUTH-ROUTES-0001
 * @module-id ER-MOD-AUTH-0001
 * @doc ../../docs/source/auth-routes.ts.docs.md
 * Registration/login routes. Credentials are never returned or logged.
 */
import { Router } from "express";
import { pool } from "./db/pool.js";
import { hashPassword, signToken, verifyPassword, requireAuth, authClaims } from "./auth.js";
const router = Router();
const validName = (value: unknown): value is string => typeof value === "string" && value.trim().length >= 2 && value.trim().length <= 24 && /^[\p{L}\p{N}_ -]+$/u.test(value.trim());
const validEmail = (value: unknown): value is string => typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
router.post("/register", async (req, res) => {
  const displayName = typeof req.body?.displayName === "string" ? req.body.displayName.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = req.body?.password;
  if (!validName(displayName) || !validEmail(email) || typeof password !== "string" || password.length < 10 || password.length > 128) {
    res.status(400).json({ error: "Provide a valid display name, email, and password (10–128 characters)." }); return;
  }
  try {
    const passwordHash = await hashPassword(password);
    const id = crypto.randomUUID();
    await pool.execute("INSERT INTO accounts (id, email, password_hash, player_id) VALUES (?, ?, ?, ?)", [id, email, passwordHash, id]);
    await pool.execute("INSERT INTO players (id, display_name, character_class, level, xp, gold) VALUES (?, ?, 'Fighter', 1, 0, 0)", [id, displayName]);
    res.status(201).json({ token: signToken(id, displayName), tokenType: "Bearer", expiresIn: 3600, player: { id, displayName, level: 1 } });
  } catch (error) {
    const duplicate = typeof error === "object" && error !== null && "code" in error && (error as {code?:string}).code === "ER_DUP_ENTRY";
    res.status(duplicate ? 409 : 503).json({ error: duplicate ? "An account with that email already exists." : "Account service unavailable." });
  }
});
router.post("/login", async (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = req.body?.password;
  if (!validEmail(email) || typeof password !== "string" || password.length > 128) { res.status(400).json({ error: "Invalid email or password." }); return; }
  try {
    const [rows] = await pool.execute("SELECT a.password_hash, p.id, p.display_name, p.level FROM accounts a JOIN players p ON p.id = a.player_id WHERE a.email = ? LIMIT 1", [email]);
    const row = (rows as {password_hash:string;id:string;display_name:string;level:number}[])[0];
    if (!row || !(await verifyPassword(password, row.password_hash))) { res.status(401).json({ error: "Invalid email or password." }); return; }
    res.json({ token: signToken(row.id, row.display_name), tokenType: "Bearer", expiresIn: 3600, player: { id: row.id, displayName: row.display_name, level: row.level } });
  } catch { res.status(503).json({ error: "Account service unavailable." }); }
});
router.get("/me", requireAuth, async (req, res) => {
  try {
    const claims = authClaims(req);
    const [rows] = await pool.execute("SELECT id, display_name, character_class, level, xp, gold FROM players WHERE id = ? LIMIT 1", [claims.sub]);
    const player = (rows as Record<string, unknown>[])[0];
    if (!player) { res.status(404).json({ error: "Player not found." }); return; }
    res.json({ player });
  } catch { res.status(503).json({ error: "Profile service unavailable." }); }
});
export default router;
