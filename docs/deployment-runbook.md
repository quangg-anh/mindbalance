# Phase 5 deployment runbook

Phạm vi: static frontend + một backend Node dùng persistent disk. Tài liệu không chứa domain hoặc secret thật. Thay mọi `<...>` khi cấu hình môi trường. Không chạy nhiều backend replica.

## 1. Preflight

1. Ghi lại frontend artifact ID, backend image digest và backup hiện tại. Không dùng tag trôi nổi như `latest` cho rollback.
2. Chạy validation trong `frontend` và `backend`: lint, typecheck, test, build. Chạy Playwright smoke frontend.
3. Build frontend với `VITE_API_BASE_URL=https://<BACKEND_HOST>/v1/saves`. Kiểm tra artifact có `_headers`, `_redirects`, manifest, service worker và bốn icon PNG.
4. Build backend image từ `backend/Dockerfile`. Quét image theo quy trình host nếu có.
5. Tạo persistent volume và mount tại `/data`. Container chạy UID/GID của user `node`; volume phải ghi được bởi user này.
6. Đặt env theo `backend/.env.example`. `CORS_ORIGINS` chỉ chứa exact production/staging frontend origins cần thiết.
7. Cấu hình một replica, rolling strategy không chạy hai phiên bản đồng thời trên cùng file. Nếu platform luôn overlap replica, dùng stop-then-start và chấp nhận downtime ngắn hoặc chuyển PostgreSQL.
8. Cấu hình liveness `GET /v1/health`; readiness `GET /v1/ready`. Chỉ expose API qua HTTPS reverse proxy/platform.

## 2. Release

1. Backup `/data/saves.json` nếu tồn tại. Giữ permissions và checksum; không log nội dung file.
2. Start backend image bằng digest mới, gắn lại cùng persistent volume. Chờ readiness HTTP 200.
3. Kiểm tra API từ origin frontend dự kiến và kiểm tra origin ngoài allowlist nhận 403.
4. Publish static artifact đã build. Purge HTML/service-worker cache nếu host không tự revalidate; không purge asset hash nếu không cần.
5. Chạy smoke mục 4. Chỉ promote DNS/traffic sau khi smoke đạt.

## 3. Rollback

1. Dừng traffic hoặc bật maintenance nếu write đang lỗi.
2. Rollback static artifact về artifact ID trước.
3. Dừng backend mới hoàn toàn rồi start image digest trước với cùng persistent volume. Không chạy hai container cùng `FileStore`.
4. Chỉ restore backup khi xác nhận file hiện tại hỏng hoặc schema không tương thích. Trước restore, sao chép file lỗi để điều tra.
5. Chờ `/v1/ready` trả 200, rồi chạy smoke đọc/ghi. Mở lại traffic.
6. Không rollback dữ liệu chỉ vì lỗi frontend. Không xóa local save hoặc legacy keys của trình duyệt.

## 4. Production smoke

Dùng tài khoản/trình duyệt test, không ghi recovery code vào log hoặc ticket.

### Health, readiness và CORS

1. `GET https://<BACKEND_HOST>/v1/health` trả 200 và JSON `ok: true`.
2. `GET https://<BACKEND_HOST>/v1/ready` trả 200 và JSON `ready: true`.
3. Mở frontend tại `https://<FRONTEND_HOST>`, tạo slot test, chơi qua ít nhất một lần sang tháng và đồng bộ. Network request save không có lỗi CORS.
4. Gửi preflight với `Origin: https://<UNALLOWED_ORIGIN>`; API phải trả 403 và không trả `Access-Control-Allow-Origin` cho origin đó.

### Restart persistence

1. Tại slot test, ghi lại tháng/revision hiển thị và đảm bảo sync thành công.
2. Restart đúng một backend container, không thay hoặc xóa persistent volume.
3. Chờ readiness 200. Reload frontend, chọn “Tiếp tục / Cloud”. Save phải còn và revision/tháng không lùi.

### Recovery code trên hai thiết bị

1. Thiết bị A tạo/chơi slot test, đồng bộ, rồi copy recovery code qua kênh riêng tạm thời.
2. Thiết bị B mở frontend sạch/incognito, nhập recovery code và chọn cùng slot qua “Tiếp tục / Cloud”. Dữ liệu từ A phải xuất hiện.
3. Thiết bị B tiến thêm một milestone và sync. Thiết bị A pull lại; nếu modal conflict xuất hiện, kiểm tra cả lựa chọn giữ local và dùng cloud theo kế hoạch test.
4. Xóa dữ liệu test bằng UI khi xong. Xóa bản recovery code tạm khỏi clipboard/kênh truyền nếu có thể.

### Static/PWA

1. Deep-link bất kỳ trả app shell, không trả 404.
2. Reload sau deploy lấy HTML/service worker mới; asset hash có cache immutable.
3. Cài PWA hoặc kiểm tra manifest/icons trên một trình duyệt hỗ trợ. Thử offline sau lần tải đầu.

## 5. Backup và restore

- Snapshot persistent volume theo khả năng host; tối thiểu copy `saves.json` định kỳ khi process đã dừng hoặc dùng snapshot nhất quán của volume.
- Mã hóa backup và giới hạn quyền truy cập vì file chứa save gắn với hash bearer token.
- Kiểm tra checksum và thực hiện restore drill ở staging. Backup chưa từng restore không được xem là đã kiểm chứng.
- Retention, RPO và RTO cần owner sản phẩm/hạ tầng quyết định trước public launch.
