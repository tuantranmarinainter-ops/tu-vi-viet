# Giao diện lá số Việt cho Tử Vi Việt (đợt 1): thiết kế

Ngày: 23/11/2026 · Nền: fork của MDuke235/tu-vi-viet v0.1 · Nơi triển khai: tuanchau.io.vn

## 1. Mục đích và lý do

Anh Tuấn muốn có một trang lập lá số Tử Vi tiếng Việt của riêng mình trên tuanchau.io.vn. Trang cần:

- Lập lá số theo lịch Việt, giao diện chuyên nghiệp, mang hơi hướng Việt Nam, phong thủy và hơi huyền ảo, nhưng phải rõ ràng, mạch lạc.
- Bày lá số theo cấu trúc quen thuộc của lá số Việt (tham chiếu lá số mẫu của lyso.vn).
- Xuất lá số và bài luận ra PDF. Anh Tuấn mang PDF đó sang trò chuyện với Claude để luận giải thêm.

Phần AI luận giải trong app tạm hoãn, không làm ở đợt này.

## 2. Mục tiêu

1. **Lá số kiểu Việt**, theo đúng mẫu đã duyệt (bản mẫu v3 trong cuộc trò chuyện ngày 23/11/2026):
   - Lưới 4×4, Thiên bàn ở giữa chiếm 2×2.
   - Mỗi cung gồm:
     - Dòng trên: can và chi (chi tô màu ngũ hành), tên cung viết hoa màu xanh dương đậm, số đại hạn, chữ "THÂN" ở cung Thân cư.
     - Giữa: chính tinh viết hoa, in đậm, căn giữa, kèm (M/V/Đ/B/H). Cung không có chính tinh ghi "Vô chính diệu".
     - Phụ tinh chia hai cột: cát tinh và Hóa Lộc/Quyền/Khoa bên trái, hung tinh và Hóa Kỵ bên phải.
     - Dòng dưới: "năm <chi>" (tiểu hạn), vòng Tràng sinh, "tháng <n>" (nguyệt hạn của năm xem).
   - Tuần và Triệt là nhãn nền đen chữ trắng, đặt trên ranh giới giữa hai cung.
   - Đường tam phương từ cung Mệnh tới Quan Lộc, Tài Bạch, Thiên Di: màu xám mờ, nằm dưới lớp chữ.
   - Cung đang chạy đại hạn được tô nền vàng nhạt và có viền vàng.
2. **Thiên bàn** ghi:
   - Họ tên (hoặc "(ẩn)").
   - Năm, tháng, ngày, giờ, mỗi dòng ba cột: dương lịch, âm lịch, can chi.
   - Năm xem kèm can chi và tuổi.
   - Âm Dương (ví dụ "Dương Nữ") kèm thuận lý hay nghịch lý.
   - Mệnh (nạp âm), Cục, quan hệ Cục với Mệnh, Thân cư cung nào.
   - Mệnh chủ, Thân chủ.
   - Dấu triện son "Tuấn Châu Lý Số", hình bát quái mờ, dòng "Đại hạn hiện tại".
3. **Trang nhập thông tin**, theo đúng bản mẫu đã duyệt:
   - Họ tên, giới tính, loại lịch, tháng nhuận.
   - Ngày giờ sinh: Giờ, Phút, Ngày, Tháng, Năm dạng ô chọn. Khi chọn âm lịch, giờ đổi sang 12 chi, tháng đổi sang Giêng…Chạp.
   - Nơi sinh, Năm xem (kèm can chi).
   - Tùy chọn: ẩn họ tên, ẩn ngày sinh, theo âm lịch GMT+8.
   - Mô tả bản thân.
   - "Tùy chọn nâng cao" thu gọn, gồm giờ mặt trời thực, giờ Tý từ 23:00, tháng nhuận, múi giờ.
   - Hai nút: Xem trước và Lập lá số.
4. **Phong cách chung:**
   - Khung chàm `#0B1650`, viền nhũ vàng `#E0A800`, nền lá số màu giấy dó `#FFF8E6`.
   - Phông Be Vietnam Pro cho nội dung, Noto Serif cho tiêu đề và dấu triện.
   - Màu ngũ hành bão hòa cao: Hỏa `#E8000B`, Mộc `#00A11A`, Thổ `#F08A00`, Kim `#6A6A6A`, Thủy `#000`.
