/**
 * Offline-first storage layer.
 *
 * Everything the elderly experience needs (game content, attempts, reminders,
 * accessibility settings) is cached in IndexedDB so games keep working with no
 * connectivity. Writes go into a pending queue and are flushed to the backend
 * when the connection returns.
 */

import { supabase } from "@/integrations/supabase/client";

const DB_NAME = "cognitive-care";
const DB_VERSION = 1;
const STORE_QUEUE = "pending";
const STORE_CACHE = "cache";

export type PendingItem = {
  id: string;
  table: string;
  payload: Record<string, unknown>;
  created_at: string;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_QUEUE))
        db.createObjectStore(STORE_QUEUE, { keyPath: "id" });
      if (!db.objectStoreNames.contains(STORE_CACHE)) db.createObjectStore(STORE_CACHE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(
  store: string,
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest,
): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const request = run(tx.objectStore(store));
    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () => reject(request.error);
  });
}

/* ---------------------------------- cache --------------------------------- */

export async function cacheSet(key: string, value: unknown) {
  try {
    await withStore(STORE_CACHE, "readwrite", (s) => s.put(value, key));
  } catch {
    /* ignore */
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const value = await withStore<T | undefined>(STORE_CACHE, "readonly", (s) => s.get(key));
    return value ?? null;
  } catch {
    return null;
  }
}

/* ---------------------------------- queue --------------------------------- */

const listeners = new Set<(count: number) => void>();

export function onPendingChange(listener: (count: number) => void) {
  listeners.add(listener);
  void pendingCount().then(listener);
  return () => listeners.delete(listener);
}

async function notify() {
  const count = await pendingCount();
  listeners.forEach((listener) => listener(count));
}

export async function pendingCount(): Promise<number> {
  try {
    return await withStore<number>(STORE_QUEUE, "readonly", (s) => s.count());
  } catch {
    return 0;
  }
}

export async function pendingItems(): Promise<PendingItem[]> {
  try {
    return (await withStore<PendingItem[]>(STORE_QUEUE, "readonly", (s) => s.getAll())) ?? [];
  } catch {
    return [];
  }
}

async function enqueue(table: string, payload: Record<string, unknown>) {
  const item: PendingItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    table,
    payload,
    created_at: new Date().toISOString(),
  };
  await withStore(STORE_QUEUE, "readwrite", (s) => s.put(item));
  await notify();
}

async function dequeue(id: string) {
  await withStore(STORE_QUEUE, "readwrite", (s) => s.delete(id));
  await notify();
}

/* ------------------------------ network state ----------------------------- */

let simulatedOffline = false;

export function setSimulatedOffline(value: boolean) {
  simulatedOffline = value;
  if (typeof window !== "undefined") {
    window.localStorage.setItem("cc.simulateOffline", value ? "1" : "0");
    window.dispatchEvent(new Event("cc:network"));
  }
  if (!value) void flushQueue();
}

export function isSimulatedOffline() {
  return simulatedOffline;
}

export function hydrateSimulatedOffline() {
  if (typeof window === "undefined") return;
  simulatedOffline = window.localStorage.getItem("cc.simulateOffline") === "1";
}

export function isOnline() {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine && !simulatedOffline;
}

/* -------------------------------- writing -------------------------------- */

/**
 * Insert a row, falling back to the offline queue when there is no connection.
 * Returns true when the row reached the backend immediately.
 */
export async function insertRow(
  table: "game_attempts" | "mood_logs" | "reminders" | "family_challenges",
  payload: Record<string, unknown>,
): Promise<boolean> {
  if (!isOnline()) {
    await enqueue(table, payload);
    return false;
  }
  const { error } = await supabase.from(table).insert(payload as never);
  if (error) {
    await enqueue(table, payload);
    return false;
  }
  return true;
}

export async function flushQueue(): Promise<number> {
  if (!isOnline()) return 0;
  const items = await pendingItems();
  let synced = 0;
  for (const item of items) {
    const { error } = await supabase.from(item.table).insert(item.payload as never);
    if (!error) {
      await dequeue(item.id);
      synced += 1;
    }
  }
  return synced;
}

export function startSyncWatcher() {
  if (typeof window === "undefined") return () => {};
  const handler = () => void flushQueue();
  window.addEventListener("online", handler);
  const interval = window.setInterval(handler, 30000);
  void flushQueue();
  return () => {
    window.removeEventListener("online", handler);
    window.clearInterval(interval);
  };
}
