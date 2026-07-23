import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { createApp, MemoryStore } from './app.js';
import { defaultStorePath, FileStore } from './file-store.js';

const port = Number(process.env.PORT ?? 8787);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer from 1 to 65535');
const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:4173').split(',').map(value => value.trim()).filter(Boolean);
if (origins.length === 0) throw new Error('CORS_ORIGINS must contain at least one exact origin');
if (origins.some(origin => origin === '*' || new URL(origin).origin !== origin)) throw new Error('CORS_ORIGINS entries must be exact origins without paths or wildcards');
const storeKind = process.env.SAVE_STORE ?? (process.env.NODE_ENV === 'production' ? 'file' : 'memory');
if (storeKind !== 'file' && storeKind !== 'memory') throw new Error('SAVE_STORE must be "file" or "memory"');
if (process.env.NODE_ENV === 'production' && storeKind === 'memory') throw new Error('MemoryStore is disabled in production');
const store = storeKind === 'file' ? new FileStore(defaultStorePath()) : new MemoryStore();
const app = createApp(store, origins);

const server = createServer(async (incoming, outgoing) => {
  try {
    const origin = `http://${incoming.headers.host ?? `localhost:${port}`}`;
    const body = incoming.method === 'GET' || incoming.method === 'HEAD' ? undefined : Readable.toWeb(incoming) as ReadableStream;
    const request = new Request(new URL(incoming.url ?? '/', origin), { method: incoming.method, headers: incoming.headers as HeadersInit, body, duplex: body ? 'half' : undefined } as RequestInit);
    const response = await app(request);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error(error);
    outgoing.writeHead(500, { 'content-type': 'application/json' });
    outgoing.end(JSON.stringify({ error: 'internal_error' }));
  }
});

server.listen(port, () => console.log(`Backend listening on port ${port}`));

const shutdown = (signal: string) => {
  console.log(`${signal} received; stopping new connections`);
  server.close(error => {
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
  });
};

process.once('SIGTERM', () => shutdown('SIGTERM'));
process.once('SIGINT', () => shutdown('SIGINT'));