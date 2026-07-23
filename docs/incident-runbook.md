# Incident runbook

## 1. Phân loại

- SEV-1: mất dữ liệu, lộ token, API hoàn toàn không dùng được.
- SEV-2: save conflict tăng mạnh, deploy lỗi, latency cao.
- SEV-3: lỗi UI/content không chặn hành trình.

## 2. Ứng phó

1. Ghi thời điểm, deployment ID, request ID mẫu, phạm vi ảnh hưởng. Không sao chép token/save payload vào ticket.
2. Nếu đang bị tấn công, bật rate-limit/WAF nghiêm hơn; chỉ allow path/method cần thiết.
3. Nếu deploy gây lỗi, rollback backend image và static artifact trước. Không chạy migration phá hủy.
4. Nếu nghi lộ bí mật, thu hồi và xoay secret/token; kiểm tra audit log.
5. Nếu save lỗi, ngắt backend khỏi traffic ghi nhưng giữ nguyên persistent disk và local save. Sao chép `saves.json` trước thao tác sửa chữa.
6. Xác minh health, CORS, auth, ETag, idempotency, bốn slot và frontend offline trước mở traffic.

## 3. Phục hồi

Thông báo trạng thái không hứa thời gian thiếu căn cứ. Theo dõi 30 phút sau phục hồi. Viết postmortem gồm timeline, nguyên nhân, tác động, biện pháp và owner. Giữ bằng chứng theo chính sách dữ liệu.
