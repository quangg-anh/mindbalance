import type { GameContent } from './schema.js';
const delayed=[] as const;
export const characters=[
{id:'minh',name:'Minh',role:'Sinh viên, nam, 18 tuổi'},{id:'lan',name:'Lan',role:'Bạn cùng lớp'},{id:'huy',name:'Huy',role:'Bạn cùng phòng'},{id:'phong',name:'Phong',role:'Sinh viên khóa trên'},{id:'mai',name:'Mai',role:'Em gái'},{id:'ong-tu',name:'Ông Tư',role:'Người bán vé số'},{id:'father',name:'Cha',role:'Cha Minh'},{id:'mother',name:'Mẹ',role:'Mẹ Minh'}];
export const activities=[
['study','Học tập','Tăng kiến thức, hao sức',{stats:{knowledge:7,health:-2,spirit:-1},traits:{disciplined:2},flags:{riskMyopia:true}}],
['part_time','Làm thêm','Kiếm tiền, tích kỹ năng',{stats:{money:12,skill:3,health:-3,spirit:-2},traits:{workaholic:2}}],
['skill_training','Rèn kỹ năng','Chuẩn bị nghề nghiệp',{stats:{skill:7,money:-4,spirit:-1},traits:{reliable:2}}],
['exercise','Tập thể dục','Phục hồi thể chất',{stats:{health:8,spirit:2,money:-1},traits:{disciplined:1}}],
['rest','Nghỉ ngơi','Phục hồi cân bằng',{stats:{health:4,spirit:7},traits:{avoidant:1}}],
['gaming','Chơi game','Giải trí cùng Huy',{stats:{spirit:5,knowledge:-2,money:-2},relationships:{huy:3},traits:{avoidant:2}}],
['socialize','Giao lưu','Nuôi dưỡng bạn bè',{stats:{spirit:4,money:-4},relationships:{lan:2,huy:2,phong:1},traits:{empathetic:2}}],
['family','Gia đình','Gọi điện và gửi quà',{stats:{spirit:3,money:-3},relationships:{family:6},traits:{familyOriented:3}}],
['borrow','Vay tiền','Cùng Phong rà phương án vay chính thức',{stats:{money:15,debt:18,spirit:-2},traits:{avoidant:2}}],
['lottery','Mua vé số','Thử vận may có kiểm soát',{stats:{money:-2},traits:{gambler:3},flags:{boughtLottery:true}}]
].map(([id,name,description,effects])=>({id,name,description,effects,delayed:id==='part_time'?[{afterMonths:2,effects:{stats:{health:-2}},source:'activity:part_time',prose:'Những ca làm Phong từng giới thiệu để lại cơn mỏi kéo dài.'}]:delayed})) as GameContent['activities'];
const base={weight:10,cooldown:0,oneShot:true,mandatory:true} as const;
export const events:GameContent['events']=[
  {...base,id:'first-test',title:'Bài kiểm tra đầu tiên',month:3,deadline:3,prerequisite:[],choices:[
    {id:'prepare',label:'Ôn cùng Lan',effectSummary:'Hiểu bài hơn, bớt thời gian nghỉ',effects:{stats:{knowledge:8,spirit:-3},relationships:{lan:4}},delayed:[]},
    {id:'work-shift',label:'Giữ ca làm thêm',effectSummary:'Có tiền nhưng hụt kiến thức',effects:{stats:{money:10,knowledge:-5,health:-2}},delayed:[]},
    {id:'cheat',label:'Dùng tài liệu trái quy định',effectSummary:'Điểm trước mắt đổi lấy mất niềm tin học thuật',effects:{stats:{knowledge:3,morality:-18},flags:{academicLie:true}},delayed:[]}]},
  {...base,id:'traffic-accident',title:'Tai nạn giao thông',month:7,deadline:7,prerequisite:[],choices:[
    {id:'call-help',label:'Gọi hỗ trợ sau cú va quệt',effectSummary:'Minh được kiểm tra an toàn, tốn viện phí và buổi học',effects:{stats:{money:-10,health:-7,knowledge:-3,spirit:-2},flags:{receivedAccidentHelp:true}},delayed:[]},
    {id:'leave',label:'Tự về phòng sau cú va quệt',effectSummary:'Tránh viện phí trước mắt, cơn đau kéo dài',effects:{stats:{health:-14,spirit:-5},flags:{receivedAccidentHelp:false}},delayed:[{afterMonths:2,effects:{stats:{health:-4}},source:'traffic-accident:leave',prose:'Cú va quệt Minh từng bỏ qua khiến chỗ đau tái lại.'}]}]},
  {...base,id:'first-tet-away',title:'Tết đầu tiên xa nhà',month:12,deadline:12,prerequisite:[],choices:[
    {id:'return',label:'Về nhà',effectSummary:'Ấm quan hệ, tốn tiền đi lại',effects:{stats:{money:-12,spirit:8},relationships:{family:10}},delayed:[]},
    {id:'stay-work',label:'Ở lại nhận ca',effectSummary:'Tăng thu nhập, xa gia đình',effects:{stats:{money:18,health:-4,spirit:-5},relationships:{family:-6}},delayed:[]}]},
  {...base,id:'help-accident',title:'Gặp người bị tai nạn',month:14,deadline:14,prerequisite:[],choices:[
    {id:'escort',label:'Đưa người bị nạn đi khám',effectSummary:'Tốn tiền và sức, giữ trách nhiệm',effects:{stats:{money:-8,health:-3,morality:8}},delayed:[]},
    {id:'delegate',label:'Gọi người hỗ trợ rồi đi',effectSummary:'Minh làm điều từng cần người khác làm cho mình',effects:{stats:{morality:3,spirit:1}},delayed:[]}]},
  {...base,id:'friend-in-need',title:'Bạn bè gặp khó khăn',month:17,deadline:17,prerequisite:[],choices:[
    {id:'lend',label:'Cho Huy vay tiền',effectSummary:'Giúp bạn, quỹ cá nhân mỏng đi',effects:{stats:{money:-15},relationships:{huy:10}},delayed:[{afterMonths:3,effects:{stats:{money:8}}}]},
    {id:'find-work',label:'Cùng Huy tìm việc',effectSummary:'Tốn sức, hai người thêm kỹ năng',effects:{stats:{health:-4,skill:5},relationships:{huy:6}},delayed:[]},
    {id:'refuse',label:'Từ chối để giữ ngân sách',effectSummary:'An toàn tài chính, tình bạn nguội đi',effects:{stats:{money:3},relationships:{huy:-12}},delayed:[]}]},
  {...base,id:'myopia-signs',title:'Dấu hiệu cận thị',month:undefined,deadline:23,prerequisite:[{field:'flags.riskMyopia',op:'eq',value:true}],choices:[
    {id:'exam',label:'Đi khám mắt',effectSummary:'Tốn tiền, bảo vệ sức khỏe học tập',effects:{stats:{money:-10,health:5,knowledge:2}},delayed:[]},
    {id:'delay',label:'Trì hoãn đến hết kỳ',effectSummary:'Giữ tiền, mắt và tinh thần mệt hơn',effects:{stats:{health:-7,spirit:-3,knowledge:-2}},delayed:[]}]},
  {...base,id:'first-lottery',title:'Vé số đầu tiên',month:20,deadline:20,prerequisite:[],choices:[
    {id:'buy-one',label:'Mua một tờ',effectSummary:'Mất khoản nhỏ; mở khả năng surprise xổ số',effects:{stats:{money:-2},traits:{gambler:2},flags:{boughtLottery:true}},delayed:[]},
    {id:'decline',label:'Từ chối mua',effectSummary:'Giữ tiền cho kế hoạch hiện tại',effects:{stats:{spirit:1},traits:{disciplined:1}},delayed:[]},
    {id:'buy-many',label:'Mua nhiều tờ',effectSummary:'Tăng thói quen đánh cược, không bảo đảm trúng',effects:{stats:{money:-12,spirit:1},traits:{gambler:10},flags:{boughtLottery:true}},delayed:[]},
    {id:'ask-ong-tu',label:'Hỏi Ông Tư về vận may',effectSummary:'Chưa mua; nhận lời nhắc đừng thay kế hoạch bằng hy vọng',effects:{stats:{knowledge:1,spirit:2},traits:{disciplined:1}},delayed:[]}]},
  {...base,id:'family-finance',title:'Gia đình khó khăn tài chính',month:24,deadline:24,prerequisite:[],choices:[
    {id:'send-money',label:'Gửi phần lớn tiền về nhà',effectSummary:'Gia đình nhẹ gánh, bản thân dễ thiếu hụt',effects:{stats:{money:-25,spirit:-2},relationships:{family:12}},delayed:[]},
    {id:'budget',label:'Cùng nhà lập kế hoạch chi tiêu',effectSummary:'Ít tiền tức thời, quan hệ và kỹ năng bền hơn',effects:{stats:{skill:5,money:-6},relationships:{family:7}},delayed:[]},
    {id:'avoid',label:'Giấu tình hình của mình',effectSummary:'Giữ tiền, khoảng cách gia đình tăng',effects:{stats:{spirit:-5},relationships:{family:-15}},delayed:[]}]},
  {...base,id:'internship',title:'Cơ hội thực tập Lan giới thiệu',month:27,deadline:27,prerequisite:[],choices:[
    {id:'accept',label:'Nhận thực tập toàn thời gian',effectSummary:'Kỹ năng tăng nhanh, sức khỏe giảm',effects:{stats:{skill:14,health:-10,spirit:-4,money:8}},delayed:[{afterMonths:3,effects:{stats:{skill:5,health:-4}}}]},
    {id:'part-time',label:'Xin lịch bán thời gian',effectSummary:'Tiến chậm hơn nhưng cân bằng',effects:{stats:{skill:8,health:-3,money:4},traits:{reliable:3}},delayed:[]},
    {id:'decline',label:'Từ chối để tập trung học',effectSummary:'Kiến thức tăng, thiếu kinh nghiệm việc làm',effects:{stats:{knowledge:10,skill:-3,spirit:2}},delayed:[]}]},
  {...base,id:'phong-crisis',title:'Khủng hoảng của Phong',month:30,deadline:30,prerequisite:[],choices:[
    {id:'listen',label:'Ở lại lắng nghe và tìm hỗ trợ',effectSummary:'Tốn sức nhưng giữ kết nối an toàn',effects:{stats:{spirit:-4,morality:5},relationships:{phong:14}},delayed:[]},
    {id:'refer',label:'Nhờ người tin cậy hỗ trợ',effectSummary:'Chia sẻ trách nhiệm, Phong có thể hụt hẫng',effects:{relationships:{phong:5},stats:{spirit:-1}},delayed:[]},
    {id:'withdraw',label:'Tránh né cuộc trò chuyện',effectSummary:'Giữ năng lượng trước mắt, quan hệ tổn thương',effects:{relationships:{phong:-18},stats:{spirit:-3}},delayed:[]}]},
  {...base,id:'lost-money',title:'Đánh rơi tiền',month:32,deadline:32,prerequisite:[{field:'stats.spirit',op:'lte',value:45}],choices:[
    {id:'report',label:'Báo nơi đã đi qua',effectSummary:'Tốn thời gian, còn cơ hội tìm lại',effects:{stats:{spirit:-2,morality:2}},delayed:[{afterMonths:1,effects:{stats:{money:8,spirit:2}}}]},
    {id:'borrow',label:'Vay để qua tháng',effectSummary:'Giải quyết tức thời, nợ tăng',effects:{stats:{money:18,debt:24,spirit:-3}},delayed:[]}]},
  {...base,id:'family-conflict',title:'Xung đột gia đình',month:34,deadline:34,prerequisite:[],choices:[
    {id:'mediate',label:'Nói chuyện thẳng thắn',effectSummary:'Hao tinh thần, có cơ hội hàn gắn',effects:{stats:{spirit:-4,morality:3},relationships:{family:9}},delayed:[]},
    {id:'cut-contact',label:'Tạm ngừng liên lạc',effectSummary:'Có khoảng thở, quan hệ giảm mạnh',effects:{stats:{spirit:3},relationships:{family:-25}},delayed:[]},
    {id:'take-blame',label:'Nhận lỗi để kết thúc tranh cãi',effectSummary:'Yên chuyện trước mắt, áp lực kéo dài',effects:{relationships:{family:3},stats:{spirit:-8}},delayed:[]}]},
  {...base,id:'rooftop-night',title:'Đêm trên sân thượng',month:35,deadline:35,prerequisite:[],warning:'Nội dung nói về khủng hoảng tinh thần. Có thể bỏ qua cảnh; hãy liên hệ người tin cậy hoặc dịch vụ khẩn cấp địa phương nếu cần.',choices:[
    {id:'seek-support',label:'Gọi người tin cậy và rời khỏi đó',effectSummary:'Nhận hỗ trợ, tiếp tục hành trình an toàn',effects:{stats:{spirit:10},relationships:{huy:6,lan:4}},delayed:[]},
    {id:'quiet-space',label:'Đến nơi yên tĩnh có người hỗ trợ',effectSummary:'Tạm dừng áp lực, chậm tiến độ',effects:{stats:{health:5,spirit:7,knowledge:-3}},delayed:[]}]},
  {...base,id:'final-year-direction',title:'Kế hoạch năm cuối',month:39,deadline:39,prerequisite:[],choices:[
    {id:'freelance',label:'Làm portfolio nghề tự do',effectSummary:'Đặt kế hoạch freelance; kết quả còn tùy kỹ năng và kinh nghiệm',effects:{stats:{skill:8,money:-8},flags:{planFreelance:true}},delayed:[]},
    {id:'home-plan',label:'Lập phương án trở về quê',effectSummary:'Đặt kế hoạch về nhà; quyết định cuối còn tùy gắn kết gia đình',effects:{stats:{spirit:3},flags:{planReturnHome:true}},delayed:[]},
    {id:'corporate',label:'Hoàn thiện khóa luận và hồ sơ tuyển dụng',effectSummary:'Chuẩn bị kỳ thi và thị trường việc làm',effects:{stats:{knowledge:7,skill:5,health:-4},flags:{planCorporate:true}},delayed:[]}]},
  {...base,id:'graduation-exam',title:'Kỳ thi cuối khóa',month:42,deadline:42,prerequisite:[],choices:[
    {id:'study-plan',label:'Ôn theo kế hoạch',effectSummary:'Tăng cơ hội tốt nghiệp, hao sức vừa phải',effects:{stats:{knowledge:15,health:-5,spirit:-3}},delayed:[]},
    {id:'cram',label:'Học dồn nhiều đêm',effectSummary:'Kiến thức tăng nhanh, sức khỏe tụt mạnh',effects:{stats:{knowledge:18,health:-35,spirit:-8}},delayed:[]},
    {id:'skip',label:'Bỏ kỳ thi để đi làm',effectSummary:'Có thu nhập, không đủ nền tảng tốt nghiệp',effects:{stats:{money:18,knowledge:-45,skill:4}},delayed:[]}]},
  {...base,id:'job-offer',title:'Lời mời làm việc',month:44,deadline:44,prerequisite:[],choices:[
    {id:'healthy-job',label:'Chọn việc có giờ làm bền vững',effectSummary:'Thu nhập vừa, giữ sức khỏe',effects:{stats:{money:15,skill:7,health:3,spirit:3}},delayed:[]},
    {id:'high-pressure',label:'Nhận vị trí lương cao',effectSummary:'Thành công nghề nghiệp đổi bằng sức khỏe',effects:{stats:{money:30,skill:16,knowledge:8,health:-45,spirit:-8}},delayed:[]},
    {id:'illegal-shortcut',label:'Nhận công việc lách luật',effectSummary:'Tiền nhanh, vượt giới hạn pháp lý và đạo đức',effects:{stats:{money:45,morality:-30},flags:{illegalAct:true}},delayed:[]}]},
  {...base,id:'final-debt',title:'Quyết toán cuối hành trình',month:46,deadline:46,prerequisite:[],choices:[
    {id:'repay',label:'Bán bớt đồ để trả nợ',effectSummary:'Nợ giảm, tiền mặt và tinh thần hụt đi',effects:{stats:{debt:-60,money:-20,spirit:-3}},delayed:[]},
    {id:'refinance',label:'Thương lượng lịch trả',effectSummary:'Giảm áp lực tháng này, còn nghĩa vụ dài hạn',effects:{stats:{debt:-15,money:-5,spirit:2}},delayed:[]},
    {id:'new-loan',label:'Vay mới để đảo nợ',effectSummary:'Có tiền tức thời, nợ dễ vượt kiểm soát',effects:{stats:{money:35,debt:110,spirit:-8}},delayed:[]}]},
  {...base,id:'last-tet',title:'Tết trước ngày rời trường',month:47,deadline:47,prerequisite:[],choices:[
    {id:'reconcile',label:'Về nhà và hàn gắn',effectSummary:'Tốn tiền, phục hồi quan hệ',effects:{stats:{money:-15,spirit:8},relationships:{family:15}},delayed:[]},
    {id:'city',label:'Ở lại thành phố hoàn thành việc',effectSummary:'Tăng kỹ năng, xa gia đình và hao sức',effects:{stats:{skill:8,health:-7},relationships:{family:-10}},delayed:[]}]},
  {...base,id:'graduation',title:'Ngày rời trường',month:48,deadline:48,prerequisite:[],choices:[
    {id:'attend',label:'Đến buổi chia tay',effectSummary:'Khép lại bốn năm với người còn giữ liên lạc',effects:{stats:{money:-5,spirit:7}},delayed:[]},
    {id:'work',label:'Rời trường sau ca làm',effectSummary:'Có thêm tiền; tự thu xếp lời chào',effects:{stats:{money:18,spirit:-3}},delayed:[]}]},
];
const E=(id:string,name:string,group:'bad'|'happy'|'neutral',priority:number,field:string,op:'eq'|'gte'|'lte',value:number|string|boolean)=>({id,name,group,priority,conditions:[{field,op,value}]});
export const endings:GameContent['endings']=[E('stop_midway','Dừng lại giữa đường','bad',1400,'flags.stopped','eq',true),E('room_without_light','Căn phòng không còn ánh sáng','bad',1390,'stats.spirit','lte',0),E('debt_spiral','Vòng xoáy nợ nần','bad',1380,'stats.debt','gte',100),E('body_speaks','Cơ thể lên tiếng','bad',1370,'stats.health','lte',0),E('crossing_the_line','Bước qua giới hạn','bad',1360,'flags.illegalAct','eq',true),E('cannot_graduate','Không thể tốt nghiệp','bad',1350,'flags.cannotGraduate','eq',true),E('alone_in_the_city','Một mình giữa thành phố','bad',1340,'flags.allRelationshipsLow','eq',true),E('life_changing_jackpot','Một lần đổi đời','happy',1200,'flags.jackpotStable','eq',true),E('four_years_well_spent','Bốn năm không uổng phí','happy',1190,'flags.balancedSuccess','eq',true),E('success_from_hospital_bed','Thành công trên chiếc giường bệnh','neutral',1080,'flags.successUnwell','eq',true),E('lucky_player','Người thắng cuộc chơi may rủi','neutral',1070,'flags.lotteryProfit','eq',true),E('freelancer','Freelancer tự do','neutral',1060,'flags.freelancer','eq',true),E('return_home','Trở về','neutral',1050,'flags.returnHome','eq',true),E('university_degree','Tấm bằng đại học','neutral',1000,'flags.graduated','eq',true)];
export const seasons:GameContent['seasons']=[
  {id:'enroll',name:'Mùa nhập học',hint:'Bốn năm bắt đầu bằng một cánh cửa lạ.'},
  {id:'challenge',name:'Mùa thử thách',hint:'Mọi thứ trầm hơn, nhanh hơn, và thật hơn.'},
  {id:'growth',name:'Mùa trưởng thành',hint:'Lựa chọn giờ có trọng lượng riêng.'},
  {id:'reunion',name:'Mùa sum họp',hint:'Ai ở lại, ai ra đi — và mình trở thành ai.'},
];
export const content:GameContent={characters,activities,events,endings,seasons};
