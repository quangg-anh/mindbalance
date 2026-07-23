import { describe, expect, it } from 'vitest';
import { content, surprises } from '@game/game-content';
import { eventDialogues, eventScenes, portraits, surpriseDialogues, surpriseSceneById } from './assets';

describe('portrait asset mapping', () => {
  it('maps family and Ông Tư to distinct local artwork', () => {
    expect(portraits['ong-tu']).not.toBe(portraits.phong);
    expect(portraits.father).not.toBe(portraits.minh);
    expect(portraits.mother).not.toBe(portraits.mai);
    expect(new Set(Object.values(portraits)).size).toBe(Object.keys(portraits).length);
    for (const portrait of Object.values(portraits)) expect(portrait).toMatch(/^\/src\/assets\/char-|^data:|\.svg$/);
  });
});

describe('continuity dialogue coverage', () => {
  it('covers all 19 runtime events with speakers allowed by scene cast', () => {
    expect(Object.keys(eventDialogues).sort()).toEqual(content.events.map((event) => event.id).sort());
    for (const event of content.events) {
      const cast = eventScenes[event.id]!.cast;
      expect(eventDialogues[event.id]!.every((beat) => beat.speaker === 'narrator' || cast.includes(beat.speaker))).toBe(true);
    }
  });

  it('covers all surprise dialogue keys and speakers with scene cast', () => {
    expect(Object.keys(surpriseDialogues).sort()).toEqual(surprises.map((surprise) => surprise.id).sort());
    const cast: Record<string, string[]> = {
      'pop-quiz': ['lan', 'minh'], 'lost-group-file': ['lan', 'minh'], 'job-scam': ['phong', 'minh'],
      'food-poisoning': ['huy', 'minh'], 'exercise-injury': ['huy', 'minh'], 'lan-rumor': ['lan', 'minh'],
      'forgotten-birthday': ['minh'], 'found-wallet': ['minh'], 'wage-theft': ['phong', 'minh'],
      'small-lottery-win': ['ong-tu', 'minh'], 'account-hijack': ['huy', 'minh'], 'elevator-stuck': ['huy', 'minh'],
      'lottery-jackpot': ['ong-tu', 'minh'],
    };
    for (const surprise of surprises) {
      expect(surpriseSceneById[surprise.id]).toBeDefined();
      expect(surpriseDialogues[surprise.id]!.every((beat) => beat.speaker === 'narrator' || cast[surprise.id]!.includes(beat.speaker))).toBe(true);
    }
  });
});
