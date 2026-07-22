# Bốn Năm Thanh Xuân

Frontend và Backend tách thành hai project độc lập.

## Cấu trúc

- `frontend`: Vite React PWA (cổng `4173`) kèm domain packages (`game-core`, `game-content`, `shared`).
- `backend`: Node.js API (cổng `8787`) kèm contract `shared`.
- `docs`: kiến trúc, migration, bảo mật và vận hành.
- `docs/product`: cốt truyện chuẩn và báo cáo kiểm toán legacy.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Kiểm tra: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.

Deploy: `npm run build` rồi đưa `frontend/dist` lên Vercel, Render Static Site hoặc Nginx.

## Backend

```bash
cd backend
npm install
npm run dev
```

Kiểm tra: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.

Deploy VPS/Render: `npm run build` rồi `npm start`; cấu hình `PORT` và `CORS_ORIGINS`.

- `MemoryStore` chỉ dành cho local. Process restart sẽ mất cloud save; production phải dùng PostgreSQL, Redis hoặc KV adapter.
- Vercel backend cần serverless adapter và storage ngoài. API core tại `backend/src/app.ts` không phụ thuộc framework.

## Lưu ý shared

`@game/shared` có bản trong cả `frontend/packages/shared` và `backend/packages/shared`. Khi đổi API contract, cập nhật đồng bộ cả hai.
