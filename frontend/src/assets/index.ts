import minh from './char-minh.webp';
import lan from './char-lan.webp';
import huy from './char-huy.webp';
import phong from './char-phong.webp';
import mai from './char-mai.webp';
import bgCampus from './bg-campus.webp';
import bgDorm from './bg-dorm.webp';
import bgClassroom from './bg-classroom.webp';
import bgSeasonEnroll from './bg-season-enroll.webp';
import bgSeasonChallenge from './bg-season-challenge.webp';
import bgSeasonGrowth from './bg-season-growth.webp';
import bgSeasonReunion from './bg-season-reunion.webp';
import fxSurpriseStudy from './fx-surprise-study.webp';
import fxSurpriseFinance from './fx-surprise-finance.webp';
import fxSurpriseHealth from './fx-surprise-health.webp';
import fxSurpriseRelationship from './fx-surprise-relationship.webp';
import fxSurpriseMorality from './fx-surprise-morality.webp';
import fxSurpriseWork from './fx-surprise-work.webp';
import fxSurpriseLuck from './fx-surprise-luck.webp';
import fxSurpriseElevator from './fx-surprise-elevator.webp';

export const portraits = {
  minh,
  lan,
  huy,
  phong,
  mai,
  'ong-tu': phong,
  father: minh,
  mother: mai,
} as const;

export type PortraitId = keyof typeof portraits;

export const backgrounds = {
  campus: bgCampus,
  dorm: bgDorm,
  classroom: bgClassroom,
  seasonEnroll: bgSeasonEnroll,
  seasonChallenge: bgSeasonChallenge,
  seasonGrowth: bgSeasonGrowth,
  seasonReunion: bgSeasonReunion,
  surpriseStudy: fxSurpriseStudy,
  surpriseFinance: fxSurpriseFinance,
  surpriseHealth: fxSurpriseHealth,
  surpriseRelationship: fxSurpriseRelationship,
  surpriseMorality: fxSurpriseMorality,
  surpriseWork: fxSurpriseWork,
  surpriseLuck: fxSurpriseLuck,
  surpriseElevator: fxSurpriseElevator,
} as const;

export type BackgroundId = keyof typeof backgrounds;

export type SeasonId = 'enroll' | 'challenge' | 'growth' | 'reunion';

export function seasonFromMonth(month: number): SeasonId {
  const quarter = Math.min(4, Math.floor(((month - 1) % 12) / 3) + 1);
  return (['enroll', 'challenge', 'growth', 'reunion'] as const)[quarter - 1]!;
}

export const seasonBackgrounds: Record<SeasonId, BackgroundId> = {
  enroll: 'seasonEnroll',
  challenge: 'seasonChallenge',
  growth: 'seasonGrowth',
  reunion: 'seasonReunion',
};

/** Label mùa lấy từ `content.seasons` (single source ở game-content). */
export { seasons as contentSeasons } from '@game/game-content';
export function seasonLabelById(seasons: { id: string; name: string }[], id: SeasonId): string {
  return seasons.find((s) => s.id === id)?.name ?? id;
}

export const surpriseBackgrounds: Record<string, BackgroundId> = {
  study: 'surpriseStudy',
  finance: 'surpriseFinance',
  health: 'surpriseHealth',
  relationship: 'surpriseRelationship',
  family: 'surpriseRelationship',
  morality: 'surpriseMorality',
  work: 'surpriseWork',
  luck: 'surpriseLuck',
};

export const surpriseSceneById: Record<string, BackgroundId> = {
  'elevator-stuck': 'surpriseElevator',
  'pop-quiz': 'surpriseStudy',
  'lost-group-file': 'surpriseStudy',
  'job-scam': 'surpriseFinance',
  'account-hijack': 'surpriseFinance',
  'food-poisoning': 'surpriseHealth',
  'exercise-injury': 'surpriseHealth',
  'lan-rumor': 'surpriseRelationship',
  'forgotten-birthday': 'surpriseRelationship',
  'found-wallet': 'surpriseMorality',
  'wage-theft': 'surpriseWork',
  'small-lottery-win': 'surpriseLuck',
};

/**
 * Agent 1: `narrator` = lời dẫn, không portrait.
 * Tách EventDialogueBeat để activityDialogues / main.tsx không bị gãy type.
 * Khi nối shell: nếu speaker === 'narrator' → label “…” và bỏ spotlight portrait.
 */
export type EventDialogueSpeaker = PortraitId | 'narrator';

export interface DialogueBeat {
  speaker: PortraitId;
  line: string;
}

export interface EventDialogueBeat {
  speaker: EventDialogueSpeaker;
  line: string;
}

