# Mục tiêu — Đưa "Bốn Năm Thanh Xuân" lên chuẩn production

> Tài liệu này dựa trên khảo sát code thực tế (frontend/, backend/, packages/) ngày 23/07/2026.
> Gồm 3 phần: (1) đánh giá hiện trạng theo từng mảng, (2) lộ trình update 5 phase, (3) checklist "production-ready" đo được.

---

## 1. Đánh giá hiện trạng (chấm điểm theo mảng)

### 1.1 Engine (`frontend/packages/game-core`) — 8/10 ✅

**Điểm mạnh:**
- Vòng lặp game rõ ràng: 16 mùa (mỗi mùa 3 tháng), action points, delayed effects, cooldown/oneShot cho event.
- Surprise runtime hoạt động đúng: prerequisite → roll → choice → effects.
- `resolveEnding` xét ending theo `priority` giảm dần — thiết kế đúng chuẩn.
- Có simulator test (`simulator.test.ts`) chạy full game tự động.

**Điểm trừ:**
- Nhiều flag mà ending yêu cầu (`balancedSuccess`, `jackpotStable`, `successUnwell`, `cannotGraduate`, `allRelationshipsLow`…) **không có chỗ nào trong content set chúng** → engine đúng nhưng bị content bỏ đói.

### 1.2 Nội dung (`frontend/packages/game-content`) — Phase 1 ✅

**Bằng chứng hiện tại:** validator yêu cầu mọi event có ít nhất 2 lựa chọn; content có đúng 14 ending; fixture test core chứng minh reachability. Surprise vẫn có 12 tình huống × 4 lựa chọn.

### 1.3 UI/UX shell (`frontend/src`) — 7/10 ✅

**Đã có:** dialogue VN với portrait tách nền, background theo mùa + weather FX, surprise flash, menu/settings (âm thanh, font scale, tốc độ chữ, reduced motion), ending gallery, toast, offline banner, procedural audio.

**Đã có:** title screen, bốn slot độc lập, xóa/tiếp tục slot, timeline sau ending và skip-read. Playwright bao phủ vòng đời title → ending → timeline → title và quản lý bốn slot.

### 1.4 Backend (`backend/src`) — local/single-instance Phase 3 ✅; HA chưa xong

- Production mặc định dùng atomic `FileStore`; test xác nhận persistence qua store restart. Chỉ phù hợp đúng một Node process với persistent disk.
- API có revision/ETag, idempotency, Bearer auth, CORS allowlist, health/readiness.
- Frontend có pull/push, queue offline, conflict UI và recovery code hai thiết bị.
- PostgreSQL, multi-instance locking, HA, backup tự động và restore drill chưa có.

### 1.5 Asset — phần Phase 4 trong repo ✅; audit production còn thiếu

- Portraits 5 nhân vật chính đã tách nền, backgrounds theo mùa + surprise FX đã nén WebP. Tốt.
- Test xác nhận Ông Tư, cha, mẹ dùng artwork riêng; có âm thanh theo mood và PNG icon 192/512 + maskable.
- Lighthouse production và review mỹ thuật trên thiết bị thật chưa thực hiện.

### 1.6 Test / CI — 7/10 ✅

- 8 file test (engine, simulator, save, validator, settings, gallery, save-store, backend app) + e2e smoke. CI tách lint/typecheck/test/build cho frontend và backend chạy song song.
- Có validator lựa chọn, fixture reachability, conflict/recovery/queue tests và Playwright full journey. Chưa bao phủ mọi nhánh nội dung trên thiết bị thật.

**Tổng kết:** Phase 1, Phase 2, Phase 3 local/single-instance và phần code Phase 4 đã có bằng chứng. Phase 5 mới deploy-ready; public deploy, Lighthouse và PostgreSQL HA vẫn chặn tuyên bố production hoàn chỉnh.

---

## 2. Lộ trình update — 5 phase (ưu tiên chặn-ship trước)

### Phase 1 — Nội dung chơi được thật (ưu tiên cao nhất)
- [x] 19 event canonical có ít nhất 2 lựa chọn, được validator kiểm.
- [x] Flag writers/điều kiện cho ending đã nối vào content.
- [x] Test fixture chứng minh 14/14 ending reachable.
- **Định nghĩa xong:** 0 event chỉ có 1 choice; 14/14 ending pass test reachability.

