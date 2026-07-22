import { createHash, randomUUID } from 'node:crypto';
import { SaveRequestSchema } from '@game/shared';

export interface Store {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, ttlSeconds?: number): Promise<void>;
}

export class MemoryStore implements Store {
  private readonly values = new Map<string, { value: string; expiresAt?: number }>();

  async get(key: string): Promise<string | null> {
    const entry = this.values.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.values.delete(key);
      return null;
    }
    return entry.value;
  }

  async put(key: string, value: string, ttlSeconds?: number): Promise<void> {
    this.values.set(key, { value, expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined });
  }
}

const json = (data: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'private, no-store', ...headers } });

export function createApp(store: Store, allowedOrigins: string[]) {
  return async (req: Request): Promise<Response> => {
    const requestId = randomUUID();
    const origin = req.headers.get('origin');
    const originAllowed = !origin || allowedOrigins.includes(origin);
    const cors: Record<string, string> = origin && originAllowed
      ? { 'access-control-allow-origin': origin, vary: 'Origin', 'access-control-allow-headers': 'authorization, content-type, idempotency-key, if-match', 'access-control-allow-methods': 'GET, PUT, OPTIONS' }
      : {};
    if (!originAllowed) return json({ error: 'origin_not_allowed', requestId }, 403);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(req.url);
    if (url.pathname === '/v1/health' && req.method === 'GET') return json({ ok: true, requestId }, 200, { 'cache-control': 'public, max-age=30', ...cors });
    const token = req.headers.get('authorization')?.replace(/^Bearer /, '');
    if (!token || token.length < 16) return json({ error: 'unauthorized', requestId }, 401, cors);
    const match = url.pathname.match(/^\/v1\/saves\/(\d)$/);
    if (!match) return json({ error: 'not_found', requestId }, 404, cors);
    const slot = Number(match[1]);
    if (slot > 3) return json({ error: 'invalid_slot', requestId }, 400, cors);
    const key = `${createHash('sha256').update(token).digest('hex')}:${slot}`;

    if (req.method === 'GET') {
      const value = await store.get(key);
      if (!value) return json({ error: 'not_found', requestId }, 404, cors);
      const parsed = JSON.parse(value) as { revision: number };
      return json(parsed, 200, { etag: `"${parsed.revision}"`, ...cors });
    }
    if (req.method === 'PUT') {
      if (Number(req.headers.get('content-length') ?? 0) > 262144) return json({ error: 'payload_too_large', requestId }, 413, cors);
      const idempotencyKey = req.headers.get('idempotency-key');
      if (!idempotencyKey) return json({ error: 'idempotency_key_required', requestId }, 400, cors);
      const prior = await store.get(`idem:${key}:${idempotencyKey}`);
      if (prior) return json(JSON.parse(prior), 200, cors);
      let body: unknown;
      try { body = await req.json(); } catch { return json({ error: 'invalid_json', requestId }, 400, cors); }
      const parsed = SaveRequestSchema.safeParse(body);
      if (!parsed.success || parsed.data.slot !== slot) return json({ error: 'invalid_body', requestId }, 400, cors);
      const currentValue = await store.get(key);
      const current = currentValue ? JSON.parse(currentValue) as { revision: number } : null;
      if (current && req.headers.get('if-match') !== `"${current.revision}"`) return json({ error: 'conflict', requestId }, 412, { etag: `"${current.revision}"`, ...cors });
      const result = { ...parsed.data, revision: (current?.revision ?? 0) + 1, updatedAt: new Date().toISOString() };
      const serialized = JSON.stringify(result);
      await store.put(key, serialized);
      await store.put(`idem:${key}:${idempotencyKey}`, serialized, 86400);
      return json(result, 200, { etag: `"${result.revision}"`, ...cors });
    }
    return json({ error: 'method_not_allowed', requestId }, 405, cors);
  };
}