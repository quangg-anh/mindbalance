# Nhật ký quyết định

## ADR-001 — `docs/product/game-story.md` là nguồn chuẩn

**Chấp nhận.** Canonical protagonist là Minh, nam, 18 tuổi. Bỏ tùy chọn đổi nhân vật. Đức được thay bằng Huy. Logic/content legacy mâu thuẫn bị thay.

## ADR-002 — Domain thuần và local-first

**Chấp nhận.** `game-core` không có I/O. Web adapter chịu trách nhiệm local persistence và cloud queue. Gameplay tiếp tục khi API lỗi.

## ADR-003 — Reducer bất biến

**Chấp nhận.** Mọi thay đổi state qua command/reducer. Content chỉ là dữ liệu đã validate; không mutate node để ghi kết quả động.

## ADR-004 — RNG có seed và version

**Chấp nhận.** Save lưu seed, thuật toán/version và RNG state. Cùng seed + command sequence cho state cuối giống nhau.

## ADR-005 — Ending theo priority duy nhất

**Chấp nhận.** Resolver chọn condition đúng có priority cao nhất. Schema cấm priority trùng; test fixture chứng minh 14 ending reachable. Không dựa thứ tự array.

## ADR-006 — Zod cho schema/runtime boundary

**Chấp nhận.** TypeScript kiểm tra compile-time; Zod kiểm tra content, save và API input runtime. Không dùng `any`; boundary parse thành `unknown`.

## ADR-007 — Cloudflare edge-first

**Chấp nhận.** Web static và API chạy Worker edge. Dữ liệu cá nhân `private, no-store`. Asset hash cache dài. VPS nếu có chỉ qua Cloudflare Tunnel và không public origin.

## ADR-008 — Sync theo milestone/debounce

**Chấp nhận.** Local autosave thường xuyên; cloud sync khi qua tháng/chapter/ending hoặc sau debounce thay đổi quan trọng. Không request mỗi action nhỏ.

## ADR-009 — Nội dung tinh thần có trách nhiệm

**Chấp nhận.** Không mô tả phương thức tự hại. Cảnh nhạy cảm có warning, lựa chọn bỏ qua an toàn và thông tin hỗ trợ theo locale. `stop_midway` cần xác nhận riêng; skip thoại không kích hoạt ending.

## ADR-010 — Legacy xóa sau parity

**Hoàn thành.** Frontend mới, save migration và E2E đã đạt kiểm tra nền. Đã xóa `index.html`, `css/`, `js/`, asset trùng và backend prototype trùng. Git history giữ khả năng rollback.