### Phase 2 — Vòng đời game hoàn chỉnh
- [x] Title screen (Chơi mới / Tiếp tục / Cài đặt / Gallery).
- [x] Save **4 slot** + màn hình chọn/xoá slot.
- [x] **Timeline hành trình** sau ending.
- [x] Wire `skipRead` theo beat đã đọc.
- **Định nghĩa xong:** chơi từ title → ending → timeline → về title không cần reload trang.

### Phase 3 — Backend bền vững
- [x] Thêm atomic `FileStore` cho production single-instance + persistent disk; restart test đạt.
- [x] Sync **pull/push** theo revision và ETag.
- [x] UI xử lý conflict: giữ local hoặc dùng cloud.
- [ ] PostgreSQL và HA multi-instance.
- **Định nghĩa xong:** restart server không mất save; đăng nhập máy khác lấy lại được save.

### Phase 4 — Asset & polish
- [x] Portrait riêng cho **Ông Tư, cha, mẹ**; test chống mapping trùng.
- [x] Âm thanh theo mood, tôn trọng toggle.
- [x] PNG icons đủ size cho PWA manifest (192/512, maskable).
- [x] Focus trap, ARIA và reduced-motion có code/test.
- [ ] Contrast và Accessibility kiểm bằng Lighthouse production.
- **Định nghĩa xong:** Lighthouse Accessibility ≥ 90, không còn portrait dùng nhầm.

### Phase 5 — Deploy production
- [x] Cấu hình frontend static artifact: API base env, security/cache headers và SPA fallback.
- [x] Backend Dockerfile Node 22 non-root, health/readiness, env example và persistent path.
- [x] Runbook deploy/rollback/backup/smoke gồm restart persistence, CORS và recovery code hai thiết bị.
- [ ] Deploy frontend/backend lên host thật.
- [ ] Smoke production và Lighthouse trên URL public.
- **Định nghĩa xong:** URL public chạy được, checklist mục 3 pass toàn bộ.

---

## 3. Định nghĩa "hoàn hảo / production-ready" (checklist pass/fail)

| # | Tiêu chí | Cách đo | Trạng thái |
|---|----------|---------|-----------|
| 1 | 14/14 ending reachable | Fixture reachability trong test core | ✅ |
| 2 | Mọi event canonical có ≥ 2 lựa chọn ý nghĩa | Validator content trong CI | ✅ |
| 3 | Save không mất khi restart server | `FileStore` test qua instance mới | ✅ local/single-instance; production volume chưa smoke |
| 4 | Sync 2 chiều + xử lý conflict | Unit test pull/push/conflict/recovery | ✅ code/local; hai thiết bị production chưa smoke |
| 5 | Chơi full 16 mùa không lỗi console | Playwright full journey | ✅ trong test hiện tại; chưa production |
| 6 | Title screen → ending → timeline → title | E2E vòng đời đầy đủ | ✅ |
| 7 | CI xanh: lint + typecheck + test + build cả 2 project | GitHub Actions | ✅ |
| 8 | PWA installable, hoạt động offline | Lighthouse PWA + tắt mạng chơi tiếp | ⚠️ có SW/icons; chưa audit production |
| 9 | Lighthouse Performance/Accessibility ≥ 90 | Lighthouse trên bản production | ❓ (chưa đo) |
| 10 | Không nhân vật nào dùng nhầm portrait | Asset mapping test + review thủ công | ✅ test mapping; review production chưa làm |
| 11 | URL public + backend có domain, CORS đúng | Truy cập thật từ 2 thiết bị | ❌ (chưa deploy) |

**Điều kiện tuyên bố "production":** 11/11 tiêu chí ✅. Hiện chưa đạt vì mục 8, 9, 11 và smoke production của mục 3/4 chưa hoàn tất.

---

## Ghi chú

- Trạng thái lấy từ code/test ngày 23/07/2026; không đồng nghĩa môi trường production đã được xác minh.
- Phase 5 chọn static host + một Node process trên persistent disk. PostgreSQL HA là việc chưa xong, cần trước khi scale nhiều instance.
- Không deploy trong lần chuẩn bị này; URL public, domain thật và secret không có trong repo.
