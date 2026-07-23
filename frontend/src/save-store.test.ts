import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initialState, type GameState } from '@game/game-core';
import { SAVE_SCHEMA_VERSION } from '@game/shared';

import {
  loadSave,
  setSave,
  listSlots,
  deleteSlot,
  getToken,
  migrateEnvelope,
  syncPush,
  flushQueue,
  onConflict,
  resolveConflictNewest,
  syncPull,
  importSyncCode,
  type SaveEnvelope,
} from './save-store';

const TOKEN_KEY = 'bon-nam-token';
const QUEUE_KEY = 'bon-nam-sync-queue';

function localStorageMock() {
  let store: Record<string, string> = {};
  const m = {
    getItem: (key: string) => (key in store ? store[key]! : null),
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      Reflect.deleteProperty(store, key);
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length;
    },
  };
  return m;
}

function makeState(seed = 1): GameState {
  return initialState(seed);
}

beforeEach(() => {
  globalThis.localStorage = localStorageMock() as unknown as Storage;
  globalThis.fetch = vi.fn() as unknown as typeof fetch;
  Object.defineProperty(globalThis.navigator, 'onLine', {
    configurable: true,
    value: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('save-store migrate envelope', () => {
  it('migrate legacy v1 envelope up to current schema version', () => {
    const legacy = { version: 1, revision: 0, savedAt: '1970-01-01T00:00:00.000Z', state: makeState(3) };
    const result = migrateEnvelope(legacy);
    expect(result.version).toBe(SAVE_SCHEMA_VERSION);
    expect(result.state.schemaVersion).toBe(2);
  });

  it('reject envelope newer than current schema', () => {
    const raw = { version: SAVE_SCHEMA_VERSION + 1, revision: 0, savedAt: 'x', state: makeState() };
    expect(() => migrateEnvelope(raw)).toThrow();
  });

  it('loadSave migrates stored envelope on read', () => {
    const legacy = { version: 1, revision: 0, savedAt: 'x', state: makeState(7) };
    localStorage.setItem('bon-nam-save-0', JSON.stringify(legacy));
    const env = loadSave(0);
    expect(env?.version).toBe(SAVE_SCHEMA_VERSION);
  });
});

describe('save-store getToken stable', () => {
  it('returns same token across calls', () => {
    const a = getToken();
    const b = getToken();
    expect(a).toBeTruthy();
    expect(a).toBe(b);
  });

  it('persists token in localStorage', () => {
    const a = getToken();
    expect(localStorage.getItem(TOKEN_KEY)).toBe(a);
  });
});

describe('save-store setSave/loadSave round-trip', () => {
  it('writes and reads back same state', () => {
    const state = makeState(42);
    setSave(0, state, 1);
    const loaded = loadSave(0);
    expect(loaded).not.toBeNull();
    expect(loaded?.state.month).toBe(state.month);
    expect(loaded?.state.seed).toBe(state.seed);
    expect(loaded?.revision).toBe(1);
  });

  it('auto-bumps revision when omitted', () => {
    setSave(0, makeState(), 5);
    setSave(0, makeState());
    expect(loadSave(0)?.revision).toBe(6);
  });

  it('returns null for empty slot', () => {
    expect(loadSave(7)).toBeNull();
  });
});

describe('save-store listSlots/deleteSlot', () => {
  it('supports exactly four independent occupied slots', () => {
    for (let slot = 0; slot < 4; slot += 1) setSave(slot, { ...makeState(slot), month: slot + 1 }, slot);
    expect(listSlots()).toHaveLength(4);
    expect([0, 1, 2, 3].map((slot) => loadSave(slot)?.state.month)).toEqual([1, 2, 3, 4]);
  });

  it('loads matching legacy slot instead of always slot zero', () => {
    localStorage.setItem('vn_slot_0', JSON.stringify({ month: 2 }));
    localStorage.setItem('vn_slot_3', JSON.stringify({ month: 33 }));
    expect(loadSave(3)?.state.month).toBe(33);
    expect(loadSave(2)).toBeNull();
  });

  it('listSlots reports occupied slots with summary', () => {
    setSave(1, makeState(), 0);
    setSave(2, makeState(), 3);
    const slots = listSlots();
    expect(slots.map((s) => s.slot)).toContain(1);
    expect(slots.map((s) => s.slot)).toContain(2);
    const slot2 = slots.find((s) => s.slot === 2);
    expect(slot2?.revision).toBe(3);
  });

  it('deleteSlot removes the slot', () => {
    setSave(0, makeState(), 0);
    deleteSlot(0);
    expect(loadSave(0)).toBeNull();
  });
});

describe('save-store sync queue offline push/flush', () => {
  it('offline syncPush enqueues, flushQueue drains when online', async () => {
    Object.defineProperty(globalThis.navigator, 'onLine', { configurable: true, value: false });
    setSave(0, makeState(), 1);

    const offline = await syncPush(0);
    expect(offline.status).toBe('queued');
    const queueRaw = localStorage.getItem(QUEUE_KEY);
    expect(queueRaw).not.toBeNull();
    expect(JSON.parse(queueRaw!)).toHaveLength(1);

    Object.defineProperty(globalThis.navigator, 'onLine', { configurable: true, value: true });
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ slot: 0, revision: 1, data: makeState() }),
    } as unknown as Response);

    const result = await flushQueue();
    expect(result.ok).toBe(1);
    expect(result.remaining).toBe(0);
    expect(globalThis.fetch).toHaveBeenCalled();
  });
});

