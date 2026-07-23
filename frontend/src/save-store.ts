/**
 * Save store: localStorage envelope (version hóa) + cloud sync queue.
 * Dùng game-core/save.ts `migrateSave`/`importLegacy` có sẵn.
 * Cloud sync network-first /v1/saves/:slot PUT/GET (backend contract có sẵn).
 * Queue offline localStorage, flush online. Conflict 412 → onConflict theo revision+ETag.
 * Token anonymous `bon-nam-token` header Bearer. Backend không động.
 * Fail-safe: lỗi mạng chỉ enqueue, không throw, không crash UI.
 */
import { migrateSave, importLegacy, type SaveEnvelope } from '@game/game-core';
import { SAVE_SCHEMA_VERSION, SAVE_SLOTS } from '@game/shared';
import type { GameState } from '@game/game-core';

const SLOT_PREFIX = 'bon-nam-save-';
const TOKEN_KEY = 'bon-nam-token';
const QUEUE_KEY = 'bon-nam-sync-queue';
const SYNC_BASE = (import.meta.env.VITE_API_BASE_URL || '/v1/saves').replace(/\/$/, '');

export type { SaveEnvelope };

export interface CloudPayload {
  slot: number;
  revision: number;
  data: unknown;
  updatedAt?: string;
}

export interface SlotSummary {
  slot: number;
  savedAt: string;
  revision: number;
  month: number;
}

export interface ConflictInfo {
  slot: number;
  local: SaveEnvelope;
  cloud: CloudPayload;
  etag: string;
}

export type SyncResult =
  | { status: 'success'; payload: CloudPayload }
  | { status: 'queued' }
  | { status: 'conflict'; conflict: ConflictInfo }
  | { status: 'empty' };

export type PullResult =
  | { status: 'success'; payload: CloudPayload; etag: string }
  | { status: 'not-found' }
  | { status: 'error'; message: string };

export interface FlushResult {
  ok: number;
  remaining: number;
}

type ConflictHandler = (info: ConflictInfo) => void;

interface QueueEntry {
  slot: number;
  idempotencyKey: string;
  revision: number;
  state: GameState;
  queuedAt: string;
}

/* ----------------------------- raw storage ----------------------------- */

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* quota / private mode */
  }
}

function removeRaw(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* noop */
  }
}

function slotKey(slot: number): string {
  return `${SLOT_PREFIX}${slot}`;
}

/* ----------------------------- token ----------------------------- */

function generateToken(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Token anonymous. Persist `bon-nam-token` (header Bearer khi sync). */
export function getToken(): string {
  let token = readRaw(TOKEN_KEY);
  if (!token) {
    token = generateToken();
    writeRaw(TOKEN_KEY, token);
  }
  return token;
}

/** Mã khôi phục nhạy cảm: người giữ mã có thể đọc/ghi cloud save. */
export function exportSyncCode(): string { return getToken(); }

export function importSyncCode(value: string): boolean {
  const token = value.trim();
  if (token.length < 16 || token.length > 512 || /\s/.test(token)) return false;
  writeRaw(TOKEN_KEY, token);
  return true;
}

/* ----------------------------- envelope ----------------------------- */

function looksLikeEnvelope(raw: unknown): raw is SaveEnvelope {
  return (
    typeof raw === 'object' &&
    raw !== null &&
    'version' in raw &&
    'revision' in raw &&
    'savedAt' in raw &&
    'state' in raw
  );
}

function looksLikeLegacyState(raw: unknown): raw is GameState {
  return (
    typeof raw === 'object' &&
    raw !== null &&
    'month' in raw &&
    'stats' in raw &&
    'schemaVersion' in raw
  );
}

/** Wrapper quanh migrateSave của game-core (cho test/import trực tiếp). */
export function migrateEnvelope(raw: unknown): SaveEnvelope {
  return migrateSave(raw);
}

/** Đọc save slot. Migrate envelope/legacy state/vn_slot_* về schema hiện tại. */
export function loadSave(slot: number): SaveEnvelope | null {
  const raw = readRaw(slotKey(slot));
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (looksLikeEnvelope(parsed)) return migrateSave(parsed);
      if (looksLikeLegacyState(parsed)) {
        return migrateSave({
          version: SAVE_SCHEMA_VERSION,
          revision: 0,
          savedAt: new Date(0).toISOString(),
          state: parsed,
        });
      }
    } catch {
      /* fall through */
    }
  }
  const legacyKey = `vn_slot_${slot}`;
  const legacy = importLegacy((k) => readRaw(k)).find((entry) => entry.key === legacyKey);
  return legacy?.save ?? null;
}