/** Surprise dùng cùng quy ước narrator với event để UI chạy từng beat trước choice. */
export type SurpriseDialogueBeat = EventDialogueBeat;

export const activityDialogues: Record<string, DialogueBeat[]> = {
  study: [{ speaker: 'lan', line: 'Minh, phần này cậu hiểu chưa? Tớ giải lại nhé.' }, { speaker: 'minh', line: 'Ừ, cảm ơn Lan. Lần này tớ sẽ tự làm nốt bài cuối.' }],
  part_time: [{ speaker: 'phong', line: 'Ca tối hơi đông. Em theo anh, đừng cố làm mọi thứ một mình.' }, { speaker: 'minh', line: 'Vâng. Em muốn kiếm thêm, nhưng cũng sẽ giữ sức.' }],
  skill_training: [{ speaker: 'minh', line: 'Mình làm lại từ đầu. Chậm một chút, nhưng phải hiểu thật chắc.' }],
  exercise: [{ speaker: 'huy', line: 'Chạy thêm một vòng không? Thua thì bao nước.' }, { speaker: 'minh', line: 'Được. Nhưng đừng viện cớ đau chân khi thua nhé.' }],
  rest: [{ speaker: 'huy', line: 'Hôm nay nghỉ đi. Cậu nhìn mệt lắm rồi.' }, { speaker: 'minh', line: 'Ừ. Ngày mai tớ sẽ bắt đầu lại với đầu óc tỉnh táo hơn.' }],
  gaming: [{ speaker: 'huy', line: 'Minh, vào đội đi. Thiếu đúng một người.' }, { speaker: 'minh', line: 'Một trận thôi nhé. Xong cậu nhắc tớ quay lại học.' }],
  socialize: [{ speaker: 'lan', line: 'Bọn tớ định ra căn tin. Minh đi cùng không?' }, { speaker: 'minh', line: 'Có chứ. Dạo này tớ cũng ít nói chuyện với mọi người.' }, { speaker: 'huy', line: 'Vậy đủ đội rồi. Hôm nay không ai được ngồi một mình.' }],
  family: [{ speaker: 'mai', line: 'Anh Minh khỏe không? Mẹ cứ hỏi bao giờ anh gọi về.' }, { speaker: 'minh', line: 'Anh vẫn ổn. Nói với mẹ tối nay anh sẽ gọi lâu hơn nhé.' }],
  borrow: [{ speaker: 'phong', line: 'Anh có thể giúp, nhưng em phải tính rõ ngày trả.' }, { speaker: 'minh', line: 'Em hiểu. Em sẽ ghi lại và không xem đây là tiền miễn phí.' }],
  lottery: [{ speaker: 'ong-tu', line: 'Một tờ lấy may thôi cháu. Đừng đặt cả hy vọng vào nó.' }, { speaker: 'minh', line: 'Vâng, cháu chỉ thử một lần. Việc của cháu vẫn phải tự làm.' }],
};

