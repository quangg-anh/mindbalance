# Bảo mật và giảm thiểu DDoS

## Biên bảo vệ

Không tuyên bố chống DDoS tuyệt đối. Cloudflare hấp thụ lưu lượng ở edge; Worker vẫn áp quota domain.

- WAF allowlist `/v1/health`, `/v1/saves/{0..3}`; chặn method/content-type khác.
- Giới hạn body 256 KiB trước Worker. Save tối đa bốn slot/session.
- Rate limit đề xuất: health 120/phút/IP, read 60/phút/session, write 20/phút/session; burst nhỏ.
- Token chỉ qua `Authorization`; log redacted, không ghi token hoặc save payload.
- Save dùng ETag, `If-Match`, idempotency key. Dữ liệu dùng `private, no-store`.
- CORS allowlist chính xác; không wildcard khi có credential/token.
- Secrets dùng Wrangler secrets, không commit. Xoay token/secret khi nghi lộ.
- Static asset hash dùng `immutable`; HTML revalidate ngắn.

## VPS tương lai

Cloudflare Tunnel outbound-only. Không public origin IP trong DNS. Firewall deny ingress public; quản trị qua mạng riêng/Zero Trust. Theo dõi request ID, tỷ lệ 401/403/413/429/5xx, KV latency và chi phí.