/** Ghi save slot. Revision truyền vào hoặc auto-bump. */
export function setSave(slot: number, state: GameState, revision?: number): SaveEnvelope {
  const nextRevision =
    typeof revision === 'number'
      ? revision
      : ((loadSave(slot)?.revision ?? -1) + 1);
  const envelope: SaveEnvelope = {
    version: SAVE_SCHEMA_VERSION,
    revision: Math.max(0, nextRevision),
    savedAt: new Date().toISOString(),
    state,
  };
  writeRaw(slotKey(slot), JSON.stringify(envelope));
  return envelope;
}

/** Xóa slot. */
export function deleteSlot(slot: number): void {
  removeRaw(slotKey(slot));
}

/** Liệt kê slot đã có save (kèm tóm tắt). */
export function listSlots(): SlotSummary[] {
  const out: SlotSummary[] = [];
  for (let slot = 0; slot < SAVE_SLOTS; slot += 1) {
    const env = loadSave(slot);
    if (!env) continue;
    out.push({ slot, savedAt: env.savedAt, revision: env.revision, month: env.state.month });
  }
  return out;
}

/* --------------------------- sync queue --------------------------- */

let conflictHandler: ConflictHandler | null = null;

/** Đăng ký handler conflict (412). Trả hủy订阅. */
export function onConflict(handler: ConflictHandler): () => void {
  conflictHandler = handler;
  return () => {
    if (conflictHandler === handler) conflictHandler = null;
  };
}

function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

