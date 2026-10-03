# Panda Robotics Web

Website tĩnh gồm landing page, hành trình thành tích và VEX Countdown. HTML, CSS và JavaScript thuần; không cần cài thư viện hoặc build.

## Chạy trên local

Cần Node.js 20 trở lên. Mở terminal tại thư mục dự án:

```sh
npm run dev
```

- Trang chủ: http://127.0.0.1:5173/
- Countdown: http://127.0.0.1:5173/vex-countdown/
- Kiểm tra đường dẫn và dữ liệu: `npm run check`

Hoặc dùng Live Server trong VS Code: cấu hình tại `.vscode/settings.json` đã đặt thư mục phục vụ là `public/`. Nếu Live Server đang chạy, dừng rồi bật lại để nhận cấu hình. Trang chủ là http://127.0.0.1:5500/ và countdown là http://127.0.0.1:5500/vex-countdown/.

Không mở HTML bằng `file://`: trình duyệt cần HTTP để đọc JSON.

## Cấu trúc

```text
public/                       Thư mục website, nguồn duy nhất để chạy và xuất bản
  index.html                  Landing page
  404.html                    Trang lỗi
  _redirects                  Quy tắc URL Cloudflare Pages
  vex-countdown/index.html    Trang countdown
  assets/
    css/                      landing.css, countdown.css, achievements.css
    js/                       countdown.js, achievements.js
    images/
      brand/                  Logo Panda Robotics dùng chung
      events/                 Logo giải đấu IQ, V5, Signature
  data/
    events.json               Lịch giải và notebook
    achievements.json         Thành tích theo mùa và nguồn xác nhận
scripts/                      Local server và kiểm tra website
docs/                         Hướng dẫn nội dung và hosting
.vscode/settings.json         Cấu hình Live Server
package.json                  Các lệnh local, không có dependencies
```

## Chỉnh nội dung và mở rộng

- Chỉnh lịch tại `public/data/events.json`, thành tích tại `public/data/achievements.json`.
- Thêm ảnh vào `public/assets/images/`, dùng tên chữ thường không dấu, phân tách bằng dấu gạch ngang.
- Thêm trang mới bằng `public/ten-trang/index.html`, rồi thêm link menu. CSS/JS trang đó đặt trong `assets/css` và `assets/js`.
- Trang gốc dùng đường dẫn `assets/...`; trang nằm một cấp sâu dùng `../assets/...`.
- Chạy `npm run check` và xem giao diện local trước khi xuất bản.

Chi tiết: [dữ liệu nội dung](docs/content.md) và [Cloudflare Pages](docs/cloudflare.md).

## Bản sao an toàn khi tổ chức lại

Các file gốc và bản `public/` cũ được chuyển vào `.local-backup/` tại bản dự án Downloads. Thư mục này bị Git bỏ qua, không đưa lên website. Các ảnh không còn dùng vẫn nằm trong bản sao này. Có thể dùng để khôi phục nếu cần.

Chưa commit, push GitHub hoặc cập nhật website chính thức trong đợt tổ chức local này.
