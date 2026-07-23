import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type { Store } from './app.js';

interface Entry { value: string; expiresAt?: number }
type StoreFile = Record<string, Entry>;

/** Atomic JSON persistence. Suitable for one Node process; use PostgreSQL for multi-instance production. */
export class FileStore implements Store {
  private operation: Promise<unknown> = Promise.resolve();

  constructor(private readonly filePath: string) {}

  private async readAll(): Promise<StoreFile> {
    try {
      return JSON.parse(await readFile(this.filePath, 'utf8')) as StoreFile;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {};
      throw error;
    }
  }

  private async writeAll(values: StoreFile): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    const temporary = `${this.filePath}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(temporary, JSON.stringify(values), { encoding: 'utf8', mode: 0o600 });
    await rename(temporary, this.filePath);
  }

  private run<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.operation.then(operation, operation);
    this.operation = result.then(() => undefined, () => undefined);
    return result;
  }

  get(key: string): Promise<string | null> {
    return this.run(async () => {
      const values = await this.readAll();
      const entry = values[key];
      if (!entry) return null;
      if (entry.expiresAt !== undefined && entry.expiresAt <= Date.now()) {
        const remaining = Object.fromEntries(Object.entries(values).filter(([entryKey]) => entryKey !== key));
        await this.writeAll(remaining);
        return null;
      }
      return entry.value;
    });
  }

  put(key: string, value: string, ttlSeconds?: number): Promise<void> {
    return this.run(async () => {
      const values = await this.readAll();
      values[key] = { value, expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined };
      await this.writeAll(values);
    });
  }

  delete(key: string): Promise<void> {
    return this.run(async () => {
      const values = await this.readAll();
      const remaining = Object.fromEntries(Object.entries(values).filter(([entryKey]) => entryKey !== key));
      await this.writeAll(remaining);
    });
  }
}

export function defaultStorePath(): string {
  return resolve(process.env.SAVE_STORE_FILE ?? './data/saves.json');
}