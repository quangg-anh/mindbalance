# Bốn Năm Thanh Xuân

Monorepo production tách rõ frontend, backend và domain dùng chung.

## Monorepo

- `frontend`: service Vite React PWA, cổng `4173`.
- `backend`: service API Node.js portable, cổng `8787`.
- `packages/game-core`: reducer, RNG, scheduler, save migration, ending resolver.
- `packages/game-content`: schema Zod, 10 activity, nhân vật, event, 14 ending.
- `packages/shared`: contract/runtime validation.
- `e2e`: Playwright end-to-end test.
- `docs/product`: cốt truyện chuẩn và báo cáo kiểm toán legacy.
- `docs`: kiến trúc, migration, bảo mật và vận hành.

## Chạy

Yêu cầu Node.js 22+. Chạy `npm install`, sau đó `npm run dev` để mở cả hai service. Frontend: `http://localhost:4173`. Backend: `http://localhost:8787`. Chạy riêng bằng `npm run dev:frontend` hoặc `npm run dev:backend`.

Kiểm tra bằng `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. E2E cần browser Playwright: `npx playwright install chromium`, rồi `npm run test:e2e`.

## Deploy

- Frontend: build `npm run build -w @game/frontend`; deploy `frontend/dist` lên Vercel, Render Static Site hoặc Nginx.
- Backend VPS/Render: build `npm run build -w @game/backend`; start `npm run start -w @game/backend`; cấu hình `PORT` và `CORS_ORIGINS`.
- `MemoryStore` chỉ dành cho local. Process restart sẽ mất cloud save; production phải dùng PostgreSQL, Redis hoặc KV adapter.
- Vercel backend cần serverless adapter và storage ngoài. API core tại `backend/src/app.ts` không phụ thuộc framework.