describe('save-store conflict callback fire', () => {
  it('onConflict handler fires when cloud returns 412', async () => {
    setSave(0, makeState(), 1);
    const conflictSpy = vi.fn();
    const unsubscribe = onConflict(conflictSpy);

    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 412,
      json: async () => ({ slot: 0, revision: 99, data: { ...makeState(), month: 48 } }),
    } as unknown as Response);

    const result = await syncPush(0);
    expect(result.status).toBe('conflict');
    expect(conflictSpy).toHaveBeenCalledTimes(1);
    const arg = conflictSpy.mock.calls[0]![0] as { slot: number; cloud: { revision: number } };
    expect(arg.slot).toBe(0);
    expect(arg.cloud.revision).toBe(99);
    unsubscribe();
  });
});

describe('save-store resolveConflictNewest', () => {
  it('picks cloud when cloud revision higher', () => {
    const local: SaveEnvelope = { version: 2, revision: 1, savedAt: 'x', state: makeState() };
    const cloud = { slot: 0, revision: 5, data: makeState() };
    expect(resolveConflictNewest(local, cloud)).toBe(true);
  });

  it('picks local when local revision higher', () => {
    const local: SaveEnvelope = { version: 2, revision: 10, savedAt: 'x', state: makeState() };
    const cloud = { slot: 0, revision: 5, data: makeState() };
    expect(resolveConflictNewest(local, cloud)).toBe(false);
  });
});

describe('save-store pull and queue coalescing', () => {
  it('pull returns payload and ETag', async () => {
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: true, status: 200, headers: new Headers({ etag: '"4"' }), json: async () => ({ slot: 2, revision: 4, data: makeState(4) }) } as Response);
    const result = await syncPull(2);
    expect(result.status).toBe('success');
    if (result.status === 'success') expect(result.etag).toBe('"4"');
  });

  it('coalesces queued changes by slot', async () => {
    Object.defineProperty(globalThis.navigator, 'onLine', { configurable: true, value: false });
    setSave(1, makeState(1), 1); await syncPush(1);
    setSave(1, makeState(2), 2); await syncPush(1);
    expect(JSON.parse(localStorage.getItem(QUEUE_KEY)!)).toHaveLength(1);
  });

  it('imports recovery code', () => {
    expect(importSyncCode('shared-recovery-code-1234')).toBe(true);
    expect(getToken()).toBe('shared-recovery-code-1234');
  });
});