# Nội dung website

## Lịch giải và Notebook

File: `public/data/events.json`. Giữ schema hiện tại của countdown:

- `events`: các giải đấu; `id` phải duy nhất.
- `date`: ISO-8601 có múi giờ, ví dụ `2027-01-09T08:00:00+07:00`.
- `type`: `VEX IQ` hoặc `VEX V5`. Giải chung hiện dùng cấu hình của trang countdown; không tự đổi schema khi thêm dữ liệu.
- `logo`: đường dẫn tương đối từ trang countdown, ví dụ `../assets/images/events/national-v5.png`; cũng hỗ trợ URL HTTPS.
- `important: true`: bật viền nổi bật chuyển động.
- `notebook`: các deadline nằm trong thẻ giải; `deadlines` giữ các mốc timeline độc lập theo schema hiện tại.

Đối chiếu giờ với ban tổ chức trước khi sửa. Toàn bộ lịch local được giữ lại khi tổ chức thư mục.

## Thành tích

File: `public/data/achievements.json`. Mỗi phần tử là một cột mốc:

```json
{
  "season": "2025–2026",
  "system": "V5",
  "category": "signature",
  "event": "Tên giải đấu",
  "detail": "Thời gian · địa điểm · mã đội",
  "awards": ["Tên giải thưởng đã xác nhận"],
  "source": "https://www.facebook.com/pandaroboticsvn"
}
```

Đặt mốc mới ở đầu danh sách. Bộ lọc mùa được tạo tự động. `system` dùng `IQ` hoặc `V5`. Ghi rõ hạng thi đấu và mã đội khi có xác nhận; không biến thứ hạng hoặc suất tham dự thành giải thưởng.

Danh sách hiện tổng hợp 14 cột mốc đã xác nhận; chưa khẳng định đã bao quát toàn bộ bài cũ của fanpage. Các mốc trước khi CLB thành lập tháng 6/2024 được ghi nhận như hành trình tiền thân và đội ngũ huấn luyện.

Phân nhóm bằng trường `category`: `world` (Worlds), `national` (quốc gia và vòng loại), `signature` (Signature), `other` (giao hữu). Mỗi nhóm có tiêu đề riêng và vẫn áp dụng bộ lọc mùa/IQ/V5.

## Slideshow ảnh
Mỗi giải thưởng có slideshow riêng. Thêm ảnh đã xác nhận đúng sự kiện vào mảng `photos` của cột mốc:

```json
"photos": [{"src":"assets/images/achievements/ten-anh.jpg","alt":"Panda tại lễ trao giải","source":"https://www.facebook.com/...","award":"Tên giải thưởng khớp mục awards"}]
```

Bỏ `award` khi ảnh chung của sự kiện phù hợp với tất cả giải thưởng trong cột mốc. Chỉ dùng ảnh từ bài đăng đã xác nhận, không gán ảnh của giải khác. Slideshow có từ hai ảnh tự chạy mỗi 5,5 giây, dừng khi rê chuột/focus hoặc tab bị ẩn.

## Ảnh từng giải đấu
Mỗi sự kiện có thư mục riêng trong `public/assets/images/achievements/`, khai báo bằng `photoFolder` trong `public/data/achievements.json`. Thêm hoặc xoá ảnh JPG, PNG, WebP, GIF, AVIF trong thư mục, rồi tải lại trang khi chạy `npm run dev`. Thứ tự theo tên file; dùng tiền tố 01, 02 để sắp xếp. Ảnh xoá khỏi thư mục sẽ biến mất khỏi slideshow.
Với Live Server, chạy `npm run sync:photos` rồi tải lại trang. Trước triển khai static hosting, chạy `npm run build` để cập nhật danh sách ảnh; trên Cloudflare dùng build command `npm run build`, output directory `public`. Trình duyệt trên hosting tĩnh không tự đọc thư mục, nên cần build và deploy lại sau khi thay ảnh.
