# Bốn Năm Thanh Xuân

Monorepo production tách rõ frontend, backend và domain dùng chung.

## Monorepo

- `workspace/frontend`: service Vite React PWA, cổng `4173`.
- `workspace/backend`: service API Node.js portable, cổng `8787`.
- `workspace/packages`: domain, content và contract dùng chung.
- `workspace`: npm workspace, TypeScript, ESLint và Vitest config.
- `docs/product`: cốt truyện chuẩn và báo cáo kiểm toán legacy.
- `docs`: kiến trúc, migration, bảo mật và vận hành.

## Chạy

Yêu cầu Node.js 22+. Chuyển vào `workspace`, chạy `npm install`, sau đó `npm run dev` để mở cả hai service. Frontend: `http://localhost:4173`. Backend: `http://localhost:8787`. Chạy riêng bằng `npm run dev:frontend` hoặc `npm run dev:backend`.

Trong `workspace`, kiểm tra bằng `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.

## Deploy

- Frontend: build `npm run build -w @game/frontend`; deploy `frontend/dist` lên Vercel, Render Static Site hoặc Nginx.
- Backend VPS/Render: build `npm run build -w @game/backend`; start `npm run start -w @game/backend`; cấu hình `PORT` và `CORS_ORIGINS`.
- `MemoryStore` chỉ dành cho local. Process restart sẽ mất cloud save; production phải dùng PostgreSQL, Redis hoặc KV adapter.
- Vercel backend cần serverless adapter và storage ngoài. API core tại `backend/src/app.ts` không phụ thuộc framework.
