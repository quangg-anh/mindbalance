/* ============================================
   Visual Novel — Cuộc Sống Sinh Viên
   Game Configuration & Stats
   ============================================ */

const GAME_CONFIG = {
  levels: {
    low:     { min: 0,  max: 25,  label: 'Thấp',      color: '#ef4444' },
    medium:  { min: 26, max: 50,  label: 'Trung bình', color: '#f59e0b' },
    high:    { min: 51, max: 75,  label: 'Cao',        color: '#3b82f6' },
    extreme: { min: 76, max: 100, label: 'Cực cao',    color: '#10b981' },
  },
  initialStats: {
    knowledge: 40,
    skill: 30,
    health: 70,
    spirit: 60,
    money: 50,
    morality: 60,
    relationship: 40,
    debt: 0,
  },
  statInfo: {
    knowledge:    { name: 'Kiến thức',    icon: '📚' },
    skill:        { name: 'Kỹ năng',      icon: '🛠️' },
    health:       { name: 'Sức khỏe',     icon: '❤️' },
    spirit:       { name: 'Tinh thần',    icon: '😊' },
    money:        { name: 'Tiền',         icon: '💰' },
    debt:         { name: 'Nợ nần',       icon: '💸' },
    morality:     { name: 'Đạo đức',     icon: '⚖️' },
    relationship: { name: 'Mối quan hệ', icon: '🤝' },
  },
};
