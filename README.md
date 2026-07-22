# Cuộc Sống Sinh Viên — Visual Novel

Game này là một trang web tĩnh HTML/CSS/JS. Bạn có thể phát hành nhanh chóng bằng cách host thư mục dự án trên dịch vụ tĩnh hoặc bằng GitHub Pages.

## Chạy thử trên máy

- Mở terminal trong thư mục `knmmmm`.
- Chạy:
  - `python3 -m http.server 8000`
- Mở `http://localhost:8000` trong trình duyệt.

## Đóng gói để phân phối

- Dùng script đóng gói:
  - `sh ./build-release.sh`
- File đầu ra là `knmmmm-release.zip`.

## Phát hành lên GitHub Pages

1. Khởi tạo git nếu chưa có:
   - `git init`
   - `git add .`
   - `git commit -m "Initial release"`
2. Tạo repository trên GitHub.
3. Đẩy code lên GitHub:
   - `git remote add origin https://github.com/USERNAME/REPO.git`
   - `git branch -M main`
   - `git push -u origin main`
4. Bật GitHub Pages trong cài đặt repo:
   - Chọn source `main` branch và thư mục `/root`.

## Phát hành lên Netlify hoặc Vercel

- Netlify: kéo thả toàn bộ thư mục `knmmmm` vào Netlify Deploy.
- Vercel: dùng `vercel` CLI hoặc kết nối repo GitHub.

## Tệp chính

- `index.html`
- `css/style.css`
- `js/*.js`
- `assets/`

## Lưu ý

- Nếu có tệp `.DS_Store`, bạn có thể thêm vào `.gitignore` để tránh đẩy lên repo.
