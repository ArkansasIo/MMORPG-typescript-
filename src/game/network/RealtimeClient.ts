/** @file-id ER-FILE-REALTIME-CLIENT-0001
 * @module-id ER-MOD-NETWORK-0001
 * @doc ../../../docs/source/RealtimeClient.ts.docs.md
 * Typed browser WebSocket client for the prototype room relay.
 */
export type RemotePlayer = { id: string; name: string; x: number; y: number };
export type RealtimeEvent =
  | { type: "joined"; roomId: string; players: RemotePlayer[] }
  | { type: "player-joined"; player: RemotePlayer }
  | { type: "player-moved"; player: Pick<RemotePlayer, "id" | "x" | "y"> }
  | { type: "player-left"; playerId: string }
  | { type: "pong"; at: number }
  | { type: "error"; message: string };
export class RealtimeClient {
  private socket?: WebSocket;
  constructor(private readonly endpoint: string) {}
  connect(token: string, onEvent: (event: RealtimeEvent) => void): Promise<void> {
    if (this.socket && this.socket.readyState <= WebSocket.OPEN) throw new Error("Realtime connection already exists");
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(this.endpoint, ["earthbound-v1", `bearer.${token}`]);
      this.socket = socket;
      socket.addEventListener("open", () => resolve(), { once: true });
      socket.addEventListener("error", () => reject(new Error("Realtime connection failed")), { once: true });
      socket.addEventListener("message", message => {
        try { onEvent(JSON.parse(String(message.data)) as RealtimeEvent); } catch { onEvent({ type: "error", message: "Received invalid server message" }); }
      });
    });
  }
  join(roomId = "frontier"): void { this.send({ type: "join", roomId }); }
  move(dx: -1 | 0 | 1, dy: -1 | 0 | 1): void {
    if (Math.abs(dx) + Math.abs(dy) !== 1) throw new Error("Movement must be one orthogonal tile");
    this.send({ type: "move", dx, dy });
  }
  ping(): void { this.send({ type: "ping" }); }
  close(): void { this.socket?.close(1000, "Client closed"); this.socket = undefined; }
  private send(message: unknown): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) throw new Error("Realtime socket is not connected");
    this.socket.send(JSON.stringify(message));
  }
}