5. **PDF:** bấm "In / lưu PDF" cho ra:
   - Trang 1: lá số khổ A4, giữ màu nền.
   - Các trang sau: bài luận 13 chủ đề hiện có.
   - Trang cuối: "Mô tả bản thân" nếu người dùng có nhập.
   - Không in thanh công cụ, nút bấm hay đầu trang.
6. **Hai bản đóng gói từ cùng một mã nguồn:**
   - `npm run build`: bản máy chủ Node, đủ tính năng, kể cả đối chiếu v4.
   - `npm run build:static`: bản web tĩnh trong `out/`, chép lên hosting của tuanchau.io.vn được, không cần Node. Bản này tắt tính năng v4.
7. **Toàn bộ chữ người dùng nhìn thấy trên trang lá số và trang nhập đều bằng tiếng Việt.**

## 3. Không làm ở đợt này

- Bổ sung các sao chỉ có trong tử vi Việt, như Lưu Hà, Quốc Ấn, Đường Phù, Văn Tinh, Đẩu Quân, Thiên La, Địa Võng. Đợt 1 chỉ hiển thị bộ sao engine đang có. Việc bổ sung và đối chiếu với lyso để sang **đợt 2**.
- Sao lưu niên ngoài những gì engine hoặc iztro đã tính sẵn.
- AI luận giải, `/api/interpret`, tài khoản, phân quyền, địa chỉ và điện thoại trong form.
- Việt hóa các trang thư viện cổ thư (`/library`), tri thức (`/knowledge`), hợp hôn (`/heming`).
- Sửa thuật toán an sao.

## 4. Những điều không được xảy ra

Nếu một trong các điều sau xảy ra thì coi là thất bại, dù app vẫn chạy:

- Giao diện mới làm sai lệch dữ liệu lá số: sao bị đặt nhầm cung, độ sáng hoặc đại hạn hiển thị khác với engine.
- Lá số in ra PDF bị tràn sang hai trang, mất màu, hoặc chữ nhỏ không đọc được.
- Còn sót chữ Hán hoặc chữ Trung Quốc trên trang lá số hay trang nhập.
- Bản web tĩnh gọi tới API không tồn tại, hoặc liên kết chia sẻ bị hỏng khi đặt trong thư mục con.
- Đưa con dấu, mã QR, logo hay thông tin liên hệ của lyso.vn vào app. Chỉ tham khảo cấu trúc.
- Thông tin sinh của người dùng bị gửi ra ngoài trình duyệt ở bản web tĩnh.

## 5. Ràng buộc

- **Mã nền:** Next.js 16 (App Router), React 19, Tailwind 3, Node 22.15 trở lên. Engine là iztro cộng `lib/ziwei/*`. Lịch Việt dùng `@nghiavuive/lunar_date_vi`.
- **Lá số được tính ngay trong trình duyệt** (`generateChart` trong `app/chart/page.tsx`), nên xuất web tĩnh được. Chỉ `/api/v4` cần máy chủ.
- **Giữ nguyên:** dữ liệu `ZiweiChart`, `BirthFormState`, định dạng liên kết chia sẻ và định dạng xuất JSON (`tuvi-viet-v1`), để link và file cũ vẫn mở được.
- **Môi trường của Claude:** chạy được Node 22, tsc, tsx, Playwright và tải mã từ GitHub, nhưng không cài được package từ npm. Toàn bộ app Next.js phải chạy thử trên máy anh Tuấn.
- **Giấy phép:** mã MIT, giữ thông tin tác giả gốc (Renhuai123, MDuke235, iztro).

## 6. Các cách đã cân nhắc

| Cách | Nội dung | Đánh đổi |
|---|---|---|
| 1. Làm lại giao diện trong app, xuất web tĩnh | Thay khung lá số và form, thêm kiểu in, `output: 'export'` | Bản tĩnh mất tính năng v4 |
| 2. Làm lại giao diện trong app, chạy máy chủ Node | Như cách 1 nhưng giữ đủ tính năng | Cần hosting có Node |
| 3. Trang HTML riêng chỉ có lá số | Đóng gói engine thành một trang duy nhất | Mất luận giải, lịch sử, chia sẻ |

