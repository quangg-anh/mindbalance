import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { effectiveReducedMotion, type Settings } from './settings';

const base: Settings = { fontScale: 'normal', dialogueSpeed: 'normal', reducedMotionOverride: null, skipRead: false };

describe('reduced motion', () => {
  it('explicit override takes priority', () => {
    expect(effectiveReducedMotion({ ...base, reducedMotionOverride: true })).toBe(true);
    expect(effectiveReducedMotion({ ...base, reducedMotionOverride: false })).toBe(false);
  });

  it('CSS disables animation and transition for app override', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.reduced-motion \*[\s\S]*animation: none !important/);
    expect(css).toMatch(/\.reduced-motion \*[\s\S]*transition: none !important/);
  });
});