export const activityDialogueVariants: Record<string, DialogueBeat[][]> = {
  study: [
    activityDialogues.study!,
    [{ speaker: 'lan', line: 'Bài hôm nay dài đấy. Cậu muốn chia đôi phần ôn không?' }, { speaker: 'minh', line: 'Được. Tớ làm phần khó trước, lát mình đối chiếu đáp án.' }],
    [{ speaker: 'minh', line: 'Lần này mình không học để đối phó. Mình muốn biết vì sao đáp án lại như vậy.' }, { speaker: 'lan', line: 'Tốt. Hiểu được gốc thì đề có đổi cách hỏi cũng không làm khó cậu.' }],
    [{ speaker: 'lan', line: 'Cậu tiến bộ nhiều rồi. Giờ thử giải thích lại phần này cho tớ xem.' }, { speaker: 'minh', line: 'Để tớ thử. Nếu nói vấp thì cậu đừng cười nhé.' }],
  ],
  part_time: [
    activityDialogues.part_time!,
    [{ speaker: 'phong', line: 'Hôm nay em đứng quầy chính. Có gì không chắc thì hỏi ngay.' }, { speaker: 'minh', line: 'Vâng. Em thà hỏi một lần còn hơn sửa sai cả tối.' }],
    [{ speaker: 'minh', line: 'Em bắt đầu quen việc rồi, nhưng lịch học đang dày lên.' }, { speaker: 'phong', line: 'Biết từ chối ca cũng là một kỹ năng. Đừng học bài đó quá muộn.' }],
    [{ speaker: 'phong', line: 'Khách vừa khen em xử lý bình tĩnh đấy.' }, { speaker: 'minh', line: 'Chắc vì em đã gặp đủ tình huống để không còn hoảng nữa.' }],
  ],
  skill_training: [
    activityDialogues.skill_training!,
    [{ speaker: 'minh', line: 'Sai ở bước nào thì sửa đúng bước đó. Không cần xóa sạch làm lại.' }],
    [{ speaker: 'minh', line: 'Bài tập cũ từng mất cả buổi, giờ mình giải được nhanh hơn rồi.' }],
    [{ speaker: 'minh', line: 'Kỹ năng không tăng sau một đêm. Nhưng hôm nay phải tốt hơn hôm qua một chút.' }],
  ],
  exercise: [
    activityDialogues.exercise!,
    [{ speaker: 'huy', line: 'Hôm nay chạy nhẹ thôi. Ông đừng biến buổi tập thành kỳ thi.' }, { speaker: 'minh', line: 'Yên tâm. Mục tiêu là khỏe hơn, không phải thắng ai.' }],
    [{ speaker: 'minh', line: 'Tập đều đúng là khác. Leo cầu thang không còn hụt hơi nữa.' }, { speaker: 'huy', line: 'Tốt. Giờ ông đủ sức xách luôn túi đồ ăn của tôi.' }],
    [{ speaker: 'huy', line: 'Khởi động kỹ chưa? Tôi không muốn lại phải dìu ông về.' }, { speaker: 'minh', line: 'Rồi. Lần này tớ nghe cơ thể trước khi nghe sĩ diện.' }],
  ],
  rest: [
    activityDialogues.rest!,
    [{ speaker: 'minh', line: 'Tối nay mình tắt báo thức sớm. Một ngày nghỉ không làm mọi thứ sụp đổ.' }, { speaker: 'huy', line: 'Cuối cùng ông cũng nói được một câu nghe có lý.' }],
    [{ speaker: 'huy', line: 'Tôi để phần cơm trên bàn. Ăn xong rồi ngủ tiếp.' }, { speaker: 'minh', line: 'Cảm ơn. Hôm nay tớ không cố chứng minh mình ổn nữa.' }],
    [{ speaker: 'minh', line: 'Đầu óc yên xuống rồi. Có lẽ nghỉ ngơi cũng là một phần của kế hoạch.' }],
  ],
  gaming: [
    activityDialogues.gaming!,
    [{ speaker: 'huy', line: 'Một trận giải lao nhé. Trận trước ông gánh đội khá lắm.' }, { speaker: 'minh', line: 'Được, nhưng hết trận là dừng. Tớ còn việc chưa xong.' }],
    [{ speaker: 'minh', line: 'Hôm nay chơi vì vui thôi, không thức tới sáng.' }, { speaker: 'huy', line: 'Tuyên bố rất trưởng thành. Để xem ông giữ được bao lâu.' }],
    [{ speaker: 'huy', line: 'Đội cũ lại online đủ người rồi.' }, { speaker: 'minh', line: 'Vào thôi. Lâu rồi mới có một tối không phải chạy theo hạn chót.' }],
  ],
  socialize: [
    activityDialogues.socialize!,
    [{ speaker: 'huy', line: 'Căn tin có món mới. Lan bảo không ngon, tức là vẫn ăn hết.' }, { speaker: 'lan', line: 'Cậu bớt kể sai đi. Minh, đi cùng bọn tớ nhé?' }, { speaker: 'minh', line: 'Đi. Hôm nay tớ cần nghe chuyện khác ngoài bài vở.' }],
    [{ speaker: 'lan', line: 'Mọi người đang bàn chuyến đi cuối tuần.' }, { speaker: 'minh', line: 'Cho tớ tham gia với. Tớ sẽ kiểm tra lịch trước khi hứa.' }],
    [{ speaker: 'huy', line: 'Nhóm mình hiếm khi đông đủ thế này.' }, { speaker: 'minh', line: 'Vậy cất điện thoại đi. Ít nhất tối nay mình nói chuyện thật.' }],
  ],
  family: [
    activityDialogues.family!,
    [{ speaker: 'mai', line: 'Anh ăn uống đàng hoàng chưa? Đừng trả lời “rồi” nhanh quá.' }, { speaker: 'minh', line: 'Hôm nay anh ăn thật. Anh còn biết nấu thêm được một món rồi.' }],
    [{ speaker: 'minh', line: 'Ở nhà dạo này thế nào? Đừng chỉ kể chuyện tốt để anh yên tâm.' }, { speaker: 'mai', line: 'Vậy anh cũng phải hứa không giấu chuyện khó ở trên đó.' }],
    [{ speaker: 'mai', line: 'Mẹ đang ngồi cạnh em nhưng giả vờ không nghe máy.' }, { speaker: 'minh', line: 'Đưa máy cho mẹ đi. Hôm nay anh có nhiều chuyện muốn kể.' }],
  ],
  borrow: [
    activityDialogues.borrow!,
    [{ speaker: 'minh', line: 'Em đã tính khoản cần vay và phần có thể trả mỗi mùa.' }, { speaker: 'phong', line: 'Có con số rõ ràng tốt hơn lời hứa. Nhưng em vẫn phải chừa đường lui.' }],
    [{ speaker: 'phong', line: 'Nợ cũ chưa nhẹ mà em lại cần thêm sao?' }, { speaker: 'minh', line: 'Em biết đây không phải giải pháp lâu dài. Em đang mua thời gian để sửa tình hình.' }],
    [{ speaker: 'minh', line: 'Em không thích cảm giác phải hỏi vay lần nữa.' }, { speaker: 'phong', line: 'Vậy nhớ cảm giác này khi em quyết định khoản tiền tiếp theo dùng vào đâu.' }],
  ],
  lottery: [
    activityDialogues.lottery!,
    [{ speaker: 'ong-tu', line: 'Lại gặp cháu. Hôm nay mua vui hay mua hy vọng?' }, { speaker: 'minh', line: 'Một chút vui thôi ông. Cháu vẫn giữ tiền cho việc cần làm.' }],
    [{ speaker: 'minh', line: 'Có lúc cháu cứ nghĩ chỉ cần trúng một lần là mọi chuyện xong.' }, { speaker: 'ong-tu', line: 'Tiền giải quyết được nhiều chuyện. Nhưng lòng tham thường tạo chuyện mới.' }],
    [{ speaker: 'ong-tu', line: 'Tờ cuối hôm nay đấy. Cháu có chắc không?' }, { speaker: 'minh', line: 'Cháu mua một tờ thôi. Phần còn lại vẫn phải dựa vào kế hoạch.' }],
  ],
};

