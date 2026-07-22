# Kế hoạch migration

## Nguyên tắc

Không xóa legacy trước parity test. Mỗi phase tạo thay đổi nhỏ, chạy lint, typecheck, test. `docs/product/game-story.md` thắng mọi mâu thuẫn với code cũ.

## Phase 1 — Tooling và test

- Frontend và backend là hai npm project độc lập với TypeScript strict, ESLint, Vitest.
- CI nền: install khóa dependency, lint, typecheck, unit, build.
- Snapshot hành vi/save legacy phục vụ migration, không coi gameplay legacy là chuẩn.

Điều kiện qua: clone mới cài/build/test được.

## Phase 2 — Game core

- State, command/reducer, seeded RNG, scheduler, delayed consequences.
- Hai action point/tháng; stat/relationship/trait riêng.
- Save envelope và versioning.

Điều kiện qua: deterministic replay và 48 tháng qua unit test.

## Phase 3 — Content schema

- Schema characters, activities, events, choices, endings.
- Validation prerequisite, graph, choice/effect và asset.
- Không global mutation.

Điều kiện qua: toàn content parse thành công; reference không thiếu.

## Phase 4 — Cốt truyện và 14 ending

- Minh canonical; Huy thay Đức; thêm Phong, Mai, Ông Tư, cha mẹ.
- Event bắt buộc đủ bốn năm, content tinh thần có trách nhiệm.
- Ending priority duy nhất, fixtures và simulation.

Điều kiện qua: đúng 14 ending, reachable, mandatory event có thể xuất hiện.

## Phase 5 — Frontend

- Vite React, các màn bắt buộc, view model từ core.
- Accessibility, mobile, reduce motion, settings, timeline/gallery.
- Local autosave và PWA offline.

Điều kiện qua: E2E desktop/mobile/keyboard và offline smoke xanh.

## Phase 6 — Backend

- Worker endpoint `/v1`, anonymous session, save/profile/ending.
- Validation, payload/slot quota, ETag/revision, idempotency, CORS, logging.

Điều kiện qua: integration test conflict, quota, auth và redaction xanh.

## Phase 7 — Cloudflare deployment

- Worker Static Assets, staging/production environment.
- Cache rules, WAF/rate-limit tài liệu và cấu hình deploy.
- Tunnel policy cho VPS tương lai.

Điều kiện qua: staging smoke, header cache/security đúng.

## Phase 8 — Asset optimization

- Đổi runtime asset sang ASCII kebab-case.
- AVIF/WebP và lazy-load theo chapter; loại duplicate khỏi bundle.

Điều kiện qua: asset validator và size budget xanh.

## Phase 9 — Save migration

- Migrator `vn_slot_0..3`, backup/rollback và UI báo kết quả.
- Cloud sync milestone/debounce, conflict UI.

Điều kiện qua: fixture save legacy được import không mất dữ liệu cần thiết.

## Phase 10 — Dọn legacy

- Chạy parity test trước.
- Xóa shell/script global và asset runtime dư; giữ tag/branch rollback.
- Cập nhật README, báo cáo file/test/giới hạn/rollback.

Điều kiện qua: CI xanh và production smoke xanh.

## Rollback

- Mỗi production deploy giữ Worker version và static artifact trước.
- Rollback bằng Cloudflare version rollback; không chạy migration phá hủy dữ liệu.
- Save migration chỉ thêm schema mới; đọc ngược trong ít nhất một release.
- Nếu frontend lỗi, route traffic về deployment trước; API giữ contract tương thích.
