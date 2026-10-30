/** @file-id ER-FILE-AUTH-0001
 * @module-id ER-MOD-AUTH-0001
 * @doc ../../docs/source/auth.ts.docs.md
 * Password hashing and short-lived signed bearer tokens for account endpoints.
 */
import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { Request, RequestHandler } from "express";
const scrypt = promisify(scryptCallback);
const TOKEN_TTL_SECONDS = 60 * 60;
const key = () => {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must contain at least 32 characters");
  return value;
};
const b64 = (value: string | Buffer) => Buffer.from(value).toString("base64url");
export interface AuthClaims { sub: string; name: string; iat: number; exp: number }
export async function hashPassword(password: string): Promise<string> {
  if (password.length < 10 || password.length > 128) throw new Error("Password must be 10–128 characters");
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64) as Buffer;
  return `scrypt:${salt.toString("base64url")}:${derived.toString("base64url")}`;
}
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, saltText, hashText] = stored.split(":");
  if (algorithm !== "scrypt" || !saltText || !hashText) return false;
  try {
    const expected = Buffer.from(hashText, "base64url");
    const actual = await scrypt(password, Buffer.from(saltText, "base64url"), expected.length) as Buffer;
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch { return false; }
}
export function signToken(playerId: string, displayName: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header = b64(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = b64(JSON.stringify({ sub: playerId, name: displayName, iat: now, exp: now + TOKEN_TTL_SECONDS }));
  const body = `${header}.${payload}`;
  return `${body}.${createHmac("sha256", key()).update(body).digest("base64url")}`;
}
export function verifyToken(token: string): AuthClaims {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid token");
  const body = `${parts[0]}.${parts[1]}`;
  const expected = createHmac("sha256", key()).update(body).digest();
  const actual = Buffer.from(parts[2], "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new Error("Invalid token signature");
  const header = JSON.parse(Buffer.from(parts[0], "base64url").toString()) as { alg?: string };
  const claims = JSON.parse(Buffer.from(parts[1], "base64url").toString()) as AuthClaims;
  if (header.alg !== "HS256" || !claims.sub || !claims.name || !Number.isFinite(claims.exp) || claims.exp <= Date.now() / 1000) throw new Error("Expired or invalid token");
  return claims;
}
export function bearerToken(request: Request): string | undefined {
  const value = request.headers.authorization;
  return value?.startsWith("Bearer ") ? value.slice(7) : undefined;
}
export const requireAuth: RequestHandler = (request, response, next) => {
  try {
    const token = bearerToken(request);
    if (!token) { response.status(401).json({ error: "Authentication required" }); return; }
    (request as Request & { auth?: AuthClaims }).auth = verifyToken(token);
    next();
  } catch { response.status(401).json({ error: "Invalid or expired access token" }); }
};
export function authClaims(request: Request): AuthClaims {
  const claims = (request as Request & { auth?: AuthClaims }).auth;
  if (!claims) throw new Error("Authenticated request context missing");
  return claims;
}