/** Hội thoại nhiều nhịp theo sự kiện. Speaker ∈ cast của eventScenes, hoặc `narrator`. */
export const eventDialogues: Record<string, EventDialogueBeat[]> = {
  'first-test': [
    { speaker: 'narrator', line: 'Bài kiểm tra đầu tiên. Tim Minh đập nhanh hơn mực trên giấy.' },
    { speaker: 'lan', line: 'Thở đều lại. Cậu ôn tới đâu thì làm tới đó — đừng trống cả tờ.' },
    { speaker: 'minh', line: 'Ừ… Mình sẽ làm hết sức. Không để bốn năm bắt đầu bằng một tờ giấy trắng.' },
  ],
  'traffic-accident': [
    { speaker: 'narrator', line: 'Tiếng phanh xe cắt ngang chiều về ký túc.' },
    { speaker: 'minh', line: 'Đầu óc quay. Tay run. Thành phố không chờ ai đứng dậy.' },
    { speaker: 'narrator', line: 'Mỗi bước về phòng sau đó đều nhắc Minh: sức khỏe không phải chỉ số phụ.' },
  ],
  'first-tet-away': [
    { speaker: 'narrator', line: 'Tết đầu tiên xa nhà. Màn hình điện thoại sáng hơn bàn thờ quê.' },
    { speaker: 'mai', line: 'Anh… nhà vắng quá. Mẹ bảo anh có về không?' },
    { speaker: 'minh', line: 'Anh đang nghĩ. Ở lại thì thêm tiền. Về thì… anh sợ mình quên mất vì sao lên đây.' },
    { speaker: 'mai', line: 'Chỉ cần anh còn nhớ gọi về là được. Mai chờ.' },
  ],
  'help-accident': [
    { speaker: 'narrator', line: 'Ai đó nằm giữa đường. Minh đứng đó, hai bàn tay run.' },
    { speaker: 'minh', line: 'Nếu dừng lại, mình có thể trễ giờ. Nếu bỏ đi… mình mang theo tiếng phanh cả buổi sáng.' },
    { speaker: 'narrator', line: 'Không có lựa chọn sạch. Chỉ có lựa chọn Minh dám nhận là của mình.' },
  ],
  'friend-in-need': [
    { speaker: 'narrator', line: 'Bạn cần Minh — không phải lời khuyên, mà một lựa chọn.' },
    { speaker: 'huy', line: 'Tớ không muốn làm phiền. Nhưng lúc này… tớ chỉ còn cậu.' },
    { speaker: 'minh', line: 'Nói đi. Tớ nghe. Giúp được bao nhiêu thì giúp — không giúp được thì tớ cũng không giả vờ.' },
  ],
  'myopia-signs': [
    { speaker: 'narrator', line: 'Chữ trên bảng bắt đầu nhòe như sương sớm.' },
    { speaker: 'minh', line: 'Mình cứ nghĩ chỉ cần dụi mắt là hết. Hóa ra cơ thể cũng biết ghi nợ.' },
    { speaker: 'narrator', line: 'Đi khám thì tốn. Bỏ qua thì mỗi trang bài đọc thêm một lớp sương.' },
  ],
  'first-lottery': [
    { speaker: 'narrator', line: 'Gió chiều mang theo tiếng rao vé số gần cổng ký túc.' },
    { speaker: 'ong-tu', line: 'Một tờ lấy may thôi cháu. Đừng đặt cả hy vọng vào nó.' },
    { speaker: 'minh', line: 'Vâng… cháu chỉ muốn thử cảm giác ấy một lần. Việc của cháu vẫn phải tự làm.' },
    { speaker: 'ong-tu', line: 'Tốt. Vé bán hy vọng. Nhưng kế hoạch thì không bán được.' },
  ],
  'family-finance': [
    { speaker: 'narrator', line: 'Tin nhà đến muộn, nhưng đủ nặng.' },
    { speaker: 'mai', line: 'Mẹ bảo không sao… nhưng giọng mẹ không như không sao. Anh đừng giận em kể.' },
    { speaker: 'minh', line: 'Anh không giận. Anh chỉ… chưa biết gửi gì về mà vẫn đủ sống ở đây.' },
    { speaker: 'mai', line: 'Em không đòi anh cứu cả nhà. Em chỉ muốn anh biết là nhà vẫn nghĩ tới anh.' },
  ],
  'internship': [
    { speaker: 'narrator', line: 'Cơ hội thực tập mở ra — và cũng khép lại thời gian nghỉ.' },
    { speaker: 'phong', line: 'Chỗ này không dễ. Em vào được là tốt, nhưng đừng để sức mình cạn trước khi học xong.' },
    { speaker: 'minh', line: 'Em hiểu. Em muốn thử… vì sợ bỏ lỡ, cũng sợ mình chưa sẵn sàng.' },
  ],
  'phong-crisis': [
    { speaker: 'narrator', line: 'Phong không còn cười như ngày giới thiệu việc làm thêm.' },
    { speaker: 'phong', line: 'Anh chỉ… đứng dậy không nổi một lúc. Đừng nhìn anh như người thất bại.' },
    { speaker: 'minh', line: 'Anh không thất bại. Anh đang trả giá. Em… em có thể giúp gì được không?' },
    { speaker: 'phong', line: 'Giúp anh nhớ rằng tiền không đáng đổi lấy cả người. Em cũng nhớ giúp anh.' },
  ],
  'lost-money': [
    { speaker: 'narrator', line: 'Túi nhẹ đi. Lòng cũng vậy.' },
    { speaker: 'minh', line: 'Vừa mới cầm… rồi không còn. Thành phố nuốt tiền im hơn cả nuốt tiếng bước chân.' },
    { speaker: 'narrator', line: 'Khi tinh thần thấp, sơ suất trở thành vết cắt thật.' },
  ],
  'family-conflict': [
    { speaker: 'narrator', line: 'Giọng qua điện thoại có góc cạnh lạ — không còn chỉ là hỏi thăm.' },
    { speaker: 'mai', line: 'Cha bảo anh quên nhà. Mẹ bảo anh quên bản thân. Em… em không biết đứng bên nào.' },
    { speaker: 'minh', line: 'Anh không quên. Anh chỉ đang cố không làm mọi người thất vọng cùng một lúc.' },
    { speaker: 'mai', line: 'Vậy thì nói thật với họ. Im lặng lâu quá cũng thành một kiểu trả lời.' },
  ],
  'rooftop-night': [
    { speaker: 'narrator', line: 'Sân thượng im. Gió lạnh hơn những gì Minh chuẩn bị.' },
    { speaker: 'minh', line: 'Nếu không ai tới… mình có còn muốn tiếp tục không?' },
    { speaker: 'narrator', line: 'Đây không phải màn bỏ lượt. Đây là câu hỏi về cả hành trình.' },
    { speaker: 'minh', line: 'Mình sẽ chọn. Dù chọn đứng dậy, hay chọn dừng lại.' },
  ],
  'final-year-direction': [
    { speaker: 'narrator', line: 'Năm cuối hỏi thẳng: Minh muốn đi đâu?' },
    { speaker: 'lan', line: 'Cậu không cần trả lời đúng. Cậu cần trả lời thật — rồi chịu trách nhiệm với nó.' },
    { speaker: 'minh', line: 'Thật thì… mình sợ chọn một thứ là đánh mất những thứ còn lại.' },
    { speaker: 'lan', line: 'Mọi người đều sợ. Khác nhau ở chỗ có dám viết tiếp sau khi sợ.' },
  ],
  'graduation-exam': [
    { speaker: 'narrator', line: 'Bút chì, giấy nháp, và bốn năm dồn lại một buổi.' },
    { speaker: 'minh', line: 'Không còn chỗ để trì hoãn. Chỉ còn chỗ để nhớ mình đã học gì — và bỏ gì.' },
    { speaker: 'narrator', line: 'Chuông hết giờ không chờ ai hoàn thành câu chuyện của mình.' },
  ],
  'job-offer': [
    { speaker: 'narrator', line: 'Một lời mời việc — cửa mở, cũng là cửa chọn.' },
    { speaker: 'phong', line: 'Em nhận không cũng được. Nhưng hãy hỏi: chỗ này nuôi em, hay chỉ nuôi cái sợ thất nghiệp?' },
    { speaker: 'minh', line: 'Em sẽ đọc kỹ. Em không muốn bước vào một cánh cửa chỉ vì sợ đứng ngoài.' },
  ],
  'final-debt': [
    { speaker: 'narrator', line: 'Con số nợ không ngủ. Minh cũng khó ngủ.' },
    { speaker: 'minh', line: 'Trả bằng tiền. Trả bằng sức. Hay trả bằng cả mối quan hệ… đều có giá.' },
    { speaker: 'narrator', line: 'Khoản nợ cuối không chỉ hỏi ví. Nó hỏi Minh còn giữ được gì sau khi trả.' },
  ],
  'last-tet': [
    { speaker: 'narrator', line: 'Tết cuối đời sinh viên. Bàn ăn quê chờ một chỗ trống.' },
    { speaker: 'mai', line: 'Lần này khác năm nhất. Anh không còn là đứa mới lên phố nữa.' },
    { speaker: 'minh', line: 'Đúng. Lần này anh về — hay ở lại — sẽ nói anh đã trở thành người như thế nào.' },
    { speaker: 'mai', line: 'Dù sao thì cửa nhà vẫn mở. Em chỉ mong anh còn biết đường về.' },
  ],
  graduation: [
    { speaker: 'narrator', line: 'Áo cử nhân mỏng, nhưng đủ để che bốn năm dài.' },
    { speaker: 'lan', line: 'Cậu tới được đây. Không hoàn hảo — nhưng là thật.' },
    { speaker: 'huy', line: 'Ối! Nhìn kìa! Cậu đừng khóc trên sân khấu nghe chưa!' },
    { speaker: 'minh', line: 'Mình… mình chỉ muốn nói cảm ơn. Với những ai còn đứng đây.' },
  ],
};


