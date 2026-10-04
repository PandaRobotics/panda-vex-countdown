# Cloudflare Pages

Website có nguồn duy nhất trong `public/`, cùng cấu trúc dùng trên local.

- Repository: PandaRobotics/panda-vex-countdown
- Production branch: main
- Framework: None
- Build command: `npm run build`
- Build output directory: `public`
- Root directory: thư mục repository (để trống)
- Không cần biến môi trường hoặc cài dependencies.

Trang chủ ở `/`; countdown ở `/vex-countdown/`.

Khi đã kiểm tra và sẵn sàng xuất bản, commit các thay đổi rồi push GitHub. Cloudflare Pages đang kết nối nhánh main nên push vào main sẽ cập nhật website chính thức. Việc chạy `npm run dev` hoặc `npm run check` không xuất bản website.

Đợt tổ chức lại này chỉ thay đổi local, chưa push.
