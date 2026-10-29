import { decodeSave, encodeSave } from "./SaveCodec";
import type { SessionSave } from "../GameSession";

/** Minimal storage contract; adapters can wrap localStorage, IndexedDB, or a test double. */
export interface SaveStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export interface SaveRepositoryOptions {
  storage: SaveStorage;
  namespace?: string;
  maxSerializedBytes?: number;
}
export class SaveRepository {
  private readonly prefix: string;
  private readonly maxSerializedBytes: number;
  constructor(private readonly options: SaveRepositoryOptions) {
    this.prefix = options.namespace?.trim() || "earthbound-realms";
    this.maxSerializedBytes = options.maxSerializedBytes ?? 1_000_000;
    if (!Number.isSafeInteger(this.maxSerializedBytes) || this.maxSerializedBytes < 1) {
      throw new Error("Maximum save size must be a positive safe integer");
    }
  }
  private key(slot: string): string {
    if (!/^[a-zA-Z0-9_-]{1,40}$/.test(slot)) throw new Error("Save slot must be 1-40 safe characters");
    return `${this.prefix}:save:${slot}`;
  }
  save(slot: string, value: SessionSave): void {
    const storageKey = this.key(slot);
    const serialized = encodeSave(value);
    if (new TextEncoder().encode(serialized).byteLength > this.maxSerializedBytes) {
      throw new Error("Save exceeds the configured size limit");
    }
    this.options.storage.setItem(storageKey, serialized);
  }
  load(slot: string): SessionSave | undefined {
    const serialized = this.options.storage.getItem(this.key(slot));
    if (serialized === null) return undefined;
    if (new TextEncoder().encode(serialized).byteLength > this.maxSerializedBytes) {
      throw new Error("Stored save exceeds the configured size limit");
    }
    return decodeSave(serialized);
  }
  has(slot: string): boolean { return this.options.storage.getItem(this.key(slot)) !== null; }
  delete(slot: string): void { this.options.storage.removeItem(this.key(slot)); }
}