**Đã chọn:** cách 1 và cách 2 cùng lúc. Một mã nguồn, hai lệnh đóng gói. Lý do: giữ được hết giá trị của app MDuke, có bản tĩnh dễ đưa lên web, có bản Node khi cần đủ tính năng.

Về bộ sao: anh Tuấn chọn **đợt 1 trước**, tức là giao diện mới với bộ sao hiện có. Bộ sao Việt làm ở đợt 2.

## 7. Thiết kế chi tiết

### 7.1 Thành phần mới hoặc thay đổi

| Tệp | Việc |
|---|---|
| `components/la-so/LaSoViet.tsx` | Khung lá số 4×4 mới, thay `ChartBoard` trên trang `/chart` |
| `components/la-so/CungViet.tsx` | Một ô cung, thay `PalaceCell` |
| `components/la-so/ThienBan.tsx` | Ô Thiên bàn ở giữa |
| `components/la-so/la-so.css` | Bảng màu, phông, kiểu in (`@media print`, `@page { size: A4 }`) |
| `lib/la-so/hien-thi.ts` | Các hàm thuần: phân loại cát/hung, quy đổi độ sáng, màu ngũ hành, tiểu hạn, nguyệt hạn, vị trí Tuần/Triệt, dữ liệu Thiên bàn |
| `lib/la-so/ngu-hanh.ts` | Bảng ngũ hành của từng sao và từng địa chi |
| `components/BirthForm.tsx` | Đổi giao diện theo mẫu form đã duyệt, giữ nguyên `BirthFormState` và logic kiểm tra. Thêm `moTa` (mô tả bản thân), `anHoTen`, `anNgaySinh`, `namXem` |
| `app/chart/page.tsx` | Dùng `LaSoViet`, bọc trong khung chàm. Thêm khối "Mô tả bản thân" để in. Ẩn phần v4 khi chạy bản tĩnh |
| `next.config.js`, `package.json` | Thêm `build:static`, cấu hình `output: 'export'` và `basePath` theo biến môi trường |
| `scripts/regression/la-so-hien-thi.test.ts` | Kiểm thử các hàm trong `lib/la-so` |

`ChartBoard` và `PalaceCell` cũ giữ lại trong mã nhưng không dùng trên `/chart`.

### 7.2 Quy đổi dữ liệu engine sang hiển thị Việt

- **Độ sáng:** quy 7 mức sang 5 mức.

  | Engine | 庙 | 旺 | 得 | 利 | 平 | 不 | 陷 |
  |---|---|---|---|---|---|---|---|
  | Hiển thị | M | V | Đ | Đ | B | H | H |

  Sao không có độ sáng thì không ghi ngoặc. (Lựa chọn của Claude, cần đối chiếu với lá số mẫu.)
- **Cát hay hung:** dựa vào `star.type` (`lucky` và `sha`). Với `minor` và các vòng sao, dùng một bảng phân loại trong `ngu-hanh.ts`. Tứ hóa: Lộc, Quyền, Khoa đặt cột trái màu xanh lá đậm; Kỵ đặt cột phải màu đen đậm. Mỗi tứ hóa là một dòng riêng "Hóa Lộc (Đ)", theo cách lá số mẫu đang hiển thị.
- **Vòng sao:**
  - Hiển thị vòng Bác sĩ, vòng Thái Tuế (đổi tên sang tiếng Việt: 岁建→Thái Tuế, 晦气→Thiếu Dương, 丧门→Tang Môn, 贯索→Thiếu Âm, 官符→Quan Phù, 小耗→Tử Phù, 大耗→Tuế Phá, 龙德→Long Đức, 白虎→Bạch Hổ, 天德→Phúc Đức, 吊客→Điếu Khách, 病符→Trực Phù) và vòng Tràng sinh.
  - Ẩn vòng Tướng tiền (将前12神), vì lá số Việt không dùng.
  - Bảng đối chiếu tên vòng Thái Tuế ở trên là theo hiểu biết của Claude. Cần kiểm với lá số mẫu trước khi chốt.