/** Hội thoại mở đầu cho 12 tình huống bất ngờ. Choice chỉ hiện sau beat cuối. */
export const surpriseDialogues: Record<string, SurpriseDialogueBeat[]> = {
  'pop-quiz': [
    { speaker: 'narrator', line: 'Giảng viên đặt xấp đề xuống bàn khi cả lớp chưa kịp mở vở.' },
    { speaker: 'lan', line: 'Kiểm tra đột xuất đấy. Cậu bình tĩnh, nhớ được gì thì làm chắc phần đó.' },
    { speaker: 'minh', line: 'Mình có vài cách để vượt qua tiết này. Cách nào cũng để lại một điều phải chịu.' },
  ],
  'lost-group-file': [
    { speaker: 'narrator', line: 'Thư mục bài nhóm mở ra trống rỗng. Bản nộp chỉ còn cách vài giờ.' },
    { speaker: 'lan', line: 'Tớ đã tìm cả thùng rác và lịch sử đồng bộ. Không còn bản nào nguyên vẹn.' },
    { speaker: 'minh', line: 'Trách nhau lúc này không cứu được bài. Nhưng cách cứu bài cũng có giá.' },
  ],
  'job-scam': [
    { speaker: 'narrator', line: 'Một tin nhắn hứa mức lương khó tin, kèm yêu cầu đóng phí ngay tối nay.' },
    { speaker: 'phong', line: 'Việc thật không cần em trả tiền để được nhận. Nhưng lúc thiếu tiền, lời hứa nghe rất ngọt.' },
    { speaker: 'minh', line: 'Nếu bỏ qua, mình có thể mất cơ hội. Nếu tin vội, thứ mất có thể nhiều hơn.' },
  ],
  'food-poisoning': [
    { speaker: 'narrator', line: 'Nửa đêm, cơn đau bụng kéo Minh tỉnh dậy giữa căn phòng tối.' },
    { speaker: 'huy', line: 'Cậu tái lắm. Đừng cố chịu một mình — nói tớ biết cậu muốn làm gì.' },
    { speaker: 'minh', line: 'Ngày mai còn lịch học và ca làm. Nhưng trước hết mình phải quyết định đối xử với cơ thể thế nào.' },
  ],
  'exercise-injury': [
    { speaker: 'narrator', line: 'Một bước tiếp đất lệch khiến cơn đau chạy dọc chân Minh.' },
    { speaker: 'huy', line: 'Dừng lại đã. Cố thêm một vòng không chứng minh được gì đâu.' },
    { speaker: 'minh', line: 'Nghỉ sẽ mất nhịp, đi khám sẽ tốn tiền. Tập tiếp có thể khiến cái giá lớn hơn.' },
  ],
  'lan-rumor': [
    { speaker: 'narrator', line: 'Một câu đùa trong nhóm lớp biến thành tin đồn về Minh và Lan.' },
    { speaker: 'lan', line: 'Tớ không muốn người khác quyết định câu chuyện của hai đứa. Nhưng im lặng cũng có thể bị hiểu khác.' },
    { speaker: 'minh', line: 'Mình cần nghĩ tới cảm xúc của Lan, không chỉ cách thoát khỏi ánh mắt mọi người.' },
  ],
  'forgotten-birthday': [
    { speaker: 'narrator', line: 'Ngày sắp hết. Không tin nhắn nào nhắc tới sinh nhật Minh.' },
    { speaker: 'minh', line: 'Có lẽ mọi người chỉ bận. Có lẽ mình không cần xem chuyện này quan trọng.' },
    { speaker: 'narrator', line: 'Buồn không buộc Minh phải trách ai. Minh vẫn phải chọn cách chăm sóc cảm xúc ấy.' },
  ],
  'found-wallet': [
    { speaker: 'narrator', line: 'Một chiếc ví nằm dưới ghế đá, bên trong có tiền và giấy tờ.' },
    { speaker: 'minh', line: 'Số tiền này đủ giải quyết vài chuyện trước mắt. Chủ ví chắc cũng đang cuống cuồng tìm.' },
    { speaker: 'narrator', line: 'Không ai đứng gần để nhìn. Lựa chọn vẫn đi cùng Minh sau khi rời khỏi đây.' },
  ],
  'wage-theft': [
    { speaker: 'narrator', line: 'Ngày trả lương qua rồi. Chủ quán lại hẹn Minh sang tháng.' },
    { speaker: 'phong', line: 'Em cần tiền, nhưng họ cũng biết em sợ mất việc. Đừng để lời hẹn thay cho bằng chứng.' },
    { speaker: 'minh', line: 'Đòi tới cùng có thể mất ca làm. Chờ tiếp thì mọi kế hoạch đều treo lại.' },
  ],
  'small-lottery-win': [
    { speaker: 'narrator', line: 'Dãy số trùng nhau. Không đủ đổi đời, nhưng đủ khiến căn phòng bỗng sáng hơn.' },
    { speaker: 'ong-tu', line: 'Có lộc thì mừng, cháu. Chỉ đừng để một lần trúng thành lý do mua thêm mãi.' },
    { speaker: 'minh', line: 'Khoản tiền này có thể vá một lỗ hổng, chia sẻ, hoặc kéo mình sâu hơn vào vận may.' },
  ],
  'account-hijack': [
    { speaker: 'narrator', line: 'Mật khẩu bị đổi. Tin nhắn lạ đang được gửi từ tài khoản của Minh.' },
    { speaker: 'huy', line: 'Khóa phiên đăng nhập trước. Mỗi phút chậm là thêm một người có thể bị lừa.' },
    { speaker: 'minh', line: 'Mình phải giành lại tài khoản, rồi quyết định có nói thật với mọi người không.' },
  ],
  'elevator-stuck': [
    { speaker: 'narrator', line: 'Thang máy giật nhẹ rồi đứng im. Đèn khẩn cấp phủ cả nhóm màu vàng nhạt.' },
    { speaker: 'huy', line: 'Không có sóng mạnh. Ai đó bấm chuông cứu hộ, còn lại đừng chen vào cửa.' },
    { speaker: 'minh', line: 'Không gian càng chật, ai cũng càng dễ hoảng. Mình cần giữ cả nhóm bình tĩnh.' },
  ],
};

