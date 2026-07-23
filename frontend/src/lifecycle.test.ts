import { beforeEach, describe, expect, it } from 'vitest';
import { beatKey, firstUnreadBeat, markBeatRead, parseTimeline } from './lifecycle';

beforeEach(() => {
  const data = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => { data.delete(key); },
    clear: () => data.clear(),
    key: (index) => [...data.keys()][index] ?? null,
    get length() { return data.size; },
  } as Storage;
});

describe('skip-read lifecycle', () => {
  it('keeps stable keys and skips only read intro beats', () => {
    expect(beatKey('surprise', 'pop-quiz', 1)).toBe('surprise:pop-quiz:1');
    markBeatRead('surprise', 'pop-quiz', 0);
    markBeatRead('surprise', 'pop-quiz', 1);
    expect(firstUnreadBeat('surprise', 'pop-quiz', 3, true)).toBe(2);
    expect(firstUnreadBeat('surprise', 'pop-quiz', 3, false)).toBe(0);
  });

  it('stops on final beat when all beats are read so choice is never automatic', () => {
    for (let index = 0; index < 3; index += 1) markBeatRead('event', 'first-test', index);
    expect(firstUnreadBeat('event', 'first-test', 3, true)).toBe(2);
  });
});

describe('journey timeline', () => {
  it('parses existing history without changing save schema', () => {
    const timeline = parseTimeline(['m1:activity:study', 'm4:event:first-test:honest', 'm7:surprise:pop-quiz:do-honest', 'bad']);
    expect(timeline.map((item) => item.kind)).toEqual(['activity', 'event', 'choice', 'surprise', 'choice']);
    expect(timeline.map((item) => item.season)).toEqual([1, 2, 2, 3, 3]);
  });

  it('renders delayed source and prose with legacy fallback metadata', () => {
    const timeline = parseTimeline(['m9:delayed:traffic-accident%3Aleave:C%C3%BA%20%C4%91au%20t%C3%A1i%20l%E1%BA%A1i.', 'm12:delayed:legacy:H%E1%BB%87%20qu%E1%BA%A3%20c%C5%A9%20%C4%91%C3%A3%20t%E1%BB%9Bi.']);
    expect(timeline.map((item) => item.label)).toEqual(['Cú đau tái lại. (Nguyên nhân: traffic-accident:leave)', 'Hệ quả cũ đã tới. (Nguyên nhân: legacy)']);
  });
});