/* ============================================
   Visual Novel — Endings
   ============================================ */
const ENDINGS = {
  perfectLife: {
    type: 'happy', title: '🌟 Huyền Thoại Đại Học',
    story: 'Bạn bước lên bục nhận bằng Cử nhân Xuất sắc trong tiếng vỗ tay rầm rộ của cả hội trường. Hàng tá tập đoàn lớn trải thảm đỏ mời gọi bạn với mức lương khủng. Không chỉ học giỏi, bạn còn có một tình yêu đẹp và những người bạn tri kỷ suốt đời. 4 năm thanh xuân của bạn rực rỡ như một cuốn phim điện ảnh!\n\n🎉 TRÚNG ĐÍCH MỸ MÃN — Bạn là huyền thoại!',
    color: '#10b981',
  },
  billionaire: {
    type: 'happy', title: '💎 Tỉ Phú Tuổi 22',
    story: 'Tấm bằng đại học giờ đây chỉ là vật trang trí trong căn penthouse của bạn. Nhờ khả năng nắm bắt cơ hội và những khoản đầu tư sắc bén từ thời sinh viên, bạn đã tự xây dựng nên một đế chế tài chính của riêng mình. Bạn ngồi nhâm nhi ly rượu vang, nhìn xuống thành phố hoa lệ.\n\n🎉 TRÚNG ĐÍCH TÀI PHIỆT — Tiền không mua được hạnh phúc, nhưng rất nhiều tiền thì có!',
    color: '#f59e0b',
  },
  lucky: {
    type: 'neutral', title: '🍀 Con Cưng Của Trời',
    story: 'Suốt 4 năm học, bạn chẳng học hành bao nhiêu, toàn đi chơi lêu lổng. Nhưng kỳ diệu thay, cứ đến ngày thi là bạn lại trúng tủ! Bạn qua môn một cách thần kỳ và ra trường với tấm bằng trung bình khá. Bạn bước vào đời với một nụ cười ngây ngô và sự bảo kê của Thần May Mắn.\n\n📌 KẾT CỤC KỲ LẠ — Thánh ăn may.',
    color: '#8b5cf6',
  },
  freelancer: {
    type: 'neutral', title: '💻 Sói Độc Hành',
    story: 'Bạn không thích sự gò bó của chốn công sở hay những buổi tụ tập ồn ào. Với vốn kiến thức chuyên sâu và kỹ năng thượng thừa, bạn trở thành một Freelancer khét tiếng trên mạng. Bạn xách balo lên, chu du khắp thế giới, kiếm tiền bằng chiếc laptop ở bất cứ đâu bạn thích.\n\n📌 KẾT CỤC TỰ DO — Gió phiêu bạt.',
    color: '#3b82f6',
  },
  normal: {
    type: 'neutral', title: '☕ Vòng Xoáy Cơm Áo',
    story: 'Lễ tốt nghiệp trôi qua nhạt nhòa. Bạn nhanh chóng ném tấm bằng vào góc tủ và lao vào vòng xoáy xin việc. Sáng 8h chấm công, chiều 5h chen chúc tắc đường về nhà phòng trọ chật hẹp. Cuộc sống của bạn không có gì nổi bật, trôi đi một cách bình lặng như hàng triệu người khác.\n\n📌 KẾT CỤC THỰC TẾ — NPC của xã hội.',
    color: '#6b7280',
  },
  hometown: {
    type: 'neutral', title: '🏡 Bình Yên Quê Nhà',
    story: 'Khói bụi thành phố khiến bạn nghẹt thở. Bạn quyết định xé bỏ chiếc vé trụ lại thủ đô, xách vali về quê trồng rau nuôi cá. Tối tối ngồi uống chè xít cùng ba mẹ, nghe tiếng ếch nhái kêu ngoài đồng. Không giàu sang, không danh vọng, nhưng tâm hồn bạn chưa bao giờ bình yên đến thế.\n\n📌 KẾT CỤC BÌNH YÊN — Bão dừng sau cánh cửa.',
    color: '#22c55e',
  },
  healthSacrifice: {
    type: 'neutral', title: '🏥 Cỗ Máy Hỏng Hóc',
    story: 'Bạn ôm chặt tấm bằng tốt nghiệp trong tay, nhưng lại đang nằm trên giường bệnh truyền nước biển. Những đêm thức trắng cày đồ án và làm thêm đã vắt kiệt chút sinh lực cuối cùng của bạn. Bác sĩ lắc đầu ngao ngán. Bạn có học vấn, có tiền, nhưng lại đánh mất đi thứ quý giá nhất.\n\n📌 KẾT CỤC ĐÁNH ĐỔI — Chiếc lá úa.',
    color: '#ef4444',
  },
  quit: {
    type: 'bad', title: '🚪 Cánh Cửa Khép Lại',
    story: 'Bỏ học giữa chừng. Bạn gói gém đồ đạc rời khỏi ký túc xá trong một chiều mưa tầm tã, bỏ lại sau lưng những ánh mắt tiếc nuối. Tương lai phía trước là một màn sương mù dày đặc vô định...\n\n💀 KẾT CỤC TỒI TỆ — Kẻ bỏ cuộc.',
    color: '#374151',
  },
  mentalBreakdown: {
    type: 'bad', title: '😵 Dây Đàn Đứt Đoạn',
    story: 'Áp lực học hành, thi cử, tiền bạc và sự kỳ vọng của gia đình... tất cả như một tảng đá ngàn cân đè nát tâm trí bạn. Bạn gào thét trong đêm tối, mọi thứ xung quanh vỡ vụn. Bạn bị buộc phải bảo lưu kết quả và chuyển vào trung tâm điều trị tâm lý dài hạn.\n\n💀 KẾT CỤC BI KỊCH — Vỡ vụn.\n\n⚠️ Nếu bạn cần hỗ trợ: 1800 599 920',
    color: '#7c3aed',
  },
  bankrupt: {
    type: 'bad', title: '💸 Con Nợ Chạy Trốn',
    story: 'Lãi mẹ đẻ lãi con, số tiền vay nặng lãi ngày nào giờ đã biến thành một con số khổng lồ không thể trả nổi. Giang hồ kéo đến tận cửa lớp tìm bạn. Quá sợ hãi, bạn tắt điện thoại, xóa dấu vết và chạy trốn khỏi thành phố trong đêm.\n\n💀 KẾT CỤC BI KỊCH — Trốn chạy.',
    color: '#dc2626',
  },
  collapse: {
    type: 'bad', title: '🏥 Hơi Thở Cuối Cùng',
    story: 'Tầm nhìn mờ dần... Bạn gục ngã ngay giữa giảng đường lạnh lẽo. Cơ thể đã bị bóc lột đến giới hạn cuối cùng và không thể chịu đựng thêm một giây nào nữa. Tiếng còi xe cấp cứu inh ỏi là âm thanh cuối cùng bạn nghe được trước khi chìm vào bóng tối vĩnh cửu.\n\n💀 KẾT CỤC TỬ VONG — Game Over.',
    color: '#b91c1c',
  },
  criminal: {
    type: 'bad', title: '⚖️ Sau Song Sắt',
    story: 'Bạn đã đánh mất đi nhân cách của mình trên con đường sinh tồn. Gian lận, lừa đảo, trộm cắp... Cái giá phải trả là tiếng còi xe cảnh sát hú vang trước cửa phòng trọ. Bạn cúi gằm mặt, đôi tay bị còng chặt, bỏ lại thanh xuân sau những song sắt lạnh lẽo.\n\n💀 KẾT CỤC BI KỊCH — Vết nhơ không gột rửa.',
    color: '#1f2937',
  },
  lonely: {
    type: 'bad', title: '😢 Bóng Ma Cô Độc',
    story: 'Xung quanh bạn đông đúc người qua lại, nhưng không một ai nhìn bạn, không một ai mỉm cười với bạn. Bạn tự cô lập mình cho đến khi nhận ra mình đã trở thành một "bóng ma" vô hình ngay trong lớp học. Ngày lễ tốt nghiệp, bạn lặng lẽ nhận bằng rồi lẻ loi bước về trong cô đơn tột cùng.\n\n💀 KẾT CỤC BI KỊCH — Cô độc đến chết.',
    color: '#4b5563',
  },
};