export const activityScenes: Record<string, { bg: BackgroundId; cast: PortraitId[]; vibe: string }> = {
  study: { bg: 'classroom', cast: ['minh', 'lan'], vibe: 'Bàn học tối nay còn trống một góc.' },
  part_time: { bg: 'campus', cast: ['minh', 'phong'], vibe: 'Ca làm thêm đang chờ ngoài cổng trường.' },
  skill_training: { bg: 'classroom', cast: ['minh'], vibe: 'Mỗi kỹ năng nhỏ cũng là hành trang.' },
  exercise: { bg: 'campus', cast: ['minh', 'huy'], vibe: 'Sân trường dịu lại sau giờ học.' },
  rest: { bg: 'dorm', cast: ['minh', 'huy'], vibe: 'Căn phòng nhỏ, đủ để thở.' },
  gaming: { bg: 'dorm', cast: ['minh', 'huy'], vibe: 'Huy đã bật máy sẵn từ lúc nào.' },
  socialize: { bg: 'campus', cast: ['minh', 'lan', 'huy'], vibe: 'Có người đang chờ Minh ngoài hành lang.' },
  family: { bg: 'dorm', cast: ['minh', 'mai'], vibe: 'Điện thoại rung nhẹ — tin từ nhà.' },
  borrow: { bg: 'campus', cast: ['minh', 'phong'], vibe: 'Vay hôm nay, nợ ngày mai.' },
  lottery: { bg: 'campus', cast: ['minh', 'ong-tu'], vibe: 'Tờ vé mỏng, hy vọng thì không mỏng.' },
};

