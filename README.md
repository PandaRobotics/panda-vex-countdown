# Panda Robotics — VEX Competition Countdown

Repository tĩnh cho GitHub Pages. Giao diện Panda Robotics, VEX IQ xanh, VEX V5 đỏ, countdown realtime và mức cảnh báo tăng dần khi ngày thi đến gần.

## Files
- `index.html` — cấu trúc website
- `style.css` — giao diện
- `script.js` — countdown, filter, urgency
- `events.json` — **chỉ cần sửa file này để thêm/sửa giải**

## Publish bằng GitHub Pages

1. Tạo repository mới, ví dụ `panda-vex-countdown`.
2. Upload `index.html`, `style.css`, `script.js`, `events.json`, `README.md`.
3. Vào `Settings → Pages`.
4. `Build and deployment → Source: Deploy from a branch`.
5. Chọn `main` và `/ (root)`, rồi `Save`.
6. Website sẽ có dạng:
   `https://YOUR-USERNAME.github.io/panda-vex-countdown/`

## Thêm sự kiện

Sửa `events.json`, ví dụ:

```json
{
  "id": "vex-iq-2027",
  "name": "VEX IQ Competition",
  "type": "VEX IQ",
  "date": "2027-02-20T08:00:00+07:00",
  "location": "Ho Chi Minh City, Vietnam",
  "icon": "🏆"
}
```

`type` dùng `VEX IQ` hoặc `VEX V5`.

Timezone Việt Nam: `+07:00`. Trung Quốc: `+08:00`.

## Mức countdown

- >60 ngày: 🗓️
- 30–60 ngày: 📅
- 14–30 ngày: ⏳
- 7–14 ngày: ⏰
- 3–7 ngày: ⚠️
- 1–3 ngày: 🔥
- <24 giờ: 🚨
- ngày thi: EVENT DAY

## Custom domain

Sau khi website hoạt động, có thể cấu hình domain riêng trong `Settings → Pages → Custom domain`, ví dụ `countdown.pandarobotics.edu.vn`, rồi thêm DNS record tương ứng tại nhà cung cấp domain.

## Kiến trúc

Không cần backend/database. Trình duyệt tải `events.json`, sau đó JavaScript tự tính thời gian còn lại mỗi giây. Vì vậy GitHub Pages là đủ.
