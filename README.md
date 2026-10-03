# Panda Robotics — VEX 2026–2027 Timeline

## Tính năng
- Một trang cuộn dọc, timeline tự sắp xếp theo thời điểm gần nhất.
- VEX IQ màu xanh dương; VEX V5 màu đỏ; nền đen, viền/nhãn vàng, chữ trắng.
- Mỗi giải có countdown **ngày · giờ · phút · giây** cập nhật mỗi giây.
- Notebook deadline hiện dạng animation khi rê chuột/focus vào thẻ giải.
- Deadline cũng có mốc riêng trên timeline để không bị bỏ sót.
- Nội dung hai bên trượt vào khi cuộn xuống (IntersectionObserver).
- Lọc VEX IQ / VEX V5; giữ các mốc đã qua bằng màu xám và hiển thị Now trực tiếp.

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

## Logo và giải quan trọng
Mỗi phần tử trong `events` có hai trường mới:

```json
"logo": "assets/logos/ten-giai.png",
"important": true
```

- `logo`: đường dẫn ảnh trong repository hoặc URL HTTPS. Nếu để `""` hoặc ảnh không tải được, thẻ vẫn có ô logo dự phòng. Có thể dùng PNG, SVG hoặc WebP; ảnh được giữ đúng tỷ lệ.
- `important`: `true` bật viền lửa động và nhãn giải quan trọng; `false` tắt. Hiện tất cả giải mặc định là `false` để bạn tự chọn. Khi mốc đã qua, viền lửa tắt và thẻ chuyển màu xám.

## Mốc Now
- Các mốc đã qua luôn được giữ ở phía trên Now trên timeline dọc.
- Now cập nhật mỗi giây, nội suy vị trí theo thời gian giữa hai mốc liền kề (gồm cả notebook deadline). Khoảng cách thẻ giữ đủ rộng để nội dung dễ đọc.
- Trước mốc đầu và sau mốc cuối có khoảng đệm tương ứng 30 ngày; ngoài khoảng này Now dừng ở đầu/cuối thanh.
- Khi mở trang, trang tự cuộn đến Now một lần. Nút **Đến Now ↓** giúp quay lại khi đang xem những mốc khác.
- Bộ lọc IQ và V5 đều bao gồm giải kết hợp IQ + V5. Đồng hồ Now hiển thị giờ Việt Nam; vị trí và countdown dùng thời điểm ISO có múi giờ trong dữ liệu.
- Các ngày/giờ giải và notebook giữ nguyên dữ liệu gốc. Các trường `display` và `date` có một số giờ không khớp nhau; cần kiểm tra với ban tổ chức trước khi cập nhật dữ liệu.
