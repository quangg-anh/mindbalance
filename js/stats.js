/* ============================================
   Visual Novel — Cuộc Sống Sinh Viên
   Stats Manager
   ============================================ */

class StatsManager {
  constructor() {
    this.stats = { ...GAME_CONFIG.initialStats };
    this.flags = {
      hasMyopia: false,
      failedExams: 0,
      passedExams: 0,
      lotterySpent: 0,
      lotteryWon: 0,
      wonJackpot: false,
      familyPositive: 0,
      familyTotal: 0,
      skipChosen: false,
    };
  }

  get(key) { return this.stats[key] ?? 0; }

  set(key, val) {
    this.stats[key] = Math.max(0, Math.min(100, val));
  }

  apply(effects) {
    const changes = {};
    for (const [k, delta] of Object.entries(effects)) {
      if (k in this.stats) {
        const old = this.stats[k];
        this.set(k, old + delta);
        changes[k] = { old, now: this.stats[k], delta };
      }
    }
    return changes;
  }

  getLevel(key) {
    const v = this.get(key);
    if (v <= 25) return 'low';
    if (v <= 50) return 'medium';
    if (v <= 75) return 'high';
    return 'extreme';
  }

  getLevelInfo(key) { return GAME_CONFIG.levels[this.getLevel(key)]; }

  isAtLeast(key, lvl) {
    const order = ['low','medium','high','extreme'];
    return order.indexOf(this.getLevel(key)) >= order.indexOf(lvl);
  }

  isZero(key) { return this.get(key) <= 0; }

  getAllDisplay() {
    return Object.entries(GAME_CONFIG.statInfo).map(([key, info]) => ({
      key, ...info,
      value: this.get(key),
      level: this.getLevel(key),
      levelInfo: this.getLevelInfo(key),
    }));
  }

  serialize() { return { stats: {...this.stats}, flags: {...this.flags} }; }
  deserialize(d) { this.stats = {...d.stats}; this.flags = {...d.flags}; }
}