export const eventScenes: Record<string, { bg: BackgroundId; cast: PortraitId[]; line: string }> = {
  'first-test': { bg: 'classroom', cast: ['minh', 'lan'], line: 'Bài kiểm tra đầu tiên. Tim Minh đập nhanh hơn mực trên giấy.' },
  'traffic-accident': { bg: 'campus', cast: ['minh'], line: 'Tiếng phanh xe cắt ngang chiều về ký túc.' },
  'first-tet-away': { bg: 'dorm', cast: ['minh', 'mai'], line: 'Tết đầu tiên xa nhà. Màn hình điện thoại sáng hơn bàn thờ quê.' },
  'help-accident': { bg: 'campus', cast: ['minh'], line: 'Ai đó nằm giữa đường. Minh đứng đó, hai bàn tay run.' },
  'friend-in-need': { bg: 'dorm', cast: ['minh', 'huy'], line: 'Bạn cần Minh — không phải lời khuyên, mà một lựa chọn.' },
  'myopia-signs': { bg: 'classroom', cast: ['minh'], line: 'Chữ trên bảng bắt đầu nhòe như sương sớm.' },
  'first-lottery': { bg: 'campus', cast: ['minh', 'ong-tu'], line: 'Ông Tư chìa tờ vé. “Thử một lần cũng được.”' },
  'family-finance': { bg: 'dorm', cast: ['minh', 'mai'], line: 'Tin nhà đến muộn, nhưng đủ nặng.' },
  'internship': { bg: 'classroom', cast: ['minh', 'phong'], line: 'Cơ hội thực tập mở ra — và cũng khép lại thời gian học.' },
  'phong-crisis': { bg: 'campus', cast: ['minh', 'phong'], line: 'Phong không còn cười như ngày giới thiệu việc làm thêm.' },
  'lost-money': { bg: 'campus', cast: ['minh'], line: 'Túi nhẹ đi. Lòng cũng vậy.' },
  'family-conflict': { bg: 'dorm', cast: ['minh', 'mai'], line: 'Giọng cha mẹ qua điện thoại có góc cạnh lạ.' },
  'rooftop-night': { bg: 'campus', cast: ['minh'], line: 'Sân thượng im. Gió lạnh hơn những gì Minh chuẩn bị.' },
  'final-year-direction': { bg: 'classroom', cast: ['minh', 'lan'], line: 'Năm cuối hỏi thẳng: Minh muốn đi đâu?' },
  'graduation-exam': { bg: 'classroom', cast: ['minh'], line: 'Bút chì, giấy nháp, và bốn năm dồn lại một buổi.' },
  'job-offer': { bg: 'campus', cast: ['minh', 'phong'], line: 'Một lời mời việc — cửa mở, cũng là cửa chọn.' },
  'final-debt': { bg: 'dorm', cast: ['minh'], line: 'Con số nợ không ngủ. Minh cũng khó ngủ.' },
  'last-tet': { bg: 'dorm', cast: ['minh', 'mai'], line: 'Tết cuối đời sinh viên. Bàn ăn quê chờ một chỗ trống.' },
  graduation: { bg: 'campus', cast: ['minh', 'lan', 'huy'], line: 'Áo cử nhân mỏng, nhưng đủ để che bốn năm dài.' },
};
