import type { Condition, Effects } from './schema.js';

/** Data-only MVP cho Agent 1 nối schema/runtime. Không phụ thuộc engine. */
export interface SurpriseChoice {
  id: string;
  label: string;
  effectSummary: string;
  effects: Effects;
  delayed: Array<{ afterMonths: number; effects: Effects; source?: string; prose?: string }>;
}

export interface SurpriseSituation {
  id: string;
  title: string;
  /** Năm học 1–4 được phép xuất hiện */
  years: number[];
  /** Activity id kích hoạt sau khi chọn; rỗng = có thể sau Next/tháng */
  afterActivities: string[];
  weight: number;
  prerequisite: Condition[];
  choices: SurpriseChoice[];
  /** Gợi ý nhóm nội dung cho scheduler */
  category: 'study' | 'finance' | 'health' | 'relationship' | 'family' | 'morality' | 'work' | 'luck';
}

const none: SurpriseChoice['delayed'] = [];

/**
 * Tối thiểu 12 tình huống MVP — ưu tiên theo phân việc vòng 4.
 * Lựa chọn có đánh đổi thật; không gắn nhãn tốt/xấu; không chi tiết tự hại.
 */
export const surprises: SurpriseSituation[] = [
  {
    id: 'pop-quiz',
    title: 'Giảng viên kiểm tra đột xuất',
    years: [1, 2, 3],
    afterActivities: ['study', 'gaming'],
    weight: 22,
    prerequisite: [],
    category: 'study',
    choices: [
      {
        id: 'do-honest',
        label: 'Làm bằng những gì đang nhớ',
        effectSummary: 'Kết quả dựa trên kiến thức hiện có',
        effects: { stats: { knowledge: 1, spirit: 1 }, traits: { disciplined: 1 } },
        delayed: [{ afterMonths: 1, effects: { flags: { recentQuizHonest: true } } }],
      },
      {
        id: 'glance-neighbor',
        label: 'Liếc bài người bên cạnh',
        effectSummary: 'Có thể được điểm, nhưng rủi ro bị phát hiện',
        effects: { stats: { knowledge: 2, morality: -4 }, traits: { avoidant: 1 }, flags: { academicLie: true } },
        delayed: [{ afterMonths: 2, effects: { relationships: { lan: -6 }, stats: { spirit: -3 } } }],
      },
      {
        id: 'blank-paper',
        label: 'Nộp giấy gần như trắng',
        effectSummary: 'Không gian lận; tinh thần có thể lung lay',
        effects: { stats: { spirit: -3, morality: 1 } },
        delayed: [{ afterMonths: 1, effects: { relationships: { lan: 2 }, flags: { invitedStudyGroup: true } } }],
      },
      {
        id: 'health-excuse',
        label: 'Xin hoãn vì lý do sức khỏe',
        effectSummary: 'Chỉ thuyết phục nếu sức khỏe đang thấp',
        effects: { stats: { spirit: -1 }, flags: { academicLie: true } },
        delayed: none,
      },
    ],
  },
  {
    id: 'lost-group-file',
    title: 'Bài tập nhóm mất dữ liệu',
    years: [2, 3],
    afterActivities: ['study', 'skill_training'],
    weight: 16,
    prerequisite: [{ field: 'relationships.lan', op: 'gte', value: 20 }],
    category: 'study',
    choices: [
      {
        id: 'all-nighter',
        label: 'Thức trắng làm lại cùng Lan',
        effectSummary: 'Cứu bài nộp, hao sức và tinh thần',
        effects: { stats: { health: -8, spirit: -6, skill: 4 }, relationships: { lan: 8 } },
        delayed: [{ afterMonths: 1, effects: { stats: { health: -3 }, flags: { riskExhaustion: true } } }],
      },
      {
        id: 'ask-extension',
        label: 'Thành thật xin gia hạn',
        effectSummary: 'Có thể bị trừ điểm; giữ đạo đức',
        effects: { stats: { morality: 3, knowledge: -1 }, relationships: { lan: -2 } },
        delayed: none,
      },
      {
        id: 'blame-lan',
        label: 'Đổ lỗi giữ file cho Lan',
        effectSummary: 'Tránh trách nhiệm ngắn hạn, tổn thương tin tưởng',
        effects: { stats: { morality: -6, spirit: 1 }, relationships: { lan: -12 }, flags: { romanceLocked: true } },
        delayed: none,
      },
      {
        id: 'hire-rush',
        label: 'Thuê người làm gấp',
        effectSummary: 'Tốn tiền; rủi ro đạo văn về sau',
        effects: { stats: { money: -18, morality: -5, skill: -1 }, flags: { academicLie: true } },
        delayed: [{ afterMonths: 3, effects: { flags: { plagiarismRisk: true }, stats: { spirit: -4 } } }],
      },
    ],
  },
  {
    id: 'job-scam',
    title: 'Lời mời việc nhẹ lương cao',
    years: [1, 2, 3],
    afterActivities: ['part_time', 'borrow'],
    weight: 18,
    prerequisite: [{ field: 'stats.money', op: 'lte', value: 40 }],
    category: 'finance',
    choices: [
      {
        id: 'ignore',
        label: 'Bỏ qua tin nhắn',
        effectSummary: 'Không mất gì; Phong có thể gật đầu',
        effects: { relationships: { phong: 2 }, traits: { reliable: 1 } },
        delayed: none,
      },
      {
        id: 'research',
        label: 'Tìm hiểu trước khi trả lời',
        effectSummary: 'Tốn thời gian; có thể nhận ra lừa đảo',
        effects: { stats: { skill: 3, knowledge: 1, morality: 1 } },
        delayed: none,
      },
      {
        id: 'pay-fee',
        label: 'Đóng phí hồ sơ để “nhận việc”',
        effectSummary: 'Mất tiền ngay; thông tin cá nhân có thể lộ',
        effects: { stats: { money: -15, spirit: -4 }, flags: { personalDataExposed: true, accountCompromisedRisk: true } },
        delayed: [{ afterMonths: 2, effects: { flags: { accountCompromisedRisk: true }, stats: { spirit: -3 } } }],
      },
      {
        id: 'invite-huy',
        label: 'Rủ Huy cùng tham gia',
        effectSummary: 'Chia rủi ro — hoặc chia mất mát',
        effects: { stats: { money: -10, morality: -3 }, relationships: { huy: -5 } },
        delayed: [{ afterMonths: 1, effects: { relationships: { huy: -4 }, stats: { spirit: -2 } } }],
      },
    ],
  },
  {
    id: 'food-poisoning',
    title: 'Ngộ độc giữa đêm',
    years: [1, 2, 3, 4],
    afterActivities: ['rest', 'part_time', 'study'],
    weight: 14,
    prerequisite: [{ field: 'stats.health', op: 'lte', value: 55 }],
    category: 'health',
    choices: [
      {
        id: 'hospital',
        label: 'Đi phòng khám / bệnh viện',
        effectSummary: 'Tốn tiền; phục hồi chắc hơn',
        effects: { stats: { money: -12, health: 10, spirit: 2 }, relationships: { huy: 2 } },
        delayed: none,
      },
      {
        id: 'self-medicate',
        label: 'Tự mua thuốc rồi nằm',
        effectSummary: 'Rẻ; kết quả không chắc',
        effects: { stats: { money: -3, health: 3, spirit: -1 } },
        delayed: [{ afterMonths: 1, effects: { stats: { health: -4 } } }],
      },
      {
        id: 'push-through',
        label: 'Cố chịu để không bỏ lịch ngày mai',
        effectSummary: 'Giữ tiến độ học/việc; bào sức',
        effects: { stats: { health: -10, spirit: -2, knowledge: 1 }, traits: { workaholic: 1 } },
        delayed: [{ afterMonths: 1, effects: { flags: { riskExhaustion: true } } }],
      },
      {
        id: 'call-mother',
        label: 'Gọi về kể với mẹ',
        effectSummary: 'An ủi và có thể được hỗ trợ; cảm giác mắc nợ',
        effects: { stats: { spirit: 4, money: 6 }, relationships: { family: 5 }, traits: { familyOriented: 1 } },
        delayed: none,
      },
    ],
  },
  {
    id: 'exercise-injury',
    title: 'Chấn thương khi tập',
    years: [1, 2, 3, 4],
    afterActivities: ['exercise'],
    weight: 15,
    prerequisite: [],
    category: 'health',
    choices: [
      {
        id: 'see-doctor',
        label: 'Đi khám và nghỉ đúng chỉ định',
        effectSummary: 'Tốn tiền; bảo vệ lâu dài',
        effects: { stats: { money: -8, health: 6, spirit: -1 } },
        delayed: none,
      },
      {
        id: 'rest-days',
        label: 'Nghỉ vài ngày tự theo dõi',
        effectSummary: 'Ít tốn kém; phục hồi chậm',
        effects: { stats: { health: 2, spirit: 1 } },
        delayed: [{ afterMonths: 1, effects: { stats: { health: 2 } } }],
      },
      {
        id: 'keep-training',
        label: 'Cố tập tiếp vì sợ mất nhịp',
        effectSummary: 'Giữ kỷ luật ngắn hạn; rủi ro nặng hơn',
        effects: { stats: { health: -7, spirit: 1 }, traits: { disciplined: 1 } },
        delayed: [{ afterMonths: 2, effects: { stats: { health: -5 }, flags: { chronicPainHint: true } } }],
      },
      {
        id: 'ask-huy',
        label: 'Nhờ Huy dìu về ký túc',
        effectSummary: 'An toàn hơn; mở hội thoại bạn cùng phòng',
        effects: { stats: { health: 1, spirit: 3 }, relationships: { huy: 5 } },
        delayed: none,
      },
    ],
  },
  {
    id: 'lan-rumor',
    title: 'Tin đồn về Minh và Lan',
    years: [2, 3],
    afterActivities: ['socialize', 'study'],
    weight: 12,
    prerequisite: [{ field: 'relationships.lan', op: 'gte', value: 35 }],
    category: 'relationship',
    choices: [
      {
        id: 'deny-public',
        label: 'Công khai phủ nhận',
        effectSummary: 'Dập tin đồn; cảm xúc của Lan tùy ngữ cảnh',
        effects: { stats: { spirit: -1 }, relationships: { lan: -2, huy: 1 } },
        delayed: none,
      },
      {
        id: 'ignore-rumor',
        label: 'Không quan tâm tin đồn',
        effectSummary: 'Giữ bình thản; có thể thiếu tinh tế với Lan',
        effects: { stats: { spirit: 2 }, relationships: { lan: -4 } },
        delayed: [{ afterMonths: 1, effects: { relationships: { lan: -2 } } }],
      },
      {
        id: 'joke-true',
        label: 'Đùa rằng chuyện ấy là thật',
        effectSummary: 'Hài hước với Huy; Lan có thể khó chịu',
        effects: { relationships: { huy: 3, lan: -5 }, stats: { spirit: 2 } },
        delayed: none,
      },
      {
        id: 'ask-lan',
        label: 'Hỏi Lan cảm thấy thế nào',
        effectSummary: 'Cần tin tưởng; có thể mở hoặc làm xa khoảng cách',
        effects: { stats: { morality: 1, spirit: -1 }, relationships: { lan: 4 }, flags: { romanceProbe: true } },
        delayed: none,
      },
    ],
  },
  {
    id: 'forgotten-birthday',
    title: 'Sinh nhật bị bỏ quên',
    years: [1, 2, 3, 4],
    afterActivities: ['socialize', 'gaming', 'rest', 'family'],
    weight: 10,
    prerequisite: [],
    category: 'relationship',
    choices: [
      {
        id: 'pretend-fine',
        label: 'Nói mình không cần ai nhớ',
        effectSummary: 'Giữ mặt; tinh thần vẫn có thể trũng',
        effects: { stats: { spirit: -2 }, traits: { avoidant: 1 } },
        delayed: none,
      },
      {
        id: 'admit-sad',
        label: 'Thừa nhận mình hơi buồn',
        effectSummary: 'Chân thật; mở cửa cho bạn bè/gia đình',
        effects: { stats: { spirit: 2, morality: 1 }, relationships: { huy: 2, lan: 2 } },
        delayed: [{ afterMonths: 1, effects: { relationships: { mai: 3 } } }],
      },
      {
        id: 'treat-self',
        label: 'Tự mua một món nhỏ cho mình',
        effectSummary: 'An ủi tức thì; tốn tiền',
        effects: { stats: { money: -5, spirit: 3 } },
        delayed: none,
      },
      {
        id: 'call-home',
        label: 'Gọi về nhà',
        effectSummary: 'Mai hoặc mẹ có thể vẫn nhớ',
        effects: { stats: { spirit: 5 }, relationships: { family: 4, mai: 5 } },
        delayed: none,
      },
    ],
  },
  {
    id: 'found-wallet',
    title: 'Nhặt được ví tiền',
    years: [1, 2, 3, 4],
    afterActivities: ['socialize', 'part_time', 'exercise', 'family'],
    weight: 11,
    prerequisite: [],
    category: 'morality',
    choices: [
      {
        id: 'return-full',
        label: 'Trả lại đầy đủ cho chủ',
        effectSummary: 'Tăng đạo đức; có thể được cảm ơn',
        effects: { stats: { morality: 6, spirit: 3 }, flags: { helpedStranger: true } },
        delayed: [{ afterMonths: 2, effects: { stats: { money: 4 } }, source: 'found-wallet:return-full', prose: 'Chủ chiếc ví tìm được Minh qua thông tin bảo vệ ghi lại và gửi lời cảm ơn.' }],
      },
      {
        id: 'take-cash-return',
        label: 'Lấy tiền mặt rồi trả ví',
        effectSummary: 'Có tiền nhanh; lương tâm và rủi ro camera',
        effects: { stats: { money: 12, morality: -7, spirit: -2 } },
        delayed: [{ afterMonths: 2, effects: { flags: { cameraRisk: true }, stats: { spirit: -3 } } }],
      },
      {
        id: 'keep-all',
        label: 'Giữ toàn bộ',
        effectSummary: 'Giải quyết thiếu hụt ngắn hạn; hệ quả dài',
        effects: { stats: { money: 20, morality: -10, spirit: -1 } },
        delayed: [{ afterMonths: 3, effects: { flags: { legalAttention: true }, stats: { spirit: -5 } } }],
      },
      {
        id: 'give-guard',
        label: 'Gửi bảo vệ / quầy thông tin',
        effectSummary: 'An toàn hơn tự giữ; không kiểm soát được sau đó',
        effects: { stats: { morality: 2, spirit: 1 } },
        delayed: [{ afterMonths: 1, effects: { flags: { walletFollowUp: true } } }],
      },
    ],
  },
  {
    id: 'wage-theft',
    title: 'Lương bị giữ lại',
    years: [2, 3, 4],
    afterActivities: ['part_time'],
    weight: 13,
    prerequisite: [{ field: 'flags.accountCompromisedRisk', op: 'eq', value: true }],
    category: 'work',
    choices: [
      {
        id: 'wait-next',
        label: 'Đợi sang tháng như lời chủ quán',
        effectSummary: 'Giữ việc; tiền treo',
        effects: { stats: { spirit: -3 }, flags: { unpaidWage: true } },
        delayed: [{ afterMonths: 1, effects: { stats: { money: 8, spirit: -2 } } }],
      },
      {
        id: 'quit',
        label: 'Nghỉ việc và tìm chỗ khác',
        effectSummary: 'Cắt lỗ thời gian; mất thu nhập ổn định',
        effects: { stats: { spirit: 1, money: -2 }, traits: { reliable: 1 } },
        delayed: none,
      },
      {
        id: 'demand-pay',
        label: 'Yêu cầu trả ngay',
        effectSummary: 'Có thể nhận tiền; quan hệ chỗ làm căng',
        effects: { stats: { money: 10, spirit: -1, skill: 1 } },
        delayed: [{ afterMonths: 1, effects: { flags: { workplaceTension: true } } }],
      },
      {
        id: 'organize',
        label: 'Rủ đồng nghiệp cùng đòi',
        effectSummary: 'Cần quan hệ/kỹ năng; rủi ro mất việc nhóm',
        effects: { stats: { morality: 2, skill: 2, spirit: 2 }, relationships: { phong: 3 } },
        delayed: [{ afterMonths: 2, effects: { stats: { money: 12 }, flags: { workplaceTension: true } } }],
      },
    ],
  },
  {
    id: 'small-lottery-win',
    title: 'Trúng giải nhỏ đúng lúc eo hẹp',
    years: [1, 2, 3, 4],
    afterActivities: ['lottery'],
    weight: 9,
    prerequisite: [
      { field: 'flags.boughtLottery', op: 'eq', value: true },
      { field: 'stats.money', op: 'lte', value: 35 },
    ],
    category: 'luck',
    choices: [
      {
        id: 'pay-debt',
        label: 'Dùng tiền trả nợ / tiền trọ',
        effectSummary: 'Thở được thêm một tháng',
        effects: { stats: { money: 15, debt: -10, spirit: 4 }, flags: { lotteryProfit: true } },
        delayed: none,
      },
      {
        id: 'buy-more',
        label: 'Mua thêm vài tờ vé',
        effectSummary: 'Giữ cảm giác may mắn; nuôi thói quen',
        effects: { stats: { money: 5, spirit: 2 }, traits: { gambler: 3 }, flags: { gamblingTendency: true } },
        delayed: [{ afterMonths: 1, effects: { stats: { money: -6, spirit: -2 } } }],
      },
      {
        id: 'send-home',
        label: 'Gửi một phần về nhà',
        effectSummary: 'Gia đình nhẹ gánh; túi mình còn mỏng',
        effects: { stats: { money: 6, spirit: 3 }, relationships: { family: 6 }, flags: { lotteryProfit: true } },
        delayed: none,
      },
      {
        id: 'treat-friends',
        label: 'Mời bạn bè ăn một bữa',
        effectSummary: 'Ấm quan hệ; tiêu nhanh',
        effects: { stats: { money: 2, spirit: 5 }, relationships: { huy: 4, lan: 2 }, flags: { lotteryProfit: true } },
        delayed: none,
      },
    ],
  },
  {
    id: 'lottery-jackpot',
    title: 'Tấm vé trúng giải lớn',
    years: [2, 3, 4],
    afterActivities: ['lottery'],
    weight: 1,
    prerequisite: [{ field: 'flags.boughtLottery', op: 'eq', value: true }],
    category: 'luck',
    choices: [
      { id: 'make-plan', label: 'Khóa tiền vào quỹ và lập kế hoạch', effectSummary: 'Ổn định khoản trúng; tiền không tự quyết định tương lai', effects: { stats: { money: 70, spirit: 5 }, flags: { jackpotStable: true, lotteryProfit: true } }, delayed: none },
      { id: 'share-family', label: 'Trả nợ và chia sẻ với gia đình', effectSummary: 'Giảm nghĩa vụ, giữ phần dự phòng', effects: { stats: { money: 45, debt: -80, spirit: 7 }, relationships: { family: 12 }, flags: { jackpotStable: true, lotteryProfit: true } }, delayed: none },
      { id: 'spend-fast', label: 'Tiêu ngay khi còn hưng phấn', effectSummary: 'Niềm vui lớn nhưng khoản tiền hao nhanh', effects: { stats: { money: 25, spirit: 10 }, traits: { gambler: 12 }, flags: { lotteryProfit: true } }, delayed: [{ afterMonths: 3, effects: { stats: { money: -20, spirit: -6 } }, source: 'lottery-jackpot:spend-fast', prose: 'Những khoản chi sau ngày trúng giải bắt đầu tới hạn.' }] },
    ],
  },
  {
    id: 'account-hijack',
    title: 'Tài khoản mạng bị chiếm',
    years: [2, 3, 4],
    afterActivities: ['socialize', 'part_time', 'gaming'],
    weight: 11,
    prerequisite: [],
    category: 'finance',
    choices: [
      {
        id: 'change-password',
        label: 'Đổi mật khẩu và cảnh báo bạn bè ngay',
        effectSummary: 'Chặn thiệt hại sớm',
        effects: { stats: { skill: 2, spirit: -2 }, relationships: { huy: 2 } },
        delayed: none,
      },
      {
        id: 'ask-help',
        label: 'Nhờ Huy hoặc Phong hỗ trợ kỹ thuật',
        effectSummary: 'Nhanh hơn một mình; lộ chuyện với bạn',
        effects: { stats: { spirit: 1, skill: 1 }, relationships: { huy: 3, phong: 3 } },
        delayed: none,
      },
      {
        id: 'pretend-ok',
        label: 'Giả vờ không biết, im chờ tự hết',
        effectSummary: 'Tránh sóng gió ngắn; rủi ro bạn bị lừa tiền',
        effects: { stats: { morality: -3, spirit: 1 }, traits: { avoidant: 2 } },
        delayed: [{ afterMonths: 1, effects: { relationships: { huy: -6, lan: -3 }, stats: { spirit: -4 } } }],
      },
      {
        id: 'hunt-hacker',
        label: 'Tự truy tìm người tấn công',
        effectSummary: 'Tốn sức; kết quả không chắc',
        effects: { stats: { skill: 3, spirit: -4, knowledge: 1 } },
        delayed: [{ afterMonths: 2, effects: { flags: { legalAttention: true } } }],
      },
    ],
  },
  {
    id: 'elevator-stuck',
    title: 'Kẹt thang máy cùng nhóm bạn',
    years: [1, 2, 3],
    afterActivities: ['socialize', 'study', 'part_time'],
    weight: 10,
    prerequisite: [],
    category: 'relationship',
    choices: [
      {
        id: 'calm-group',
        label: 'Trấn an mọi người và gọi cứu hộ',
        effectSummary: 'Giữ bình tĩnh tập thể',
        effects: { stats: { spirit: 2, morality: 1 }, relationships: { lan: 3, huy: 2, phong: 2 } },
        delayed: none,
      },
      {
        id: 'joke-huy',
        label: 'Pha trò cùng Huy cho đỡ căng',
        effectSummary: 'Không khí nhẹ; Lan có thể thấy thiếu nghiêm túc',
        effects: { stats: { spirit: 4 }, relationships: { huy: 5, lan: -1 } },
        delayed: none,
      },
      {
        id: 'talk-lan',
        label: 'Nhân lúc chờ nói chuyện riêng với Lan',
        effectSummary: 'Gần hơn với Lan; bỏ ngoài tai phần còn lại',
        effects: { relationships: { lan: 5, huy: -1 }, stats: { spirit: 2 }, flags: { romanceProbe: true } },
        delayed: none,
      },
      {
        id: 'panic-quiet',
        label: 'Im lặng vì sợ không gian kín',
        effectSummary: 'Hao tinh thần; bạn bè có thể để ý',
        effects: { stats: { spirit: -5, health: -1 }, relationships: { huy: 1 } },
        delayed: none,
      },
    ],
  },
];

export const surprisesById: Record<string, SurpriseSituation> = Object.fromEntries(
  surprises.map((item) => [item.id, item]),
);
