# Truy vết cốt truyện

Nguồn chuẩn: `docs/product/game-story.md`. Báo cáo legacy nằm tại `docs/product/legacy-audit.md`; save migration vẫn hỗ trợ key cũ.

## Nhân vật

| Yêu cầu | Content đích | Trạng thái legacy |
|---|---|---|
| Minh, nam, 18 tuổi | `characters/minh` | Cho đổi tên/giới tính; phải thay |
| Lan | `characters/lan` | Có, quan hệ gộp |
| Huy | `characters/huy` | Đang là Đức; phải thay |
| Phong | `characters/phong` | Thiếu |
| Mai | `characters/mai` | Thiếu |
| Ông Tư | `characters/ong-tu` | Thiếu |
| Cha, mẹ | `characters/father`, `characters/mother` | Thiếu |

## Vòng chơi

- 48 tháng, bốn năm; mỗi tháng đúng 2 action point.
- Hoạt động bắt buộc: `study`, `part_time`, `skill_training`, `exercise`, `rest`, `gaming`, `socialize`, `family`, `borrow`, `lottery`.
- Mọi hoạt động khai báo effect, cost, trait progress và delayed consequence trong cùng record content.
- Quan hệ riêng: Lan, Huy, Phong, gia đình. Chỉ số quan hệ tổng quan ban đầu 15 được phân bổ làm giá trị ban đầu cho từng quan hệ.
- Trait: `disciplined`, `workaholic`, `empathetic`, `avoidant`, `gambler`, `reliable`, `familyOriented`.

## Sự kiện bắt buộc

| Năm | Sự kiện | Điều kiện xuất hiện được validator kiểm tra |
|---|---|---|
| 1 | Bài kiểm tra đầu tiên | Mốc tháng 3 |
| 1 | Tai nạn giao thông | Mốc tháng 7 |
| 1 | Tết đầu tiên xa nhà | Mốc tháng 12 |
| 2 | Gặp người bị tai nạn | Mốc tháng 14 |
| 2 | Bạn bè gặp khó khăn | Mốc tháng 17 |
| 2 | Dấu hiệu cận thị | Prerequisite hành vi/rủi ro; pity trước hết năm 2 |
| 2 | Vé số đầu tiên | Mốc tháng 20; gặp Ông Tư |
| 2 | Gia đình khó khăn tài chính | Mốc tháng 24 |
| 3 | Cơ hội thực tập | Mốc tháng 27 |
| 3 | Khủng hoảng của Phong | Mốc tháng 30 |
| 3 | Đánh rơi tiền | Mốc tháng 32; prerequisite tinh thần thấp hoặc weighted fallback |
| 3 | Xung đột gia đình | Mốc tháng 34 |
| 3 | Đêm trên sân thượng | Mốc tháng 35; nội dung an toàn, cảnh báo và hỗ trợ locale |
| 3 | Chọn hướng năm cuối | Mốc tháng 36 |
| 4 | Kỳ thi tốt nghiệp | Mốc tháng 44 |
| 4 | Lời mời làm việc | Mốc tháng 45 |
| 4 | Khoản nợ cuối | Mốc tháng 46 |
| 4 | Tết cuối sinh viên | Mốc tháng 47 |
| 4 | Lễ tốt nghiệp | Mốc tháng 48 |

## Ending

| ID | Nhóm | Tín hiệu chính | Priority |
|---|---|---|---:|
| `stop_midway` | bad | Xác nhận bỏ hành trình | 1400 |
| `room_without_light` | bad | spirit = 0 | 1390 |
| `debt_spiral` | bad | debt ngưỡng vỡ nợ | 1380 |
| `body_speaks` | bad | health = 0 | 1370 |
| `crossing_the_line` | bad | morality = 0 và vi phạm đã chọn | 1360 |
| `cannot_graduate` | bad | Không đủ điều kiện tốt nghiệp | 1350 |
| `alone_in_the_city` | bad | Mọi quan hệ thấp | 1340 |
| `life_changing_jackpot` | happy | Jackpot + năng lực và ổn định | 1200 |
| `four_years_well_spent` | happy | Tốt nghiệp, cân bằng, quan hệ tốt | 1190 |
| `success_from_hospital_bed` | neutral | Thành công nghề nghiệp, sức khỏe/tinh thần thấp | 1080 |
| `lucky_player` | neutral | Lãi vé số, không lệ thuộc cờ bạc | 1070 |
| `freelancer` | neutral | Hướng freelancer + skill/knowledge | 1060 |
| `return_home` | neutral | Hướng về quê + gia đình tốt | 1050 |
| `university_degree` | neutral | Tốt nghiệp, fallback duy nhất | 1000 |

Ending resolver sắp theo `priority`, đồng thời validator cấm priority trùng. Mỗi ending có fixture riêng và assertion resolver chỉ trả đúng ID mong đợi.

## Quy tắc nội dung

- Choice label và effect cùng một object; UI render mô tả từ effect hoặc `effectSummary` được test đối chiếu.
- `stop_midway` chỉ qua command xác nhận riêng. Skip thoại chỉ hoàn tất đoạn đang gõ nếu đoạn đã từng được đọc.
- Nội dung tinh thần thấp không mô tả phương thức tự hại. Hiện content warning trước cảnh và thông tin hỗ trợ theo locale.
