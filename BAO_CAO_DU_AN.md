 Báo cáo phân tích dự án — Cuộc Sống Sinh Viên

**Ngày báo cáo:** 22/07/2026  
**Thư mục:** `c:\Users\Quang\OneDrive\Desktop\game`  
**Remote Git:** `https://github.com/quangg-anh/mindbalance.git` (nhánh `main`)  
**Commit gần nhất:** `c5687f0` — *Ver 1* (2026-07-22)

---

## 1. Tóm tắt điều hành

Đây là **visual novel / life-sim sinh viên** dạng **trang web tĩnh** (HTML + CSS + JavaScript thuần), không dùng framework hay engine bên ngoài (Ren'Py, Unity, Phaser…). Người chơi sống qua vòng thời gian đại học (tháng → học kỳ → năm), chọn hành động ưu tiên, gặp sự kiện ngẫu nhiên, thi cuối kỳ, rồi nhận một trong nhiều ending theo chỉ số.

| Hạng mục | Giá trị |
|----------|---------|
| Thể loại | Visual Novel + Time Management |
| Ngôn ngữ giao diện | Tiếng Việt |
| Công nghệ | HTML5, CSS3, Vanilla JS |
| Build tooling | Không có (không npm/webpack) |
| Lưu game | `localStorage` (4 slot) |
| Số node cốt truyện | ~22 |
| Sự kiện ngẫu nhiên | 12 |
| Ending đã định nghĩa | **13** (UI quảng cáo **14**) |
| Chỉ số | 8 (knowledge, skill, health, spirit, money, debt, morality, relationship) |

**Đánh giá nhanh:** Core loop (chọn hành động → event → tăng tháng → thi → tốt nghiệp) đã chạy được end-to-end. Nhiều hệ thống phụ (âm thanh, xổ số, chỉ số `skill`, một số ending) còn **chưa nối đầy đủ** hoặc **không thể đạt**.

---

## 2. Mục tiêu sản phẩm & trải nghiệm người chơi

### 2.1 Concept

- Mô phỏng **4 năm đại học**: học, làm thêm, vui chơi, vay nợ, quan hệ xã hội.
- Mỗi tháng chọn **một ưu tiên**, rồi nhận **sự kiện ngẫu nhiên**.
- Kết thúc bằng **Happy / Neutral / Bad ending** dựa trên chỉ số và flag.

### 2.2 Luồng người chơi (UX)

```
Màn hình tiêu đề
  ├─ Bắt đầu mới → chọn slot → chọn giới tính + tên → intro → vòng lặp chính
  ├─ Tiếp tục → chọn slot đã lưu
  └─ Tùy chỉnh → volume / đồ họa / cỡ chữ
Trong game
  ├─ Dialogue (typing) → click / Space / Enter để tiếp
  ├─ Choices (4 lựa chọn / tháng hoặc event)
  ├─ Profile (xem chỉ số)
  └─ Menu (lưu / settings / về title / bỏ học = Bad End)
Kết thúc → màn Ending + chỉ số cuối → Chơi lại
```

### 2.3 Nhân vật

| Nhân vật | Vai trò | Hiển thị |
|----------|---------|----------|
| Người chơi (Nam/Nữ) | Protagonist, đặt tên tùy ý (mặc định Minh / Mai) | Sprite PNG theo cảm xúc |
| Đức | Bạn cùng phòng | SVG procedural (`makeCharSVG`) |
| Lan | Bạn học / romance light | SVG procedural |
| Thầy Hùng | Giáo viên, sự kiện thi | SVG procedural |

---

## 3. Cấu trúc thư mục

```
game/
├── index.html              # Shell UI: title, modals, game, ending
├── README.md               # Hướng dẫn chạy / deploy (đã lỗi thời một phần)
├── BAO_CAO_DU_AN.md        # File báo cáo này
├── css/
│   └── style.css           # ~188 dòng logic UI + theme tối hồng/tím
├── js/
│   ├── config.js           # GAME_CONFIG: mức chỉ số, giá trị ban đầu
│   ├── stats.js            # StatsManager + flags
│   ├── endings.js          # 13 ending + EndingManager
│   ├── story.js            # STORY_DATA (node graph)
│   ├── engine.js           # VNEngine (~810 dòng) — lõi game
│   └── app.js              # Bootstrap: particles + new VNEngine()
├── assets/images/          # Background SVG/PNG + sprite nhân vật
├── nhân vật/               # Bản gốc / bản dư sprite (không được code tham chiếu)
└── .git/
```

**Không có:** `package.json`, `tests/`, CI, `.gitignore`, thư mục audio, `build-release.sh` (đã bị xóa trên working tree so với commit `Ver 1`).

---

## 4. Kiến trúc kỹ thuật

### 4.1 Mô hình tổng thể

```
┌─────────────┐     DOMContentLoaded      ┌────────────┐
│   app.js    │ ─────────────────────────►│  VNEngine  │
└─────────────┘                           └─────┬──────┘
                                                │
        ┌───────────────┬───────────────┬───────┴────────┐
        ▼               ▼               ▼                ▼
  StatsManager    EndingManager    STORY_DATA      localStorage
  (stats.js)      (endings.js)     (story.js)      vn_slot_0..3
```

Thứ tự load script trong `index.html`:

1. `config.js` → 2. `stats.js` → 3. `endings.js` → 4. `story.js` → 5. `engine.js` → 6. `app.js`

Đây là kiến trúc **global script + class** (không module ES, không bundler).

### 4.2 Vai trò từng module

| File | Vai trò |
|------|---------|
| `config.js` | Ngưỡng level (low/medium/high/extreme), `initialStats`, metadata icon/tên chỉ số |
| `stats.js` | Clamp 0–100, `apply(effects)`, level helpers, serialize/deserialize, flags |
| `endings.js` | Nội dung ending + `checkBadEnding()` / `evaluateFinal()` |
| `story.js` | Graph node: text, background, characters, choices, effects, next |
| `engine.js` | UI binding, typing, time loop, exam/lottery, save/load, sprites, ending screen |
| `app.js` | Particle title + khởi tạo engine |
| `style.css` | Theme, layout fullscreen, modal, dialogue, responsive cơ bản |

### 4.3 Schema node cốt truyện

Mỗi node trong `STORY_DATA` roughly:

```js
{
  id: 'main_loop',
  background: 'dorm_room',      // key → bgImages / fallback gradient
  speaker: 'Đức' | null,        // null = narration
  characters: [{ id, pose, pos }], // hoặc character + pose legacy
  text: '...',
  choices?: [{ text, effects, next, familyPositive? }],
  next?: 'nodeId' | 'advance_time' | 'trigger_random_event',
  isRandomEvent?: true,
  isExam?: true,
  isLottery?: true,
  isEnding?: true,
  chapter?: ..., chapterTitle?: ...
}
```

**Router đặc biệt trong `goToNode()`:**

- `advance_time` → `advanceTime()`
- `trigger_random_event` → chọn ngẫu nhiên node có `isRandomEvent`
- `isExam` / `isLottery` / `isEnding` → nhánh xử lý riêng

### 4.4 Hệ thống thời gian

- Cấu trúc: `{ year, semester, month }`
- Mỗi tháng: `main_loop` → choice → random event → `advance_time`
- `month > 4` → sang học kỳ mới + **thi** (`exam_event`)
- `semester > 3` → sang năm mới
- Năm > 3: nếu `passedExams >= 6` → tốt nghiệp; không đủ → học năm 4; `year > 4` → ending bỏ học
- Nợ: mỗi tháng lãi **10%** `debt` (tối thiểu +1 nếu còn nợ)

### 4.5 Hệ chỉ số

| Key | Tên | Khởi tạo | Ghi chú |
|-----|-----|----------|---------|
| knowledge | Kiến thức | 40 | Quyết định thi |
| skill | Kỹ năng | 30 | **Không thấy +/− trong story** |
| health | Sức khỏe | 70 | =0 → Bad End collapse |
| spirit | Tinh thần | 60 | =0 → mentalBreakdown |
| money | Tiền | 50 | |
| debt | Nợ | 0 | ≥100 → bankrupt |
| morality | Đạo đức | 60 | =0 → criminal |
| relationship | Mối quan hệ | 40 | =0 → lonely |

Level: 0–25 low · 26–50 medium · 51–75 high · 76–100 extreme.

**Flags:** `hasMyopia`, `failedExams`, `passedExams`, `lotterySpent`, `lotteryWon`, `wonJackpot`, `familyPositive`, `familyTotal`, `skipChosen`.

### 4.6 Ending (13)

**Bad (ưu tiên kiểm tra giữa game):** quit, mentalBreakdown, bankrupt, collapse, criminal, lonely.

**Final (cuối game, theo thứ tự ưu tiên):** perfectLife → billionaire → lucky → freelancer → hometown → healthSacrifice → normal.

### 4.7 Lưu / tải

- Key: `vn_slot_0` … `vn_slot_3`
- Payload: `nodeId`, `stats`, `gender`, `playerName`, `chapter`, `ts`, `time`
- Settings riêng: volume, graphics, fontSize (localStorage)
- Khi hiện ending: **xóa slot hiện tại**

---

## 5. Gameplay chi tiết

### 5.1 Intro

1. `intro_start` — cổng trường, nhân vật vui  
2. `intro_dorm` — gặp Đức  
3. `main_loop` — vòng chính

### 5.2 Lựa chọn tháng (`main_loop`)

| Lựa chọn | Effects chính |
|----------|---------------|
| Cày cuốc thâu đêm | +knowledge, −health, −spirit |
| Làm thêm ca đêm | +money, −knowledge, −health |
| Chơi xả láng | +spirit, +relationship, −money |
| Vay nóng | +money, +debt, −morality |

Sau đó luôn → `trigger_random_event`.

### 5.3 12 sự kiện ngẫu nhiên

`rand_duc_wallet`, `rand_scooter_broken`, `rand_roommate_conflict`, `rand_club_drama`, `rand_multi_level`, `rand_sick`, `rand_accident`, `rand_tutor`, `rand_deadline`, `rand_rain_lan`, `rand_pc_repair`, `rand_argument`.

Mỗi event ~4 lựa chọn, trade-off chỉ số rõ (đạo đức / tiền / sức khỏe / quan hệ).

### 5.4 Thi cuối kỳ

Theo `knowledge`:

- high/extreme → chắc chắn đậu  
- medium → 70% đậu  
- low → trượt  

Cập nhật `passedExams` / `failedExams` và ±spirit/skill nhẹ khi đậu.

### 5.5 UI trong game

- HUD thời gian: `Năm X - HK Y - Tháng Z`
- Dialogue typing + continue indicator
- Multi-character sprites (left/center/right), dim nhân vật không nói
- Overlay chapter (~2.5s)
- Notification toast khi đổi chỉ số
- Overlay lỗi runtime (`window.onerror` → `#error-log`)

---

## 6. Giao diện & tài sản (assets)

### 6.1 UI / CSS

- Font: **Noto Sans** + **Playfair Display** (Google Fonts)
- Theme tối: nền `#0a0a0f`, accent hồng `--primary: #e11d48`, tím `--accent`
- Title screen: particles, nhân vật nam/nữ, menu kính mờ
- Graphics quality: low / medium / high (tắt particle / giảm hiệu ứng)
- Font size: small / medium / large (CSS variables)

### 6.2 Background

Engine map key → **SVG** (`bg_*.svg`), có gradient fallback.  
Thư mục còn **PNG** lớn (~0.9–1.1 MB) và biến thể thời gian (`_morning`, `_night`, `_sunset`) nhưng **engine chưa dùng**.

### 6.3 Sprite người chơi

| Nam | Nữ | Pose |
|-----|----|------|
| `nam_bth.png` | `nu_bth.png` | bình thường |
| `nam_vui.png` | `nu_vui.png` | vui |
| `nam_buon.png` | `nu-buon.png` (**tên file có gạch ngang**) | buồn |
| `nam_nghi.png` | `nu_nghi.png` | suy ngẫm |

**Bug:** code trỏ `nu_buon.png` trong khi file thực tế là `nu-buon.png` → pose buồn nữ có thể lỗi ảnh.

### 6.4 NPC

`char_duc.svg`, `char_lan.svg`, `char_thay_hung.svg` **không tồn tại** trong `assets/images/`. Engine fallback sang `makeCharSVG()` (avatar SVG inline) — vẫn chơi được nhưng chất lượng khác sprite AI.

### 6.5 Thư mục `nhân vật/`

Chứa bản PNG gốc / Gemini-generated (~2.2 MB/ảnh) và bản sprite trùng — **không được tham chiếu**. Nên coi là workspace art, không phải runtime asset.

### 6.6 Âm thanh

UI có slider BGM/SFX, nhưng **không có file audio** và **không có `Audio` API** trong engine → setting volume hiện chỉ lưu preference.

---

## 7. Cách chạy & phát hành

### 7.1 Chạy local (khuyến nghị)

Vì load file local có thể bị hạn chế với một số trình duyệt, dùng HTTP server:

```bash
# Trong thư mục game
python -m http.server 8000
# Mở http://localhost:8000
```

Hoặc mở trực tiếp `index.html` (thường vẫn chạy được vì không fetch module).

### 7.2 Deploy

Phù hợp **GitHub Pages / Netlify / Vercel / mọi static host** — chỉ cần upload thư mục gốc.

### 7.3 README hiện tại — điểm lệch

| README nói | Thực tế |
|------------|---------|
| Thư mục `knmmmm` | Thư mục `game` |
| `sh ./build-release.sh` → zip | Script **đã bị xóa** trên working tree |
| GitHub Pages hướng dẫn đầy đủ | Repo remote tên `mindbalance` — không khớp tên game |

---

## 8. Git & trạng thái repo

- Nhánh: `main` theo dõi `origin/main`
- Commit: 1 commit chính `Ver 1` (toàn bộ source + assets)
- Working tree: `build-release.sh` đang **deleted** (chưa commit)
- Không có `.gitignore` → rủi ro commit `.DS_Store`, file tạm, asset dư

---

## 9. Điểm mạnh

1. **Kiến trúc rõ:** tách config / stats / story / endings / engine — dễ mở rộng nội dung.
2. **Core loop hoàn chỉnh:** time + debt interest + exam + graduation gate + multi-ending.
3. **UI VN polish:** title screen, modal slot/gender/settings, typing, profile, toast chỉ số.
4. **Nội dung tiếng Việt đồng bộ**, có hotline hỗ trợ tâm lý trong ending `mentalBreakdown`.
5. **Zero dependency** — dễ host, dễ sửa, không cần build.
6. **Save 4 slot** + auto-save mỗi node.
7. **Fallback đồ họa** (gradient / SVG procedural) khi thiếu asset.

---

## 10. Rủi ro, bug & khoảng trống

### 10.1 Logic / cân bằng (ưu tiên cao)

| Vấn đề | Chi tiết | Ảnh hưởng |
|--------|----------|-----------|
| `skill` không tăng trong story | Initial 30 = medium; ending cần `skill` high (≥51) | **perfectLife, billionaire, freelancer gần như không reachable** |
| `familyPositive` không set trong story | Engine hỗ trợ `choice.familyPositive` nhưng story không dùng | Ending **hometown** khó/không đạt |
| Lottery dead code | Có `event_lottery_*` + `runLottery()` nhưng không node nào `next` tới | Ending **lucky / billionaire** (jackpot) không đi từ gameplay |
| Quảng cáo “14 endings” | Chỉ có **13** object trong `ENDINGS` | Sai kỳ vọng marketing/UI |
| `hasMyopia` | Flag + UI profile, không logic set | Dead feature |

### 10.2 Asset / đường dẫn

- `nu_buon.png` vs `nu-buon.png`
- NPC SVG thiếu (dùng SVG code)
- PNG background nặng nhưng chưa dùng; SVG đang dùng
- Thư mục `nhân vật/` ~10+ MB dư

### 10.3 Âm thanh & settings

- Volume BGM/SFX không có nguồn phát
- Graphics/font hoạt động; audio chỉ là stub

### 10.4 Kỹ thuật / bảo trì

- Global namespace (`GAME_CONFIG`, `STORY_DATA`, `VNEngine`) — ổn cho prototype, khó scale
- `STORY_DATA[node.next].text = ...` mutate global khi exam/lottery
- Không test tự động, không lint, không CI
- README / build script lệch thực tế
- Encoding: một số comment trong file gốc UTF-8; cần giữ encoding khi edit trên Windows
- Story hardcode `player_male` trong nhiều `characters[]` — engine có remap gender khi render, nhưng data dễ gây nhầm khi bảo trì

### 10.5 Cân bằng gameplay (quan sát)

- Effect tháng khá mạnh (+25 knowledge, −15 health…) → dễ “minmax” hoặc chết sớm (health/spirit/debt)
- Random event thuần ngẫu nhiên (không weight / cooldown) → replayability có nhưng khó kiểm soát narrative
- Một số choice text nói “−50💰” nhưng effect khác (ví dụ sửa xe) → lệch copywriting

---

## 11. Chỉ số quy mô (ước lượng)

| Thành phần | Quy mô |
|------------|--------|
| `engine.js` | ~810 dòng |
| `story.js` | ~509 dòng |
| `style.css` | ~188 dòng / ~17.5 KB |
| `endings.js` | ~101 dòng |
| `index.html` | ~188 dòng |
| Assets runtime (`assets/images`) | ~10–12 MB (PNG + SVG) |
| Art dư (`nhân vật/`) | ~15+ MB |

---

## 12. Đề xuất hướng phát triển (ưu tiên)

### P0 — Sửa để “chơi đúng design”

1. Thêm effect `skill` vào choices (làm thêm kỹ thuật, CLB, sửa máy…)  
2. Gắn `familyPositive` vào event gia đình / về quê (hoặc bỏ điều kiện ending hometown)  
3. Chèn lottery vào vòng tháng (ví dụ tháng chẵn / lựa chọn “mua số”)  
4. Đổi path `nu_buon.png` ↔ `nu-buon.png`  
5. Đồng bộ số ending trên UI (13 hoặc thêm ending thứ 14)

### P1 — Hoàn thiện sản phẩm

6. Thêm BGM/SFX thật hoặc ẩn slider audio  
7. Dùng PNG background chất lượng cao (hoặc tối ưu WebP) thay SVG placeholder  
8. Export sprite NPC thật thay `makeCharSVG`  
9. Thêm `.gitignore` (`.DS_Store`, `nhân vật/` nếu chỉ là draft)  
10. Cập nhật README (tên thư mục, bỏ/restore `build-release.sh`)

### P2 — Mở rộng nội dung

11. Chapter theo năm với overlay title thật  
12. Relationship riêng với Lan / Đức (thay 1 chỉ số gộp)  
13. Weight random event theo chỉ số / flags  
14. Gallery ending đã mở khóa  
15. Mobile polish (touch targets, safe area)

---

## 13. Kết luận

**Cuộc Sống Sinh Viên** là prototype visual novel web hoàn chỉnh về mặt “có thể chơi từ đầu đến ending”, với vòng thời gian, chỉ số, sự kiện ngẫu nhiên và nhiều kết cục. Điểm mạnh là kiến trúc module đơn giản và UI tiếng Việt khá chỉn. Điểm yếu chính là **một số hệ thống/ending chưa nối** (`skill`, lottery, `familyPositive`), **asset path lệch**, và **không có audio / tooling / docs đồng bộ**.

Với các sửa P0 ở mục 12, dự án sẽ khớp gần với lời hứa trên title screen (“4 năm — nhiều endings”) và sẵn sàng hơn để phát hành static (Pages/Netlify).

---

*Báo cáo được tạo từ phân tích mã nguồn tại thời điểm 22/07/2026. Không bao gồm đo đạc performance runtime trên thiết bị thật.*
