import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createApp, MemoryStore } from './app.js';
import { FileStore } from './file-store.js';

const app = createApp(new MemoryStore(), ['https://game.test']);
const call = (path: string, init: RequestInit = {}) => app(new Request(`https://api.test${path}`, { ...init, headers: { authorization: 'Bearer 1234567890123456', origin: 'https://game.test', ...init.headers } }));

describe('Backend API', () => {
  it('health', async () => expect((await call('/v1/health')).status).toBe(200));
  it('readiness checks the store', async () => expect((await call('/v1/ready')).status).toBe(200));
  it('readiness fails when the store is unavailable', async () => {
    const unavailable = createApp({
      get: async () => { throw new Error('disk unavailable'); },
      put: async () => undefined,
      delete: async () => undefined,
    }, ['https://game.test']);
    const response = await unavailable(new Request('https://api.test/v1/ready', { headers: { origin: 'https://game.test' } }));
    expect(response.status).toBe(503);
  });
  it('ETag, idempotency, conflict', async () => {
    const body = JSON.stringify({ slot: 0, revision: 0, data: { month: 1 } });
    const first = await call('/v1/saves/0', { method: 'PUT', headers: { 'idempotency-key': 'a' }, body });
    expect(first.headers.get('etag')).toBe('"1"');
    const repeat = await call('/v1/saves/0', { method: 'PUT', headers: { 'idempotency-key': 'a' }, body });
    expect((await repeat.json() as { revision: number }).revision).toBe(1);
    const conflict = await call('/v1/saves/0', { method: 'PUT', headers: { 'idempotency-key': 'b' }, body });
    expect(conflict.status).toBe(412);
    expect(conflict.headers.get('etag')).toBe('"1"');
    expect((await conflict.json() as { revision: number; data: unknown }).revision).toBe(1);
    const get = await call('/v1/saves/0');
    expect(get.status).toBe(200);
    expect(get.headers.get('etag')).toBe('"1"');
  });
  it('rejects actual oversized body without Content-Length', async () => {
    const body = JSON.stringify({ slot: 0, revision: 0, data: 'x'.repeat(262144) });
    const response = await call('/v1/saves/0', { method: 'PUT', headers: { 'idempotency-key': 'large', 'content-length': '0' }, body });
    expect(response.status).toBe(413);
  });
  it('denies unknown origin', async () => expect((await app(new Request('https://api.test/v1/health', { headers: { origin: 'https://evil.test' } }))).status).toBe(403));
});

describe('FileStore', () => {
  it('persists across store restart', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'game-store-'));
    const path = join(directory, 'saves.json');
    try {
      await new FileStore(path).put('save:0', '{"revision":7}');
      expect(await new FileStore(path).get('save:0')).toBe('{"revision":7}');
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});