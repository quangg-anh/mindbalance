import { describe, expect, it } from 'vitest';
import { createApp, MemoryStore } from './app.js';

const app = createApp(new MemoryStore(), ['https://game.test']);
const call = (path: string, init: RequestInit = {}) => app(new Request(`https://api.test${path}`, { ...init, headers: { authorization: 'Bearer 1234567890123456', origin: 'https://game.test', ...init.headers } }));

describe('Backend API', () => {
  it('health', async () => expect((await call('/v1/health')).status).toBe(200));
  it('ETag, idempotency, conflict', async () => {
    const body = JSON.stringify({ slot: 0, revision: 0, data: { month: 1 } });
    const first = await call('/v1/saves/0', { method: 'PUT', headers: { 'idempotency-key': 'a' }, body });
    expect(first.headers.get('etag')).toBe('"1"');
    const repeat = await call('/v1/saves/0', { method: 'PUT', headers: { 'idempotency-key': 'a' }, body });
    expect((await repeat.json() as { revision: number }).revision).toBe(1);
    const conflict = await call('/v1/saves/0', { method: 'PUT', headers: { 'idempotency-key': 'b' }, body });
    expect(conflict.status).toBe(412);
  });
  it('denies unknown origin', async () => expect((await app(new Request('https://api.test/v1/health', { headers: { origin: 'https://evil.test' } }))).status).toBe(403));
});