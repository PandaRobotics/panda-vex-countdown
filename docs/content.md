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

## Quản lý thành tích bằng một file JSON

**Chỉ sửa `public/data/achievement-catalog.json`.** `public/data/achievements.json` là kết quả được tạo tự động để website sử dụng; không sửa file đó bằng tay.

Dữ liệu theo cây `seasons → competitions → awards`:

- Mùa giải: `id`, `yearStart`, `yearEnd`, `label` (2025–2026), `name` (tên mùa giải), `enabled`.
- Giải đấu: `id`, `name`, `time.start`, `time.end`, `time.label`, `system` (IQ/V5), `category` (world/national/signature/other), `articleUrl`, `photoFolder`, `enabled`, `displayOrder`.
- Giải thưởng: `id`, `teamName`, `teamIds` (một hoặc nhiều mã đội), `name`, `photoFolder`, `enabled`, `displayOrder`.
- `metadata` lưu mô tả, địa điểm, thông tin đội, thứ hạng, ghi chú và nguồn bổ sung từ dữ liệu cũ. `photoMetadata` là tùy chọn để giữ chú thích/nguồn cho ảnh theo tên file; không phải danh sách ảnh bắt buộc.

`enabled: false` ẩn toàn bộ nhánh tương ứng nhưng giữ nguyên dữ liệu/ảnh. `displayOrder` nhỏ hơn đứng trước; bỏ trường này để giải tự sắp theo ngày bắt đầu mới nhất trước. Mùa mới nhất luôn đứng trước. ID chỉ gồm chữ thường không dấu, số và dấu gạch ngang; ID mùa/giải không được trùng nhau, ID giải thưởng không được trùng trong cùng giải.

Ngày dùng `YYYY-MM-DD`. Chưa biết ngày chính xác thì để `null` và ghi tháng/năm hoặc thời gian đã biết trong `time.label`. Không suy mùa chỉ từ tháng 5: VEX Worlds tháng 5 thuộc mùa kết thúc. Khi thêm giải, tự chọn đúng mùa và kiểm tra nguồn.

### Cây thư mục ảnh

```text
public/assets/images/achievements/
└── 2025-2026/
    └── vex-worlds-2026-v5/
        ├── shared/                         ảnh chung của giải
        └── awards/
            ├── 62024p/
            │   └── 01-top-2-pit-design-contest/
            └── 62024n/
                └── 05-robot-skills-hang-34-424/
```

Mỗi `photoFolder` là đường dẫn từ `public`, ví dụ `assets/images/achievements/2025-2026/vex-worlds-2026-v5/shared`. Trong mỗi thư mục, toàn bộ JPG/JPEG/PNG/WebP/AVIF/GIF được tự liệt kê theo tên file. Dùng `01-ten-anh.webp`, `02-ten-anh.webp` để quyết định thứ tự. Không đưa ảnh vào thư mục con ngoài cấu trúc đã khai báo. `.gitkeep` chỉ giữ thư mục trống trên Git, không hiển thị.

Các ảnh hiện có được giữ trong `shared` vì chưa xác nhận chính xác ảnh nào thuộc từng giải thưởng. Bạn có thể chuyển ảnh sang thư mục riêng của giải thưởng tương ứng; không cần nhân bản ảnh. Khi thư mục riêng có ảnh, slideshow trình diễn hết ảnh của giải thưởng đó rồi chuyển sang giải thưởng kế tiếp. Nếu thư mục riêng trống, sử dụng ảnh chung. Khi tất cả thư mục ảnh của giải đều trống, giải không hiện trên slideshow; dữ liệu vẫn được giữ lại.

### Thêm hoặc sửa

1. Mở `achievement-catalog.json`, thêm mùa giải nếu cần.
2. Sao chép một đối tượng giải đấu vào `competitions`; đổi ID, tên, thời gian, hệ thi đấu, phân loại, link bài viết và đường dẫn ảnh.
3. Trong `awards`, thêm từng giải thưởng với tên đội, mã đội, tên giải thưởng và thư mục ảnh riêng. Để `teamIds: []` nếu chưa xác nhận mã đội.
4. Tạo các thư mục đúng đường dẫn rồi bỏ ảnh vào `shared` hoặc từng thư mục giải thưởng.
5. Khi chạy `npm run dev`, tải lại trang để cập nhật. Với Live Server, chạy `npm run sync:photos` trước khi tải lại.

Website trên Cloudflare là website tĩnh: sau khi sửa JSON hoặc ảnh, cần build/deploy lại. Build command vẫn là `npm run build`, output directory `public`. File JSON không thể khiến trình duyệt trên hosting tĩnh tự đọc thư mục server.

`npm run check:achievements` kiểm tra schema, ID, ngày, đường dẫn ảnh, bật/tắt và việc tự quét thư mục; cũng chạy trong build. `npm run build` tạo lại HTML thành tích cho SEO. Không sửa vùng HTML `achievements:start/end` bằng tay.

## Bật/tắt sự kiện countdown
Chỉ sửa `public/data/events.json`, không đặt dữ liệu trong JavaScript giao diện. Mỗi giải có `enabled: true` (hiển thị) hoặc `enabled: false` (ẩn). Khi thiếu `enabled`, mặc định vẫn hiển thị. `important` chỉ điều khiển viền, không quyết định hiển thị.
Deadline độc lập có `eventId` trỏ tới `id` giải: tắt hoặc xoá giải sẽ ẩn deadline liên quan và loại khỏi bảng NOW. Deadline cũng có `enabled` riêng; deadline trong `notebook` hỗ trợ tương tự. Khi thêm giải, dùng `id` duy nhất, điền ngày có múi giờ, logo, notebook và bật `enabled`. Tải lại trang sau khi sửa.

