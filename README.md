# Bốn Năm Thanh Xuân

React PWA tách khỏi Node API. Kiến trúc Phase 5 hiện tại: static frontend + đúng một backend Node dùng persistent disk `FileStore`. Không chạy nhiều replica với `FileStore`.

## Local và validation

- Frontend: vào `frontend`, chạy `npm ci`, `npm run dev`.
- Backend: vào `backend`, chạy `npm ci`, `npm run dev`.
- Mỗi project: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
- E2E frontend sau build: `npm run e2e`.

## Build production

### Frontend static

1. Dùng `frontend/.env.example` làm mẫu biến build và thay `<BACKEND_HOST>` bằng host API thật. `VITE_API_BASE_URL` phải kết thúc bằng `/v1/saves`, không có dấu `/` cuối.
2. Chạy `npm ci && npm run build` trong `frontend`.
3. Publish `frontend/dist`. Host phải phục vụ SPA fallback về `/index.html`.
4. `frontend/public/_headers` và `_redirects` được copy vào artifact cho host hỗ trợ cú pháp này. Host khác phải ánh xạ tương đương: HTML/service worker không cache lâu; `/assets/*` immutable; mọi route fallback về `index.html`.

### Backend single-instance

1. Build image từ `backend/Dockerfile`.
2. Chạy đúng một replica, mount persistent disk có quyền ghi tại `/data`, đặt `SAVE_STORE_FILE=/data/saves.json`.
3. Đặt `CORS_ORIGINS=https://<FRONTEND_HOST>` bằng origin chính xác. Nhiều origin phân cách bằng dấu phẩy; không dùng wildcard hay path.
4. Route traffic tới `PORT` (mặc định `8787`). Liveness: `/v1/health`. Readiness/storage probe: `/v1/ready`.

Không có secret hạ tầng bắt buộc trong repo. Recovery code do client tạo là bearer credential người dùng; không đưa vào env, log hoặc ticket.

## Vận hành

Hướng dẫn deploy thủ công, rollback, backup/restore và smoke: `docs/deployment-runbook.md`. Incident: `docs/incident-runbook.md`.

## Giới hạn kiến trúc

- `FileStore` tuần tự hóa trong một process, ghi file tạm rồi rename. Persistent disk bắt buộc.
- Không dùng autoscaling hoặc nhiều replica. Muốn HA phải chuyển sang PostgreSQL kèm transaction/optimistic revision.
- Shared contract tồn tại tại `frontend/packages/shared` và `backend/packages/shared`; đổi contract phải cập nhật cả hai.