function readQueue(): QueueEntry[] {
  const raw = readRaw(QUEUE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as QueueEntry[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(entries: QueueEntry[]): void {
  writeRaw(QUEUE_KEY, JSON.stringify(entries));
}

function enqueue(entry: QueueEntry): void {
  writeQueue([...readQueue().filter((queued) => queued.slot !== entry.slot), entry]);
}

function makeEntry(slot: number): QueueEntry {
  const env = loadSave(slot);
  return {
    slot,
    idempotencyKey: generateToken(),
    revision: env?.revision ?? 0,
    state: env?.state ?? ({} as GameState),
    queuedAt: new Date().toISOString(),
  };
}

/** Giải quyết xung đột theo revision: trả true nếu cloud mới hơn local. */
export function resolveConflictNewest(local: SaveEnvelope, cloud: CloudPayload): boolean {
  return cloud.revision > local.revision;
}

const slotPushes = new Map<number, Promise<SyncResult>>();

/** Serialize PUT cùng slot; offline/lỗi enqueue. */
export function syncPush(slot: number): Promise<SyncResult> {
  const prior = slotPushes.get(slot) ?? Promise.resolve<SyncResult>({ status: 'empty' });
  const next = prior.catch(() => ({ status: 'queued' } as SyncResult)).then(() => performPush(slot));
  slotPushes.set(slot, next);
  void next.finally(() => { if (slotPushes.get(slot) === next) slotPushes.delete(slot); });
  return next;
}

async function performPush(slot: number): Promise<SyncResult> {
  const env = loadSave(slot);
  if (!env) return { status: 'empty' };
  const entry = makeEntry(slot);

  if (!isOnline()) {
    enqueue(entry);
    return { status: 'queued' };
  }

  try {
    const result = await attemptPush(slot, env.state, env.revision, entry.idempotencyKey);
    if (result.status === 'conflict') enqueue(entry);
    return result;
  } catch {
    enqueue(entry);
    return { status: 'queued' };
  }
}

/**
 * PUT một entry lên cloud. 412 → fire conflictHandler (nếu có). Lỗi khác → throw.
 */
async function attemptPush(
  slot: number,
  state: GameState,
  revision: number,
  idempotencyKey: string,
): Promise<Extract<SyncResult, { status: 'success' | 'conflict' }>> {
  const token = getToken();
  const res = await fetch(`${SYNC_BASE}/${slot}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
      'idempotency-key': idempotencyKey,
      'if-match': `"${revision}"`,
    },
    body: JSON.stringify({ slot, revision, data: state }),
  });

  if (res.status === 412) {
    let cloud: CloudPayload;
    try {
      cloud = (await res.json()) as CloudPayload;
    } catch {
      cloud = { slot, revision, data: null };
    }
    const local = loadSave(slot) ?? { version: SAVE_SCHEMA_VERSION, revision, savedAt: new Date().toISOString(), state };
    const conflict = { slot, local, cloud, etag: res.headers?.get?.('etag') ?? `"${cloud.revision}"` };
    conflictHandler?.(conflict);
    return { status: 'conflict', conflict };
  }

  if (!res.ok) throw new Error(`sync status ${res.status}`);

  // Success: cập nhật revision local từ body cloud.
  let body: { revision?: number } | null = null;
  try {
    body = (await res.json()) as { revision?: number };
  } catch {
    body = null;
  }
  if (body && typeof body.revision === 'number') {
    setSave(slot, state, body.revision);
  }
  return { status: 'success', payload: { slot, revision: body?.revision ?? revision, data: state } };
}

export async function syncPull(slot: number): Promise<PullResult> {
  try {
    const res = await fetch(`${SYNC_BASE}/${slot}`, { headers: { authorization: `Bearer ${getToken()}` } });
    if (res.status === 404) return { status: 'not-found' };
    if (!res.ok) return { status: 'error', message: `sync status ${res.status}` };
    const payload = (await res.json()) as CloudPayload;
    return { status: 'success', payload, etag: res.headers.get('etag') ?? `"${payload.revision}"` };
  } catch (error) {
    return { status: 'error', message: error instanceof Error ? error.message : 'network_error' };
  }
}

export function acceptCloud(slot: number, cloud: CloudPayload): SaveEnvelope {
  return setSave(slot, cloud.data as GameState, cloud.revision);
}

export async function forcePushLocal(info: ConflictInfo): Promise<SyncResult> {
  const local = loadSave(info.slot) ?? info.local;
  setSave(info.slot, local.state, info.cloud.revision);
  return syncPush(info.slot);
}

/** Flush queue khi online. Thất bại giữ lại. Trả {ok, remaining}. */
export async function flushQueue(): Promise<FlushResult> {
  if (!isOnline()) return { ok: 0, remaining: readQueue().length };
  let q = readQueue();
  let ok = 0;
  while (q.length > 0) {
    const entry = q[0]!;
    const local = loadSave(entry.slot);
    try {
      const result = await attemptPush(
        entry.slot,
        local?.state ?? entry.state,
        local?.revision ?? entry.revision,
        entry.idempotencyKey,
      );
      if (result.status === 'conflict') break;
      ok += 1;
      q = q.slice(1);
      writeQueue(q);
    } catch {
      break;
    }
  }
  return { ok, remaining: q.length };
}

let bound = false;
/** Bind window.online → flushQueue (idempotent). Trả cleanup. */
export function bindOnlineFlush(): () => void {
  if (bound) return () => undefined;
  bound = true;
  const handler = () => {
    void flushQueue();
  };
  window.addEventListener('online', handler);
  return () => {
    window.removeEventListener('online', handler);
    bound = false;
  };
}