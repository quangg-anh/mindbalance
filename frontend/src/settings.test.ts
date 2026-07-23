import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  loadSettings,
  saveSettings,
  FONT_SCALE_VALUES,
  DIALOGUE_DELAY_VALUES,
  fontScaleValue,
  dialogueDelayMs,
  effectiveReducedMotion,
  type Settings,
} from './settings';

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

function matchMediaMock(reduced: boolean) {
  const mql: MediaQueryList = {
    matches: reduced,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  };
  return vi.fn(() => mql);
}

beforeEach(() => {
  globalThis.localStorage = localStorageMock() as unknown as Storage;
  globalThis.matchMedia = matchMediaMock(false) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('settings load/save round-trip', () => {
  it('persist and reload settings preserves fields', () => {
    const next: Settings = {
      fontScale: 'large',
      dialogueSpeed: 'fast',
      reducedMotionOverride: false,
      skipRead: true,
    };
    saveSettings(next);
    expect(loadSettings()).toEqual(next);
  });

  it('returns defaults when nothing stored', () => {
    const loaded = loadSettings();
    expect(loaded.fontScale).toBe('normal');
    expect(loaded.dialogueSpeed).toBe('normal');
    expect(loaded.reducedMotionOverride).toBeNull();
    expect(loaded.skipRead).toBe(false);
  });
});

describe('settings fontScaleValue mapping', () => {
  it('maps small < normal < large via FONT_SCALE_VALUES', () => {
    const small = fontScaleValue('small');
    const normal = fontScaleValue('normal');
    const large = fontScaleValue('large');
    expect(small).toBeLessThan(normal);
    expect(large).toBeGreaterThan(normal);
    expect(normal).toBe(1);
    expect(FONT_SCALE_VALUES).toEqual({
      small: expect.any(Number),
      normal: expect.any(Number),
      large: expect.any(Number),
    });
  });
});

describe('settings dialogueDelayMs mapping', () => {
  it('maps slow > normal > fast via DIALOGUE_DELAY_VALUES', () => {
    const slow = dialogueDelayMs('slow');
    const normal = dialogueDelayMs('normal');
    const fast = dialogueDelayMs('fast');
    expect(slow).toBeGreaterThan(normal);
    expect(fast).toBeLessThan(normal);
    expect(DIALOGUE_DELAY_VALUES).toEqual({
      slow: expect.any(Number),
      normal: expect.any(Number),
      fast: expect.any(Number),
    });
  });
});

describe('settings effectiveReducedMotion override', () => {
  it('null override follows OS matchMedia', () => {
    globalThis.matchMedia = matchMediaMock(true) as unknown as typeof window.matchMedia;
    const result = effectiveReducedMotion({ ...loadSettings(), reducedMotionOverride: null });
    expect(result).toBe(true);
  });

  it('override true forces true regardless of OS', () => {
    globalThis.matchMedia = matchMediaMock(false) as unknown as typeof window.matchMedia;
    const result = effectiveReducedMotion({ ...loadSettings(), reducedMotionOverride: true });
    expect(result).toBe(true);
  });

  it('override false forces false regardless of OS', () => {
    globalThis.matchMedia = matchMediaMock(true) as unknown as typeof window.matchMedia;
    const result = effectiveReducedMotion({ ...loadSettings(), reducedMotionOverride: false });
    expect(result).toBe(false);
  });
});