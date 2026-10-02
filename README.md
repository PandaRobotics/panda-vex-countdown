# Panda Robotics — VEX 2026–2027 Timeline

## Tính năng
- Một trang cuộn dọc, timeline tự sắp xếp theo thời điểm gần nhất.
- VEX IQ màu xanh dương; VEX V5 màu đỏ; nền đen, viền/nhãn vàng, chữ trắng.
- Mỗi giải có countdown **ngày · giờ · phút · giây** cập nhật mỗi giây.
- Notebook deadline hiện dạng animation khi rê chuột/focus vào thẻ giải.
- Deadline cũng có mốc riêng trên timeline để không bị bỏ sót.
- Nội dung hai bên trượt vào khi cuộn xuống (IntersectionObserver).
- Lọc VEX IQ / VEX V5 và tùy chọn hiển thị mốc đã qua.

## Publish GitHub Pages
1. Giải nén ZIP.
2. Upload `index.html`, `style.css`, `script.js`, `events.json`, `README.md` vào root repo `panda-vex-countdown` (không upload cả thư mục lồng bên trong).
3. GitHub → repository → Settings → Pages.
4. Source: **Deploy from a branch**; Branch: **main**; Folder: **/(root)** → Save.
5. Chờ workflow Pages chạy xong trong tab Actions.
6. Mở `https://pandarobotics.github.io/panda-vex-countdown/`, nhấn Ctrl+F5 nếu còn cache.

## Chỉnh sửa dữ liệu
Chỉnh `events.json`:
- `events`: giải đấu
- `deadlines`: các mốc notebook độc lập
- `date`: ISO-8601 có timezone, ví dụ Việt Nam `2026-11-07T00:00:00+07:00`, Trung Quốc `2026-12-17T08:00:00+08:00`.
- Mỗi event có thể có `notebook: []` để hiện deadline dạng hover trong thẻ giải.
- Thêm/sửa dữ liệu không cần sửa HTML/CSS/JS.

## Lưu ý về dữ liệu nhập ban đầu
Các mốc được nhập từ infographic bạn gửi. Một vài dòng chữ nhỏ trong ảnh chưa đọc rõ (ngày dự bị/ngày vá và một số ghi chú notebook), nên README/chi tiết event đã đánh dấu cần xác nhận thay vì tự suy diễn. Kiểm tra lại giờ chính xác của các deadline trước khi công bố rộng rãi.