- **Tên sao:** lấy từ `lib/i18n/vi.ts`. Thiếu tên nào thì bổ sung vào đó. Kiểm thử phải xác nhận mọi tên sao engine sinh ra đều có bản tiếng Việt.
- **Tiểu hạn ("năm <chi>"):** với mỗi cung, ghi năm có chi rơi vào cung đó theo quy tắc tiểu hạn. Nếu iztro có sẵn (`ages`) thì dùng, không thì tự tính: khởi cung theo tam hợp của chi năm sinh, nam đi thuận, nữ đi nghịch.
- **Nguyệt hạn ("tháng <n>"):** tính Đẩu Quân của năm xem.
  - Từ cung có chi của năm xem, đếm nghịch đến tháng sinh, rồi đếm thuận đến giờ sinh. Cung đó là tháng Giêng.
  - Các tháng sau đi thuận.
- **Tuần và Triệt:**
  - Lấy cặp cung chứa 旬空/副旬 và 截空/副截 từ engine.
  - Hai cung luôn kề nhau trên vòng, nên tính được đường ranh chung trong lưới và đặt nhãn ở giữa đường đó.
  - Bỏ các sao này khỏi danh sách phụ tinh để không hiện trùng.
- **Đại hạn đang chạy:** `palace.isCurrentDaXian` tính theo năm xem. Khi đổi năm xem, phải tính lại.
- **Sao lưu niên "L.":** đợt 1 chỉ gồm lưu tứ hóa (`getLiuNianSiHua`) và các sao lưu niên iztro có sẵn (lưu Lộc Tồn, Kình Dương, Đà La, Thiên Mã, Khôi, Việt, Xương, Khúc). Thêm tiền tố "L." và đặt theo cột cát hay hung.

### 7.3 Năm xem và các lớp vận hạn

- "Năm xem" trên form là năm mặc định. Trên trang lá số có ô đổi năm xem.
- Khi đổi năm xem, những thứ sau thay đổi theo: tuổi, sao "L.", nguyệt hạn, đại hạn đang chạy.
- `TimeNav` cũ (bản mệnh / đại hạn / lưu niên) được thay bằng ô năm xem đó. Lá số luôn hiển thị bản mệnh cộng sao lưu niên của năm xem, giống lyso.

### 7.4 Bố cục trang `/chart`

```
┌ khung chàm ─────────────────────────────────────┐
│ TUANCHAU.IO.VN · LÁ SỐ TỬ VI                     │
│ [Sửa thông tin] [Năm xem ▾] [Sao chép liên kết]  │  ← không in
│ [Lưu JSON] [In / lưu PDF]                        │
│ ┌ giấy dó: lá số 4×4 ─────────────────────────┐ │  ← trang 1 khi in
│ └─────────────────────────────────────────────┘ │
│ Chú thích ngũ hành                               │
│ Luận giải 13 chủ đề (VietnameseReadings)         │  ← trang 2 trở đi
│ Mô tả bản thân (nếu có)                          │  ← trang cuối
│ Chân trang: nguồn, giấy phép                     │
└──────────────────────────────────────────────────┘
```

- Màn hình hẹp: lá số giữ chiều rộng tối thiểu khoảng 680px và cuộn ngang (như hiện tại).
- Khi in: lá số co vừa chiều ngang A4, giữ màu nền (`print-color-adjust: exact`), không bị cắt giữa trang.

### 7.5 Hai bản đóng gói

- **`build:static`:**
  - Đặt `STATIC_EXPORT=1`.
  - `next.config.js` bật `output: 'export'`, `images.unoptimized`, `trailingSlash: true`, và `basePath` lấy từ `TUVI_BASE_PATH` (để trống nếu đặt ở gốc tên miền).
  - `/api/v4` và các trang cần máy chủ bị loại khỏi bản này. Cách loại để người làm quyết định (xem mục 9).
  - Giao diện ẩn nút và khối v4 qua `NEXT_PUBLIC_STATIC=1`.
