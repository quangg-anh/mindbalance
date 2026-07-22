# Bốn Năm Thanh Xuân

Monorepo production tách rõ frontend, backend và domain dùng chung.

## Monorepo

- `apps/web`: frontend Vite React PWA, local-first.
- `apps/api`: backend Cloudflare Worker `/v1`.
- `packages/game-core`: reducer, RNG, scheduler, save migration, ending resolver.
- `packages/game-content`: schema Zod, 10 activity, nhân vật, event, 14 ending.
- `packages/shared`: contract/runtime validation.
- `e2e`: Playwright end-to-end test.
- `docs/product`: cốt truyện chuẩn và báo cáo kiểm toán legacy.
- `docs`: kiến trúc, migration, bảo mật và vận hành.

## Chạy

Yêu cầu Node.js 22+. `npm install`, rồi `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. Dev web: `npm run dev -w @game/web`. E2E cần browser Playwright: `npx playwright install chromium`, rồi `npm run test:e2e`.

## Deploy

Thay KV ID và CORS domain trong `apps/api/wrangler.toml`; cấu hình secrets bằng Wrangler. Deploy staging trước, chạy smoke header/auth/save, sau đó production. Xem `docs/security-and-ddos.md` và `docs/incident-runbook.md`.
