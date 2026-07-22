# Báo cáo triển khai

Ngày: 22/07/2026

## Phạm vi hoàn thành

- Kiểm toán `docs/product/game-story.md`, `docs/product/legacy-audit.md` và toàn bộ source legacy.
- Tạo monorepo TypeScript strict với `apps/web`, `apps/api`, `packages/game-core`, `packages/game-content`, `packages/shared`.
- Game core thuần: 48 tháng, 2 action point/tháng, command/reducer, seeded RNG, scheduler, delayed consequence, relationship/trait riêng.
- Content có Zod schema, nhân vật canonical, 10 activity, event bắt buộc bốn năm và đúng 14 ending.
- Save schema version 2, RNG state và migration `vn_slot_0..3`.
- React PWA mobile-first, keyboard, ARIA, reduced motion và offline app shell.
- Worker API với validation, CORS allowlist, payload/slot quota, request ID, ETag/revision, idempotency và private cache.
- Tài liệu Cloudflare security/DDoS, incident response, architecture, migration và decisions.
- CI lint, typecheck, unit, story validation, integration, build và Playwright smoke.
- Legacy frontend và asset trùng đã xóa sau khi lint, typecheck, test, build và E2E đạt.

## File chính thay đổi

- Tooling: `package.json`, `package-lock.json`, `tsconfig*.json`, `eslint.config.mjs`, `vitest.config.ts`, `playwright.config.ts`.
- CI: `.github/workflows/ci.yml`.
- Core: `packages/game-core/src/*`.
- Content: `packages/game-content/src/*`.
- Shared: `packages/shared/src/*`.
- Web: `apps/web/*`.
- API: `apps/api/*`.
- E2E: `e2e/smoke.spec.ts`.
- Docs: `README.md`, `docs/*.md`.

## Kiểm tra đã chạy

- `npm run lint`: đạt.
- `npm run typecheck`: đạt.
- `npm test`: 5 suite, 23 test đạt.
- `npm run build`: đạt cho Worker dry-run, web PWA và ba package.
- `npm run test:e2e`: 2 test đạt trên Chromium desktop và Pixel 7 profile.

## Giới hạn còn lại

- `apps/api/wrangler.toml` còn placeholder KV ID và production CORS; deployment thật cần Cloudflare account/resource ID.
- WAF, managed rate limit và Tunnel firewall là cấu hình account/infrastructure; repo cung cấp policy/runbook, chưa thể chứng minh active nếu chưa có account/origin.
- Cloud sync queue/conflict UX và ending gallery hiện ở mức nền tối thiểu; cần product QA dài hạn trước phát hành công khai.
- Frontend mới chưa có bộ artwork production AVIF/WebP; asset legacy không dùng đã xóa khỏi repo.
- Playwright hiện smoke test, chưa bao phủ mọi path UI 48 tháng.
- Không tuyên bố chống DDoS tuyệt đối.

## Rollback

1. Khôi phục frontend legacy từ Git commit trước phase dọn nếu frontend mới lỗi.
2. Rollback Cloudflare Worker về version/deployment trước.
3. Save migration không xóa `vn_slot_0..3` trước khi save schema mới ghi thành công.
4. Không chạy migration phá hủy dữ liệu. Duy trì đọc schema cũ ít nhất một release.
5. Production chỉ promote sau staging smoke; nếu smoke lỗi, giữ deployment production trước.
