/** @file-id ER-FILE-API-CLIENT-0001
 * @module-id ER-MOD-NETWORK-0001
 * @doc ../../../docs/source/ApiClient.ts.docs.md
 * Typed browser-side client for account and cloud-save HTTP endpoints.
 */
export interface PlayerProfile { id: string; displayName: string; characterClass?: string; level: number; xp?: number; gold?: number }
export interface AuthResponse { token: string; tokenType: "Bearer"; expiresIn: number; player: PlayerProfile }
export interface CloudSave<T> { version: 1; save: T }
export class ApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message); this.name = "ApiError"; }
}
export class ApiClient {
  constructor(private readonly baseUrl = "", private token?: string) {}
  setToken(token?: string): void { this.token = token; }
  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    if (init.body) headers.set("Content-Type", "application/json");
    if (this.token) headers.set("Authorization", `Bearer ${this.token}`);
    const response = await fetch(new URL(path, this.baseUrl || window.location.origin), { ...init, headers });
    const payload = await response.json().catch(() => ({})) as { error?: string };
    if (!response.ok) throw new ApiError(response.status, payload.error ?? `Request failed (${response.status})`);
    return payload as T;
  }
  register(input: { displayName: string; email: string; password: string }): Promise<AuthResponse> {
    return this.request("/api/auth/register", { method: "POST", body: JSON.stringify(input) });
  }
  login(input: { email: string; password: string }): Promise<AuthResponse> {
    return this.request("/api/auth/login", { method: "POST", body: JSON.stringify(input) });
  }
  me(): Promise<{ player: PlayerProfile }> { return this.request("/api/auth/me"); }
  getSave<T>(): Promise<{ version: 1; save: T; updatedAt: string }> { return this.request("/api/saves"); }
  putSave<T>(save: T): Promise<{ saved: true; bytes: number }> {
    return this.request("/api/saves", { method: "PUT", body: JSON.stringify({ version: 1, save }) });
  }
}