class EndingManager {
  constructor(stats) { this.s = stats; }

  checkBadEnding() {
    if (this.s.flags.skipChosen) return ENDINGS.quit;
    if (this.s.isZero('spirit')) return ENDINGS.mentalBreakdown;
    if (this.s.get('debt') >= 100) return ENDINGS.bankrupt;
    if (this.s.isZero('health')) return ENDINGS.collapse;
    if (this.s.isZero('morality')) return ENDINGS.criminal;
    if (this.s.isZero('relationship')) return ENDINGS.lonely;
    return null;
  }

  evaluateFinal() {
    const s = this.s;
    if (s.isAtLeast('relationship','extreme') && s.isAtLeast('health','extreme') && s.isAtLeast('spirit','extreme') && s.isAtLeast('knowledge','high') && s.isAtLeast('skill','high') && s.isAtLeast('morality','medium') && s.isAtLeast('money','medium'))
      return ENDINGS.perfectLife;
    if (s.flags.wonJackpot && s.isAtLeast('knowledge','high') && s.isAtLeast('skill','high') && s.isAtLeast('spirit','high'))
      return ENDINGS.billionaire;
    if (s.flags.lotteryWon > s.flags.lotterySpent && s.isAtLeast('knowledge','medium') && s.isAtLeast('spirit','medium'))
      return ENDINGS.lucky;
    if (s.isAtLeast('skill','high') && s.isAtLeast('knowledge','high'))
      return ENDINGS.freelancer;
    if (s.isAtLeast('relationship','high') && !s.isAtLeast('knowledge','medium') && s.flags.familyPositive > 0)
      return ENDINGS.hometown;
    if (!s.isAtLeast('health','medium') || !s.isAtLeast('spirit','medium'))
      return ENDINGS.healthSacrifice;
    return ENDINGS.normal;
  }
}
