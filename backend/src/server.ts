import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { createApp, MemoryStore } from './app.js';

const port = Number(process.env.PORT ?? 8787);
const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:4173').split(',').map(value => value.trim()).filter(Boolean);
const app = createApp(new MemoryStore(), origins);

createServer(async (incoming, outgoing) => {
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
}).listen(port, () => console.log(`Backend listening on http://localhost:${port}`));