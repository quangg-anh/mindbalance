import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function pngSize(name: string): { width: number; height: number } {
  const bytes = readFileSync(resolve(process.cwd(), 'public/icons', name));
  expect(bytes.subarray(1, 4).toString('ascii')).toBe('PNG');
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe('PWA icon files', () => {
  it.each([
    ['icon-192.png', 192],
    ['icon-512.png', 512],
    ['maskable-192.png', 192],
    ['maskable-512.png', 512],
  ] as const)('%s is real PNG with declared pixels', (name, size) => {
    expect(pngSize(name)).toEqual({ width: size, height: size });
  });

  it('manifest config declares PNG dimensions and maskable purpose', () => {
    const config = readFileSync(resolve(process.cwd(), 'vite.config.ts'), 'utf8');
    expect(config).toContain("src: '/icons/icon-192.png'");
    expect(config).toContain("sizes: '192x192'");
    expect(config).toContain("src: '/icons/maskable-512.png'");
    expect(config).toContain("sizes: '512x512'");
    expect(config).toContain("purpose: 'maskable'");
  });
});