- **`build`:** giữ như hiện tại.
- **Liên kết chia sẻ:** `new URL('/chart', …)` phải cộng thêm `basePath`.

### 7.6 Kiểm thử

- **Kiểm thử thuần** (chạy bằng tsx, không cần Next):
  - Quy đổi độ sáng.
  - Màu ngũ hành của 12 chi và các chính tinh.
  - Tiểu hạn, nguyệt hạn, vị trí ranh Tuần/Triệt cho cả 12 cặp có thể xảy ra.
  - Mọi tên sao đều có bản tiếng Việt.
- **Đối chiếu với lá số mẫu** (ảnh lyso anh Tuấn gửi: dương lịch 24/4/1988, 07:15, Nữ, năm xem 2026):
  - Phần không phụ thuộc bộ sao Việt phải khớp: chính tinh và độ sáng, số đại hạn, Tràng sinh, tiểu hạn, nguyệt hạn, Tuần/Triệt, các dòng Thiên bàn.
  - Phụ tinh chỉ có trong tử vi Việt thì ghi nhận cho đợt 2, không tính là lỗi.
- **Kiểm tra trực quan:** chụp màn hình trang `/chart` và bản in PDF trên máy anh Tuấn, gửi lại để duyệt. Nếu Claude dựng được engine từ mã GitHub, Claude tự đối chiếu số liệu trước.

## 8. Những gì đã chốt (theo lời anh Tuấn)

- Nền: MDuke235/tu-vi-viet.
- Làm cả bản web tĩnh và bản Node.
- Cấu trúc lá số theo lyso. Mẫu giao diện là bản v3 đã duyệt:
  - Chính tinh in đậm, màu bão hòa cao.
  - Đường tam phương màu xám mờ, nằm dưới chữ.
- Toàn bộ chữ bằng tiếng Việt.
- Trang nhập theo mẫu form đã duyệt.
- AI luận giải tạm hoãn. Anh Tuấn sẽ mang PDF sang Claude.
- Làm đợt 1 trước, bộ sao Việt để đợt 2.

## 8b. Những gì Claude tự quyết (anh Tuấn kiểm tra lại)

- **Xem trước và Lập lá số:** "Xem trước" chỉ hiện lá số, không lưu vào lịch sử trên máy. "Lập lá số" hiện lá số và lưu vào lịch sử.
- **Ẩn ngày sinh:** ẩn các con số ngày, tháng, giờ (cả dương lẫn âm) và can chi của ngày, giờ. Vẫn giữ can chi năm và tuổi, vì cần cho việc luận giải.
- **Ẩn họ tên:** Thiên bàn ghi "(ẩn)", tiêu đề trang không ghi tên.
- **Theo âm lịch GMT+8:** tương ứng với `calendarSystem: 'chinese'` đang có. Bỏ chọn thì dùng lịch Việt.
- **Mô tả bản thân:**
  - Lưu trong lịch sử trên máy và in kèm PDF.
  - Không đưa vào liên kết chia sẻ, vì liên kết có thể bị gửi đi.
  - Có ghi vào tệp JSON xuất ra.
- **Nút sáng/tối:** bỏ nút đổi giao diện sáng/tối trên `/chart`. Trang dùng một phong cách cố định đã duyệt.
- **Tên hiển thị trên đầu trang:** "TUANCHAU.IO.VN · LÁ SỐ TỬ VI". Dấu triện ghi "Tuấn Châu Lý Số".

## 9. Để người làm tự quyết

- Cách loại `/api/v4` khỏi bản tĩnh. Ví dụ: script đổi tên tạm thư mục route trước khi build, hoặc dùng `pageExtensions` riêng cho các route chỉ chạy trên máy chủ.
- Cách nạp phông: `next/font/google` hay tự chứa tệp phông.
- Có giữ hiệu ứng xuất hiện (framer-motion) cho ô cung hay không. Nếu giữ thì phải tắt khi in.
- Vị trí chính xác của bát quái, dấu triện và dòng đại hạn trong Thiên bàn khi có nhiều dữ liệu.
- Màu cụ thể cho từng phụ tinh, dựa theo bảng ngũ hành truyền thống.
