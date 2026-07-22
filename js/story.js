/* ============================================
   Visual Novel — Cuộc Sống Sinh Viên
   Story Data (Time Management Loop)
   ============================================ */

const STORY_DATA = {
  // ================= BẮT ĐẦU GAME =================
  intro_start: {
    id: 'intro_start',
    background: 'university_gate',
    speaker: null,
    characters: [
      { id: 'player_male', pose: 'vui', pos: 'center' }
    ],
    text: 'Ngày đầu tiên nhập học, mọi thứ đều mới mẻ. Bạn bước vào cổng trường Đại học với bao hoài bão.',
    next: 'intro_dorm',
  },
  intro_dorm: {
    id: 'intro_dorm',
    background: 'dorm_room',
    speaker: 'Đức',
    characters: [
      { id: 'player_male', pose: 'vui', pos: 'left' },
      { id: 'duc', pose: 'vui', pos: 'right' }
    ],
    text: '"Chào mày! Tao là Đức, bạn cùng phòng. Từ nay 4 năm tới tao với mày sống chung nha! Cố gắng sinh tồn trong môi trường đại học khắc nghiệt này nhé!"',
    next: 'main_loop',
  },

  // ================= VÒNG LẶP CHÍNH =================
  main_loop: {
    id: 'main_loop',
    background: 'dorm_room',
    speaker: null,
    characters: [
      { id: 'player_male', pose: 'suy_ngam', pos: 'center' }
    ],
    text: 'Một tháng mới lại bắt đầu. Bạn sẽ ưu tiên việc gì trong tháng này?',
    choices: [
      {
        text: '📚 Cày cuốc thâu đêm (Đánh đổi sức khỏe)',
        effects: { knowledge: 25, health: -15, spirit: -10 },
        next: 'trigger_random_event'
      },
      {
        text: '💼 Đi làm thêm ca đêm (Có tiền, mất thời gian)',
        effects: { money: 24, knowledge: -12, health: -12 },
        next: 'trigger_random_event'
      },
      {
        text: '🎉 Chơi xả láng (Giải tỏa tinh thần, tốn kém)',
        effects: { spirit: 13, relationship: 6, money: -16, knowledge: -3 },
        next: 'trigger_random_event'
      },
      {
        text: '💸 Vay nóng trang trải (Tiền tức thì, ôm nợ)',
        effects: { money: 19, debt: 13, morality: -5, spirit: -1 },
        next: 'trigger_random_event'
      }
    ]
  },

  // ================= SỰ KIỆN CỐ ĐỊNH =================
  event_lottery_check: {
    id: 'event_lottery_check',
    background: 'campus',
    speaker: null,
    isLottery: true,
    text: '', // Generated dynamically in runLottery
    next: 'event_lottery_result'
  },
  event_lottery_result: {
    id: 'event_lottery_result',
    background: 'campus',
    speaker: null,
    text: '', // Filled by engine
    next: 'advance_time'
  },

  exam_event: {
    id: 'exam_event',
    background: 'lecture_hall',
    speaker: 'Thầy Hùng',
    character: 'thay_hung',
    text: '"Các em bỏ hết tài liệu xuống! Hôm nay là ngày thi Kết Thúc Học Phần. Bạn nào gian lận tôi đình chỉ học ngay lập tức!"',
    next: 'exam_eval'
  },
  exam_eval: {
    id: 'exam_eval',
    background: 'lecture_hall',
    speaker: null,
    isExam: true,
    text: '', // Generated dynamically
    next: 'exam_result'
  },
  exam_result: {
    id: 'exam_result',
    background: 'lecture_hall',
    speaker: null,
    text: '', // Filled by engine
    next: 'advance_time'
  },

  graduation_eval: {
    id: 'graduation_eval',
    background: 'university_gate',
    speaker: null,
    pose: 'suy_ngam',
    text: 'Thời gian thấm thoắt thoi đưa, cuối cùng thì khóa học cũng đến lúc tổng kết. Mọi người hồi hộp chờ kết quả tốt nghiệp.',
    next: 'graduation_check'
  },
  graduation_check: {
    id: 'graduation_check',
    background: 'university_gate',
    speaker: null,
    pose: 'binh_thuong',
    isEnding: true,
    text: '', // Handled by EndingManager
  },

  // ================= SỰ KIỆN NGẪU NHIÊN =================
  rand_duc_wallet: {
    id: 'rand_duc_wallet',
    isRandomEvent: true,
    background: 'dorm_room',
    speaker: 'Đức',
    character: 'duc',
    pose: 'suy_ngam',
    text: '"Chết tao rồi mày ơi, hôm qua đi xe buýt bị móc mất cái ví! Tháng này tao cạp đất mà ăn rồi, mày cho tao mượn tiền ăn tạm qua ngày được không?"',
    choices: [
      {
        text: 'Cho Đức mượn tiền (Tốn 20💰)',
        effects: { money: -20, relationship: 15, morality: 5 },
        next: 'advance_time'
      },
      {
        text: 'Nói dối là mình cũng hết tiền',
        effects: { morality: 10, relationship: -10 },
        next: 'advance_time'
      },
      {
        text: 'Cho ăn ké mì tôm cả tháng (Giảm sức khỏe cả hai)',
        effects: { health: -15, spirit: -5, relationship: 20 },
        next: 'advance_time'
      },
      {
        text: 'Rủ Đức đi bốc vác làm thêm kiếm tiền',
        effects: { money: 19, health: -13, spirit: -6 },
        next: 'advance_time'
      }
    ]
  },

  rand_scooter_broken: {
    id: 'rand_scooter_broken',
    isRandomEvent: true,
    background: 'campus',
    speaker: null,
    pose: 'buon',
    text: 'Đang đi trên đường thì chiếc xe Wave cũ kỹ của bạn bỗng nhiên bốc khói đen thui rồi chết máy giữa ngã tư đông đúc.',
    choices: [
      {
        text: 'Gọi thợ sửa xe đến cứu hộ (−50💰)',
        effects: { money: -20, health: 20 },
        next: 'advance_time'
      },
      {
        text: 'Hì hục dắt bộ 3 cây số dưới trời nắng gắt',
        effects: { health: -10, spirit: -10, money: 20 },
        next: 'advance_time'
      },
      {
        text: 'Bỏ xe lại lề đường, bắt xe ôm đi học cho kịp điểm danh',
        effects: { money: -20, knowledge: 25, spirit: -5 },
        next: 'advance_time'
      },
      {
        text: 'Tự lên mạng tra cách sửa xe tại chỗ',
        effects: { knowledge: 18, health: -6, spirit: -6, money: -6 },
        next: 'advance_time'
      }
    ]
  },

  rand_roommate_conflict: {
    id: 'rand_roommate_conflict',
    isRandomEvent: true,
    background: 'dorm_room',
    speaker: 'Đức',
    characters: [
      { id: 'player_male', pose: 'suy_ngam', pos: 'center' },
      { id: 'duc', pose: 'vui', pos: 'right' }
    ],
    text: '"Nay tao dẫn bạn gái về phòng chơi xíu nha mày! Mày... lượn đi đâu vài tiếng được không?" - Đức cười trừ nói.',
    choices: [
      {
        text: 'Vui vẻ nhường phòng, ra thư viện học bài',
        effects: { relationship: 10, knowledge: 10, spirit: -20 },
        next: 'advance_time'
      },
      {
        text: 'Mắng cho một trận, bắt nó đưa bạn gái ra quán cà phê',
        effects: { relationship: -14, spirit: 7, morality: 7 },
        next: 'advance_time'
      },
      {
        text: 'Chây ỳ ở nhà không chịu đi, làm "kỳ đà cản mũi"',
        effects: { relationship: -20, spirit: 20 },
        next: 'advance_time'
      },
      {
        text: 'Đòi Đức "trả tiền thuê phòng" rồi mới đi',
        effects: { money: 20, relationship: -10, morality: -10 },
        next: 'advance_time'
      }
    ]
  },

  rand_club_drama: {
    id: 'rand_club_drama',
    isRandomEvent: true,
    background: 'campus',
    speaker: null,
    pose: 'suy_ngam',
    text: 'Câu lạc bộ bạn đang tham gia xảy ra lục đục nội bộ. Trưởng ban truyền thông và trưởng ban sự kiện đang cãi nhau nảy lửa về ngân sách.',
    choices: [
      {
        text: 'Đứng về phe truyền thông',
        effects: { relationship: -5, knowledge: 15, spirit: -10 },
        next: 'advance_time'
      },
      {
        text: 'Đứng về phe sự kiện',
        effects: { relationship: -5, money: 15, spirit: -10 },
        next: 'advance_time'
      },
      {
        text: 'Giả vờ đau bụng để tẩu thoát khỏi cuộc họp',
        effects: { relationship: -15, spirit: 15 },
        next: 'advance_time'
      },
      {
        text: 'Bình tĩnh phân tích tình hình, đưa ra phương án hòa giải',
        effects: { relationship: 10, knowledge: 5, spirit: -20, morality: 5 },
        next: 'advance_time'
      }
    ]
  },

  rand_multi_level: {
    id: 'rand_multi_level',
    isRandomEvent: true,
    background: 'canteen',
    speaker: 'Người lạ',
    character: null,
    pose: 'suy_ngam',
    text: '"Em có muốn trở thành triệu phú ở tuổi 20 không? Chị đang có một dự án khởi nghiệp vốn 0 đồng, thu nhập ngàn đô. Tham gia seminar nhé!"',
    choices: [
      {
        text: 'Từ chối thẳng thừng và bỏ đi',
        effects: { money: 0 },
        next: 'advance_time'
      },
      {
        text: 'Nghe thử xem sao (Bị thao túng tâm lý)',
        effects: { spirit: 5, knowledge: -5 },
        next: 'advance_time'
      },
      {
        text: 'Đầu tư tiền mua sản phẩm khởi nghiệp (−40💰)',
        effects: { money: -14, knowledge: 20, spirit: -6 },
        next: 'advance_time'
      },
      {
        text: 'Phân tích vạch trần mô hình lừa đảo giữa đám đông',
        effects: { knowledge: 10, spirit: 10, morality: 5, health: -25 },
        next: 'advance_time'
      }
    ]
  },

  rand_sick: {
    id: 'rand_sick',
    isRandomEvent: true,
    background: 'dorm_room',
    speaker: null,
    pose: 'buon',
    text: 'Thời tiết thay đổi thất thường, cộng thêm việc sinh hoạt không điều độ khiến bạn bị sốt li bì.',
    choices: [
      {
        text: 'Mua thuốc xịn và đi viện khám (−25💰)',
        effects: { money: -25, health: 25 },
        next: 'advance_time'
      },
      {
        text: 'Nằm lì ở nhà tự khỏi',
        effects: { health: 8, spirit: -8 },
        next: 'advance_time'
      },
      {
        text: 'Vẫn cố vác xác đi làm thêm kiếm tiền',
        effects: { health: -12, money: 20, spirit: -8 },
        next: 'advance_time'
      },
      {
        text: 'Gọi Lan mua cháo giùm (Cần quan hệ cao)',
        effects: { health: -13, relationship: 5, spirit: 8 },
        next: 'advance_time'
      }
    ]
  },

  rand_accident: {
    id: 'rand_accident',
    isRandomEvent: true,
    background: 'university_gate',
    speaker: null,
    pose: 'binh_thuong',
    text: 'Đang đi trên đường, bạn thấy một vụ va quẹt xe. Một người lớn tuổi bị ngã xuống đường, đồ đạc văng tung tóe.',
    choices: [
      {
        text: 'Chạy lại đỡ người đó dậy và nhặt đồ',
        effects: { morality: 15, spirit: 5, health: -20 },
        next: 'advance_time'
      },
      {
        text: 'Đưa người đó vào viện và trả tiền viện phí (−30💰)',
        effects: { morality: 13, money: -20, spirit: 7 },
        next: 'advance_time'
      },
      {
        text: 'Lờ đi, sợ bị ăn vạ',
        effects: { morality: 5, spirit: -5 },
        next: 'advance_time'
      },
      {
        text: 'Đứng quay video đăng TikTok câu view',
        effects: { morality: -15, money: 20, spirit: -5 },
        next: 'advance_time'
      }
    ]
  },

  rand_tutor: {
    id: 'rand_tutor',
    isRandomEvent: true,
    background: 'campus',
    speaker: 'Lan',
    character: 'lan',
    pose: 'vui',
    text: '"Dạo này mình học yếu quá, bạn có thời gian rảnh kèm mình học bài không? Mình sẽ đãi bạn ăn trưa!"',
    choices: [
      {
        text: 'Đồng ý kèm Lan học miễn phí',
        effects: { relationship: -7, knowledge: 2, spirit: 5 },
        next: 'advance_time'
      },
      {
        text: 'Đòi trả công bằng tiền mặt (15💰)',
        effects: { money: 15, relationship: -10, morality: -5 },
        next: 'advance_time'
      },
      {
        text: 'Từ chối vì bận rộn',
        effects: { money: 0 },
        next: 'advance_time'
      },
      {
        text: 'Chỉ bài qua loa rồi rủ đi chơi',
        effects: { relationship: 15, knowledge: -5, money: -10 },
        next: 'advance_time'
      }
    ]
  },

  rand_deadline: {
    id: 'rand_deadline',
    isRandomEvent: true,
    background: 'dorm_room',
    speaker: null,
    pose: 'buon',
    text: 'Tuần này có đến 3 bài tiểu luận deadline cùng lúc. Nếu không nộp đúng hạn sẽ rớt môn!',
    choices: [
      {
        text: 'Thức trắng 3 đêm liền để làm',
        effects: { health: -13, spirit: -7, knowledge: 20 },
        next: 'advance_time'
      },
      {
        text: 'Bỏ tiền thuê người làm hộ (−30💰)',
        effects: { money: 9, morality: -6, knowledge: -3 },
        next: 'advance_time'
      },
      {
        text: 'Copy paste từ trên mạng về nộp',
        effects: { morality: 9, knowledge: -6, spirit: -3 },
        next: 'advance_time'
      },
      {
        text: 'Chấp nhận nộp trễ, tập trung làm cho tốt',
        effects: { knowledge: 5, spirit: -5 },
        next: 'advance_time'
      }
    ]
  },

  rand_rain_lan: {
    id: 'rand_rain_lan',
    isRandomEvent: true,
    background: 'university_gate',
    speaker: 'Lan',
    characters: [
      { id: 'player_male', pose: 'vui', pos: 'left' },
      { id: 'lan', pose: 'default', pos: 'right' }
    ],
    text: '"Trời mưa to quá, mình lại quên mang ô rồi... Cậu tính sao bây giờ?" (Trú mưa cùng Lan)',
    choices: [
      {
        text: 'Nhường áo khoác cho Lan (Anh hùng cứu mỹ nhân)',
        effects: { relationship: 14, health: -20, spirit: 6 },
        next: 'advance_time'
      },
      {
        text: 'Cùng nhau dầm mưa chạy về',
        effects: { relationship: 10, health: -25, spirit: 15 },
        next: 'advance_time'
      },
      {
        text: 'Đứng sát nhau trú mưa (Ngượng ngùng)',
        effects: { relationship: 15, spirit: 5, health: -20 },
        next: 'advance_time'
      },
      {
        text: 'Bắt taxi đi về một mình (Mặc kệ Lan)',
        effects: { relationship: -12, money: -8, health: 20 },
        next: 'advance_time'
      }
    ]
  },

  rand_pc_repair: {
    id: 'rand_pc_repair',
    isRandomEvent: true,
    background: 'dorm_room',
    speaker: 'Lan',
    characters: [
      { id: 'player_male', pose: 'suy_ngam', pos: 'left' },
      { id: 'lan', pose: 'default', pos: 'right' }
    ],
    text: '"Máy tính mình tự nhiên sập nguồn rồi, cậu qua xem giúp mình được không? Đồ án mình sắp đến hạn rồi!"',
    choices: [
      {
        text: 'Nhiệt tình sửa giúp (Tốn thời gian)',
        effects: { relationship: 16, knowledge: 3, health: -13, spirit: -6 },
        next: 'advance_time'
      },
      {
        text: 'Lên Google tìm cách sửa bừa',
        effects: { knowledge: 10, relationship: 5, spirit: -15 },
        next: 'advance_time'
      },
      {
        text: 'Khuyên Lan mang ra tiệm sửa (Đỡ mệt)',
        effects: { relationship: -5, spirit: 5 },
        next: 'advance_time'
      },
      {
        text: 'Vòi vĩnh Lan đãi ăn để trả công',
        effects: { relationship: -20, money: 10, spirit: 10 },
        next: 'advance_time'
      }
    ]
  },

  rand_argument: {
    id: 'rand_argument',
    isRandomEvent: true,
    background: 'canteen',
    speaker: 'Đức',
    characters: [
      { id: 'player_male', pose: 'buon', pos: 'center' },
      { id: 'duc', pose: 'default', pos: 'left' },
      { id: 'lan', pose: 'default', pos: 'right' }
    ],
    text: '"Này, sao cậu lại làm hỏng cuốn sách của tôi thế hả?" - Đức và Lan đang cãi nhau to vì một chuyện hiểu lầm.',
    choices: [
      {
        text: 'Bênh vực Lan (Bảo vệ phái yếu)',
        effects: { relationship: 14, morality: -7, spirit: -7 },
        next: 'advance_time'
      },
      {
        text: 'Bênh vực Đức (Anh em chí cốt)',
        effects: { relationship: 10, morality: -5, spirit: -5 },
        next: 'advance_time'
      },
      {
        text: 'Cười hề hề đứng xem kịch',
        effects: { relationship: -10, spirit: 25, morality: -15 },
        next: 'advance_time'
      },
      {
        text: 'Đứng ra hòa giải, phân tích đúng sai',
        effects: { relationship: 10, knowledge: 5, morality: 10, spirit: -25 },
        next: 'advance_time'
      }
    ]
  }
};
