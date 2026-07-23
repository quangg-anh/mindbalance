import { describe, expect, it } from 'vitest';
import { portraits } from './assets';

describe('portrait asset mapping', () => {
  it('maps family and Ông Tư to distinct local artwork', () => {
    expect(portraits['ong-tu']).not.toBe(portraits.phong);
    expect(portraits.father).not.toBe(portraits.minh);
    expect(portraits.mother).not.toBe(portraits.mai);
    expect(new Set(Object.values(portraits)).size).toBe(Object.keys(portraits).length);
    for (const portrait of Object.values(portraits)) expect(portrait).toMatch(/^\/src\/assets\/char-|^data:|\.svg$/);
  });
});
