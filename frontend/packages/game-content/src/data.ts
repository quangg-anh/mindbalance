import type { GameContent } from './schema.js';
const delayed=[] as const;
export const characters=[
{id:'minh',name:'Minh',role:'Sinh viên, nam, 18 tuổi'},{id:'lan',name:'Lan',role:'Bạn cùng lớp'},{id:'huy',name:'Huy',role:'Bạn cùng phòng'},{id:'phong',name:'Phong',role:'Sinh viên khóa trên'},{id:'mai',name:'Mai',role:'Em gái'},{id:'ong-tu',name:'Ông Tư',role:'Người bán vé số'},{id:'father',name:'Cha',role:'Cha Minh'},{id:'mother',name:'Mẹ',role:'Mẹ Minh'}];
export const activities=[
['study','Học tập','Tăng kiến thức, hao sức',{stats:{knowledge:7,health:-2,spirit:-1},traits:{disciplined:2}}],
['part_time','Làm thêm','Kiếm tiền, tích kỹ năng',{stats:{money:12,skill:3,health:-3,spirit:-2},traits:{workaholic:2}}],
['skill_training','Rèn kỹ năng','Chuẩn bị nghề nghiệp',{stats:{skill:7,money:-4,spirit:-1},traits:{reliable:2}}],
['exercise','Tập thể dục','Phục hồi thể chất',{stats:{health:8,spirit:2,money:-1},traits:{disciplined:1}}],
['rest','Nghỉ ngơi','Phục hồi cân bằng',{stats:{health:4,spirit:7},traits:{avoidant:1}}],
['gaming','Chơi game','Giải trí cùng Huy',{stats:{spirit:5,knowledge:-2,money:-2},relationships:{huy:3},traits:{avoidant:2}}],
['socialize','Giao lưu','Nuôi dưỡng bạn bè',{stats:{spirit:4,money:-4},relationships:{lan:2,huy:2,phong:1},traits:{empathetic:2}}],
['family','Gia đình','Gọi điện và gửi quà',{stats:{spirit:3,money:-3},relationships:{family:6},traits:{familyOriented:3}}],
['borrow','Vay tiền','Giải quyết thiếu hụt trước mắt',{stats:{money:15,debt:18,spirit:-2},traits:{avoidant:2}}],
['lottery','Mua vé số','Thử vận may có kiểm soát',{stats:{money:-2},traits:{gambler:3},flags:{boughtLottery:true}}]
].map(([id,name,description,effects])=>({id,name,description,effects,delayed:id==='part_time'?[{afterMonths:2,effects:{stats:{health:-2}}}]:delayed})) as GameContent['activities'];
const event=(id:string,title:string,month:number,summary='Lựa chọn có trách nhiệm')=>({id,title,month,deadline:month,weight:10,prerequisite:[],cooldown:0,oneShot:true,mandatory:true,choices:[{id:'continue',label:'Đối mặt',effectSummary:summary,effects:{stats:{spirit:1,morality:1}},delayed:[]} ]});
export const events:GameContent['events']=[event('first-test','Bài kiểm tra đầu tiên',3),event('traffic-accident','Tai nạn giao thông',7),event('first-tet-away','Tết đầu tiên xa nhà',12),event('help-accident','Gặp người bị tai nạn',14),event('friend-in-need','Bạn bè gặp khó khăn',17),{...event('myopia-signs','Dấu hiệu cận thị',23),month:undefined,prerequisite:[{field:'flags.riskMyopia',op:'eq',value:true}]},event('first-lottery','Vé số đầu tiên',20),event('family-finance','Gia đình khó khăn tài chính',24),event('internship','Cơ hội thực tập',27),event('phong-crisis','Khủng hoảng của Phong',30),{...event('lost-money','Đánh rơi tiền',32),prerequisite:[{field:'stats.spirit',op:'lte',value:45}]},event('family-conflict','Xung đột gia đình',34),{...event('rooftop-night','Đêm trên sân thượng',35,'Tìm hỗ trợ và tiếp tục an toàn'),warning:'Nội dung nói về khủng hoảng tinh thần. Có thể bỏ qua cảnh; hãy liên hệ người tin cậy hoặc dịch vụ khẩn cấp địa phương nếu cần.'},event('final-year-direction','Chọn hướng năm cuối',36),event('graduation-exam','Kỳ thi tốt nghiệp',44),event('job-offer','Lời mời làm việc',45),event('final-debt','Khoản nợ cuối',46),event('last-tet','Tết cuối sinh viên',47),event('graduation','Lễ tốt nghiệp',48)];
const E=(id:string,name:string,group:'bad'|'happy'|'neutral',priority:number,field:string,op:'eq'|'gte'|'lte',value:number|string|boolean)=>({id,name,group,priority,conditions:[{field,op,value}]});
export const endings:GameContent['endings']=[E('stop_midway','Dừng lại giữa đường','bad',1400,'flags.stopped','eq',true),E('room_without_light','Căn phòng không còn ánh sáng','bad',1390,'stats.spirit','lte',0),E('debt_spiral','Vòng xoáy nợ nần','bad',1380,'stats.debt','gte',100),E('body_speaks','Cơ thể lên tiếng','bad',1370,'stats.health','lte',0),E('crossing_the_line','Bước qua giới hạn','bad',1360,'flags.illegalAct','eq',true),E('cannot_graduate','Không thể tốt nghiệp','bad',1350,'flags.cannotGraduate','eq',true),E('alone_in_the_city','Một mình giữa thành phố','bad',1340,'flags.allRelationshipsLow','eq',true),E('life_changing_jackpot','Một lần đổi đời','happy',1200,'flags.jackpotStable','eq',true),E('four_years_well_spent','Bốn năm không uổng phí','happy',1190,'flags.balancedSuccess','eq',true),E('success_from_hospital_bed','Thành công trên chiếc giường bệnh','neutral',1080,'flags.successUnwell','eq',true),E('lucky_player','Người thắng cuộc chơi may rủi','neutral',1070,'flags.lotteryProfit','eq',true),E('freelancer','Freelancer tự do','neutral',1060,'flags.freelancer','eq',true),E('return_home','Trở về','neutral',1050,'flags.returnHome','eq',true),E('university_degree','Tấm bằng đại học','neutral',1000,'flags.graduated','eq',true)];
export const seasons:GameContent['seasons']=[
  {id:'enroll',name:'Mùa nhập học',hint:'Bốn năm bắt đầu bằng một cánh cửa lạ.'},
  {id:'challenge',name:'Mùa thử thách',hint:'Mọi thứ trầm hơn, nhanh hơn, và thật hơn.'},
  {id:'growth',name:'Mùa trưởng thành',hint:'Lựa chọn giờ có trọng lượng riêng.'},
  {id:'reunion',name:'Mùa sum họp',hint:'Ai ở lại, ai ra đi — và mình trở thành ai.'},
];
export const content:GameContent={characters,activities,events,endings,seasons};
