# Phase 3 — Backend và đồng bộ

## Thiết kế

- Backend dùng `Store` async chung. `FileStore` ghi JSON bằng file tạm rồi atomic rename, tuần tự hóa thao tác trong process và giữ TTL idempotency.
- `NODE_ENV=production` mặc định chọn `SAVE_STORE=file`; `SAVE_STORE=memory` bị từ chối trong production. `SAVE_STORE_FILE` cấu hình đường dẫn, mặc định `./data/saves.json`.
- `FileStore` phù hợp một Node process. Production nhiều instance nên dùng PostgreSQL với transaction, unique key `(token_hash, slot)`, optimistic revision và bảng idempotency. JSON file không cung cấp locking liên process, backup/replication hoặc HA.
- API giới hạn 256 KiB bằng byte thực sau khi đọc request. Conflict `412` trả payload cloud hiện tại và `ETag`. GET/PUT/DELETE hỗ trợ lifecycle slot.
- Frontend lấy base URL từ `VITE_API_BASE_URL`, fallback `/v1/saves`. Push cùng slot được serialize; queue coalesce theo slot; conflict giữ nguyên queue.
- Tiếp tục slot gọi pull. Local/cloud khác revision mở modal chọn. Giữ local đặt base revision bằng cloud revision rồi PUT có `If-Match`; dùng cloud ghi payload về local.
- Auto-push chỉ chạy tại milestone: sang tháng, chọn event/surprise, ending; nút đồng bộ là manual push.
- Mã khôi phục dùng chung anonymous bearer token giữa thiết bị. UI dùng trường password và cảnh báo nhạy cảm; token không được log hoặc hiện trong hint.

## Kiểm thử

- Backend: restart persistence, GET/PUT, ETag/idempotency, conflict body + ETag, oversize theo byte thực, CORS.
- Frontend: pull + ETag, conflict result/callback, queue offline/flush, queue coalesce, recovery-code import, save lifecycle.
- Ngày 23/07/2026: backend và frontend đều pass `lint`, `typecheck`, `test`, `build`.

## Blocker production

- Chưa deploy theo yêu cầu.
- Cần PostgreSQL trước khi chạy nhiều backend instance hoặc cần HA; `FileStore` chỉ an toàn cho một process có persistent disk.
- Anonymous recovery code là bearer secret, chưa có account auth, rotation/revocation, rate limiting/WAF, encryption-at-rest policy, backup và restore drill.
# Báo cáo triển khai hiện tại

Ngày cập nhật: 23/07/2026. Trạng thái: chuẩn bị deploy, **chưa deploy**.

## Đã hoàn thành và có bằng chứng trong repo

- Phase 1: 19 event canonical có từ 2 lựa chọn; validator kiểm điều kiện này. Content có đúng 14 ending và fixture reachability trong test core.
- Phase 2: title screen, bốn slot, xóa/tiếp tục slot, settings/gallery, skip-read, ending timeline và về title. Playwright có smoke vòng đời và bốn slot.
- Phase 3 local/single-instance: `FileStore` atomic, persistence test qua instance mới; production từ chối `MemoryStore`; sync pull/push, ETag/revision, conflict UI, queue offline và recovery code.
- Phase 4 phần code/asset: portrait riêng cho Ông Tư/cha/mẹ, nhạc theo mood, icon PNG 192/512 và maskable, focus trap/reduced motion tests.
- Phase 5 chuẩn bị: backend image Node 22 non-root, persistent path `/data/saves.json`, health/readiness, env examples; frontend API build variable, static headers và SPA fallback; deploy/rollback/smoke runbook.
- CI định nghĩa lint, typecheck, unit test, build cả hai project và Playwright frontend.

## Validation gần nhất

- Backend `npm test -- --reporter=dot` và `npm run build`: đạt trước thay đổi Phase 5 theo terminal hiện tại.
- Validation sau thay đổi Phase 5 phải xem báo cáo cuối task/CI; không suy diễn từ artifact cũ.

## Chưa hoàn thành / blocker

- Chưa có URL public, cấu hình host thật, persistent volume thật, TLS/CORS production hay smoke trên hai thiết bị.
- Chưa đo Lighthouse production; chưa chứng minh Performance/Accessibility ≥ 90.
- Chưa có PostgreSQL, multi-instance locking, HA, backup tự động hay restore drill.
- Recovery code là anonymous bearer credential; chưa có account auth, rotation/revocation hoặc server-side rate limiting.
- Full-game E2E có nhưng chưa chứng minh mọi nhánh và mọi môi trường thiết bị.

## Quyết định scope

Phase 5 dùng static host bất kỳ + backend Node single-instance persistent disk. Không thêm Worker/D1. PostgreSQL HA vẫn là nâng cấp tương lai, không phải tuyên bố đã xong.
