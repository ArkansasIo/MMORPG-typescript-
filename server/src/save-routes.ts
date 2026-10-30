/** @file-id ER-FILE-SAVE-ROUTES-0001
 * @module-id ER-MOD-PERSISTENCE-0001
 * @doc ../../docs/source/save-routes.ts.docs.md
 * Authenticated, size-limited player save persistence.
 */
import { Router } from "express";
import { pool } from "./db/pool.js";
import { authClaims, requireAuth } from "./auth.js";
const router = Router();
router.use(requireAuth);
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT save_version, save_data, updated_at FROM player_saves WHERE player_id = ? LIMIT 1", [authClaims(req).sub]);
    const row = (rows as {save_version:number;save_data:unknown;updated_at:Date}[])[0];
    if (!row) { res.status(404).json({ error: "No cloud save exists." }); return; }
    res.json({ version: row.save_version, save: row.save_data, updatedAt: row.updated_at });
  } catch { res.status(503).json({ error: "Save storage unavailable." }); }
});
router.put("/", async (req, res) => {
  const version = req.body?.version;
  const save = req.body?.save;
  if (!Number.isInteger(version) || version !== 1 || !save || typeof save !== "object" || Array.isArray(save)) { res.status(400).json({ error: "Expected save object with version 1." }); return; }
  const serialized = JSON.stringify(save);
  if (Buffer.byteLength(serialized, "utf8") > 65536) { res.status(413).json({ error: "Save exceeds the 64 KiB limit." }); return; }
  try {
    await pool.execute("INSERT INTO player_saves (player_id, save_version, save_data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE save_version = VALUES(save_version), save_data = VALUES(save_data)", [authClaims(req).sub, version, serialized]);
    res.json({ saved: true, bytes: Buffer.byteLength(serialized, "utf8") });
  } catch { res.status(503).json({ error: "Save storage unavailable." }); }
});
export default router;
