/** @file-id ER-FILE-REALTIME-0001
 * @module-id ER-MOD-REALTIME-0001
 * @doc ../../docs/source/realtime.ts.docs.md
 * Small authenticated room relay. This is a prototype transport, not authoritative combat.
 */
import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "node:http";
import { verifyToken } from "./auth.js";
type Player = { id: string; name: string; x: number; y: number; socket: WebSocket; room: string; lastAction: number };
type ClientMessage = { type: "join"; roomId?: string } | { type: "move"; dx?: number; dy?: number } | { type: "ping" };
const rooms = new Map<string, Map<string, Player>>();
const MAX_ROOM_SIZE = 8;
const send = (socket: WebSocket, payload: unknown) => { if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(payload)); };
function publish(roomId: string, payload: unknown) {
  for (const player of rooms.get(roomId)?.values() ?? []) send(player.socket, payload);
}
export function attachRealtime(server: Server): WebSocketServer {
  const wss = new WebSocketServer({ server, path: "/realtime", maxPayload: 4096, handleProtocols(protocols) {
    return protocols.has("earthbound-v1") ? "earthbound-v1" : false;
  }});
  wss.on("connection", (socket, request) => {
    const protocols = request.headers["sec-websocket-protocol"]?.split(",").map(v => v.trim()) ?? [];
    const credential = protocols.find(v => v.startsWith("bearer."));
    let claims;
    try { if (!credential) throw new Error("Missing bearer credential"); claims = verifyToken(credential.slice(7)); }
    catch { socket.close(1008, "Authentication required"); return; }
    let player: Player | undefined;
    socket.on("message", raw => {
      let message: ClientMessage;
      try { message = JSON.parse(raw.toString()) as ClientMessage; } catch { send(socket, { type: "error", message: "Malformed JSON" }); return; }
      if (!message || typeof message.type !== "string") { send(socket, { type: "error", message: "Invalid message" }); return; }
      if (message.type === "ping") { send(socket, { type: "pong", at: Date.now() }); return; }
      if (message.type === "join") {
        if (player) { send(socket, { type: "error", message: "Already joined a room" }); return; }
        const roomId = typeof message.roomId === "string" && /^[a-zA-Z0-9_-]{1,32}$/.test(message.roomId) ? message.roomId : "frontier";
        const room = rooms.get(roomId) ?? new Map<string, Player>();
        if (room.size >= MAX_ROOM_SIZE) { send(socket, { type: "error", message: "Room is full" }); return; }
        if ([...room.values()].some(p => p.id === claims.sub)) { send(socket, { type: "error", message: "Player already connected to this room" }); return; }
        player = { id: claims.sub, name: claims.name, x: 0, y: 0, socket, room: roomId, lastAction: 0 };
        room.set(player.id, player); rooms.set(roomId, room);
        send(socket, { type: "joined", roomId, players: [...room.values()].map(({id,name,x,y}) => ({id,name,x,y})) });
        publish(roomId, { type: "player-joined", player: { id: player.id, name: player.name, x: player.x, y: player.y } });
        return;
      }
      if (message.type === "move") {
        if (!player) { send(socket, { type: "error", message: "Join a room first" }); return; }
        const now = Date.now();
        if (now - player.lastAction < 100) return;
        const dx = Number(message.dx), dy = Number(message.dy);
        if (!Number.isInteger(dx) || !Number.isInteger(dy) || Math.abs(dx) + Math.abs(dy) !== 1) { send(socket, { type: "error", message: "Movement must be one orthogonal tile" }); return; }
        player.lastAction = now; player.x = Math.max(-1000, Math.min(1000, player.x + dx)); player.y = Math.max(-1000, Math.min(1000, player.y + dy));
        publish(player.room, { type: "player-moved", player: { id: player.id, x: player.x, y: player.y } });
      }
    });
    socket.on("close", () => {
      if (!player) return;
      const room = rooms.get(player.room);
      room?.delete(player.id);
      publish(player.room, { type: "player-left", playerId: player.id });
      if (room?.size === 0) rooms.delete(player.room);
    });
  });
  return wss;
}
