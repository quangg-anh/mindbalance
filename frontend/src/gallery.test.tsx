import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { content } from '@game/game-content';

// Agent 02 contract (tro_chuyen.md): gallery.tsx exports these symbols.
import {
  markEndingSeen,
  seenEndings,
  EndingGallery,
} from './gallery';

const SEEN_KEY = 'bon-nam-endings-seen';

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

async function mount(node: React.ReactElement): Promise<{ container: HTMLElement; unmount: () => void }> {
  const container = document.createElement('div');
  container.id = 'gallery-root';
  document.body.appendChild(container);
  const root = createRoot(container);
  flushSync(() => {
    root.render(node);
  });
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  return {
    container,
    unmount: () => {
      root.unmount();
      container.remove();
    },
  };
}

beforeEach(() => {
  globalThis.localStorage = localStorageMock() as unknown as Storage;
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('gallery markEndingSeen + seenEndings round-trip', () => {
  it('marks an ending seen and reads it back', () => {
    markEndingSeen('four_years_well_spent');
    expect(seenEndings().has('four_years_well_spent')).toBe(true);
  });

  it('dedupes marks of same ending id', () => {
    markEndingSeen('return_home');
    markEndingSeen('return_home');
    expect(seenEndings().size).toBe(1);
  });

  it('persists across reload (reads localStorage)', () => {
    markEndingSeen('lucky_player');
    const raw = localStorage.getItem(SEEN_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toContain('lucky_player');
  });
});

describe('gallery renders 14 endings', () => {
  it('renders one cell per ending id from content.endings', async () => {
    expect(content.endings).toHaveLength(14);
    const { container, unmount } = await mount(<EndingGallery onClose={() => {}} />);
    const items = container.querySelectorAll<HTMLElement>('.gallery-cell');
    expect(items).toHaveLength(14);
    for (const ending of content.endings) {
      const cell = container.querySelector<HTMLElement>(`.gallery-cell.${ending.group}`)
        ?? null;
      expect(cell, `missing group ${ending.group}`).not.toBeNull();
    }
    unmount();
  });

  it('marks seen endings with is-seen, unseen locked with is-locked', async () => {
    markEndingSeen('four_years_well_spent');
    const { container, unmount } = await mount(<EndingGallery onClose={() => {}} />);
    const seenEl = container.querySelector<HTMLElement>('.gallery-cell.is-seen');
    const lockedEl = container.querySelector<HTMLElement>('.gallery-cell.is-locked');
    expect(seenEl).not.toBeNull();
    expect(lockedEl).not.toBeNull();
    const lockedArticle = lockedEl?.querySelector<HTMLElement>('article');
    expect(lockedArticle?.getAttribute('aria-label') ?? '').toContain('chưa mở khóa');
    unmount();
  });
});