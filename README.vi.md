# Tử Vi Việt — v0.1

Bản phát hành đầu tiên, package `0.1.0`. Mã nguồn: [MDuke235/tu-vi-viet](https://github.com/MDuke235/tu-vi-viet). Xem [ghi chú phát hành v0.1](docs/releases/v0.1.md).

## Mở ứng dụng

Trong folder hiện tại, Node portable đã được chuẩn bị ở `work/runtime` và đã kiểm SHA-256 từ nodejs.org. Không thay đổi Node của hệ thống.

Nhấp đúp `Chay-TuVi.cmd`, hoặc mở PowerShell:

```powershell
cd C:\Xem_TuVi
npm.cmd run dev -- --port 3100
```

Mở http://127.0.0.1:3100/chart . Giữ cửa sổ lệnh mở; nhấn Ctrl+C để dừng. Nếu đang có bản app chạy ở cổng này thì chỉ cần mở liên kết đó.

Để chạy bản production:

```powershell
npm.cmd run build
npm.cmd run start -- --port 3100
```

Khi cài mới repo: dùng Node 22.15+ trong nhánh 22.x, hoặc Node >=24; chạy `npm.cmd ci` trước khi mở app. Trên Windows x64 có thể dùng `powershell -File scripts/dev/install-runtime.ps1` để tải và kiểm bản Node 22 LTS portable trong repo. Script không sửa Node của hệ thống. `run.mjs` tự dùng runtime portable khi Node hiện tại chưa phù hợp.

## Chức năng đã có

- Nhập ngày dương hoặc âm, có tháng nhuận; lựa chọn lịch Việt hoặc lịch Trung Quốc để đối chiếu.
- Múi giờ UTC+7, +8, +9 và nhập độ lệch UTC theo phút; nơi sinh tham khảo hoặc kinh độ tự nhập.
- Giữ giờ đồng hồ hoặc chọn giờ mặt trời thực; chọn quy tắc đổi ngày từ 23:00 và xử lý tháng nhuận.
- Tên sao, cung, can chi và giao diện chính bằng tiếng Việt; chọn cung/sao để xem nội dung.
- Bản mệnh, đại hạn và lớp tứ hóa lưu niên dùng chung một trạng thái điều khiển.
- Lịch sử lưu tại trình duyệt, chia sẻ bằng URL, xuất JSON và in/lưu PDF từ trình duyệt.
- Diễn giải tiếng Việt cơ bản cho 13 chủ đề, có bằng chứng từ sao/cung, không gọi AI.
- Bốn mục Tổng quan, Sự nghiệp, Tài chính và Tình cảm có bài mở rộng: chính tinh theo chủ đề, Mệnh–Thân, tam phương tứ chính, tứ hóa, cặp phụ tinh đủ điều kiện và câu hỏi đối chiếu. Mỗi nhận xét có phần mở căn cứ/nguồn; nội dung biên soạn được ghi rõ, chưa được chuyên gia thẩm định.
- Đối chiếu v4 với engine tại tag phát hành, kiểm record, checksum và đọc luồng từ tệp nén theo năm.

Thông tin sinh gốc và các lựa chọn được giữ trong lịch sử, URL và bản xuất. Liên kết chia sẻ chứa thông tin sinh: chỉ chia sẻ khi bạn muốn người nhận xem thông tin đó. Không biết giờ sinh thì ứng dụng không tự tạo lá số giờ Tý.

## Dùng v4 mà không giải nén toàn bộ

Mở phần **Đối chiếu luận giải v4 gốc** trên một lá số. Nếu không khớp engine tham chiếu, app báo rõ và không gắn bài. Muốn nghiên cứu bản gốc, vào **Quy tắc lập lá số**, chọn **Engine tại tag v4.0-13d**; lựa chọn này chuyển sang lịch gốc.

Lần đầu đọc một năm cần Internet để tải tệp nén khoảng 2 MB; app kiểm SHA-256. Cache ở `data/v4/`, không có tệp JSONL giải nén 700 MB. Một năm mẫu 1990 đã được tải để kiểm tra. Không tải hết 77 năm khi khởi động.

### Bản dịch tiếng Việt có thể tái sử dụng

1. Sau khi đọc được record v4, chọn **Xuất tệp để dịch**.
2. Dịch `sourceText` vào trường `translation` bằng công cụ bạn chọn. Giữ nguyên `sourceHash`, `sourceKey`, `topic`, `glossaryVersion`, định dạng, nguồn và trích dẫn.
3. Chọn **Nạp bản dịch tiếng Việt** và chọn tệp JSON đã dịch.

App chỉ nhận bản dịch đúng mã nội dung/chủ đề/phiên bản từ điển, rồi lưu trên trình duyệt. Bản dịch không được tự động thẩm định chất lượng. Có nút xóa bản dịch đã nạp. Không có lệnh gọi API dịch hoặc phí AI tự động.

Có thể giao một tệp nhỏ cho `vi_worker` trong Codex để dịch theo glossary rồi nạp lại. Đây là tác vụ phát triển/dịch riêng, có tính vào usage của phiên Codex; ứng dụng không tự kích hoạt tác vụ đó.

## Phạm vi và giới hạn

- Lịch dương được hỗ trợ trong 1900–2100; biểu mẫu sinh giới hạn tới năm hiện tại. Thư viện lịch Việt dùng bảng lịch Việt, không phải tùy chọn `vi-VN` của engine Trung Quốc.
- Với ngày sinh lịch sử, phải chọn đúng lịch và múi giờ được ghi nhận tại địa phương. App có gợi ý một số giai đoạn theo miền Bắc/miền Nam, chỉ áp dụng khi bấm nút; các thời kỳ chưa đủ nguồn cần chọn thủ công. Chưa tự xác minh mọi địa phương/thời kỳ.
- Quy tắc an sao kế thừa repo; không khẳng định là chuẩn chung của mọi trường phái Tử Vi Việt Nam.
- Adapter Việt dùng năm tương đương cùng chu kỳ can chi để truyền ngày âm vào iztro khi ngày đó không tồn tại trong tháng Trung Quốc. Ngày sinh thực, năm âm và tuổi an hạn được giữ riêng; có ca kiểm thử cho biên ngày 30.
- Diễn giải cơ bản là nội dung giới hạn, không phải bản dịch toàn bộ v4 hay thư viện luận giải đóng của tác giả. V4 vẫn có nguyên văn tiếng Trung nếu chưa nạp bản dịch.
- So khớp với engine tại tag phát hành và chính tinh cung Mệnh chưa xác minh được mọi câu trong thư viện luận giải đóng. Không dùng lá số để chẩn đoán, dự báo chắc chắn hoặc quyết định tài chính.
- Thư viện cổ thư và các trang nghiên cứu gốc ngoài luồng `/chart` còn giữ nội dung nguyên bản. Backend AI tương hợp và hỏi đáp thương mại không được tái tạo.

## Kiểm tra

```powershell
npm.cmd run doctor
npm.cmd run typecheck
npm.cmd run test:vietnam-time
npm.cmd run test:vietnam-calendar
npm.cmd run test:v4
npm.cmd run test:readings
npm.cmd test
npm.cmd run build
```

`npm test` tự tìm mọi `scripts/regression/*.test.ts`. Các lệnh test, dev và build tự chọn runtime phù hợp. Webpack được dùng để tránh lỗi tiến trình con Turbopack trên môi trường Windows này.

## Đọc bài mở rộng

Chọn Tổng quan, Sự nghiệp, Tài chính hoặc Tình cảm trong phần **Luận giải theo chủ đề**. Mục lục dẫn tới từng phần; mở **Căn cứ và cách đọc** dưới nhận xét để thấy sao/cung thực và nguồn khái niệm. Diễn giải một sao ở cung liên hệ không làm thay đổi vị trí của sao đó. Cặp Tả–Hữu, Xương–Khúc, Khôi–Việt chỉ được nêu khi cả hai cùng nằm trong bốn cung đang xét.

Bài mở rộng chỉ đọc bản mệnh. Khi chuyển Đại hạn/Lưu niên, app ghi rõ phạm vi này; không tự dùng nội dung bản mệnh làm dự báo giai đoạn. Giáp cung, Tuần/Triệt, toàn bộ cách cục và phi hóa chưa được phân tích. Xem quy tắc, nguồn và tiêu chí tại `docs/readings-vi.md`.

## Quy trình AI và nguồn

- [Quy tắc phân công](AGENTS.md), [workflow](docs/ai-workflow.md), [kế hoạch](docs/vietnamization-plan.md), [glossary](docs/glossary-vi.md), [nhật ký](docs/task-log.md).
- [.codex/config.toml](.codex/config.toml): Sol Medium, tối đa một subagent; Luna cho việc lặp lại, Sol High review logic, Astra chỉ cho vấn đề khó có bằng chứng. Project cần được tin cậy để Codex nạp cấu hình; phiên đang mở không tự đổi model.
- Engine gốc: Renhuai123/ziwei-doushu, MIT. Engine tham chiếu v4 giữ LICENSE trong `lib/ziwei/v4-reference/`.
- Từ điển nền: iztro (MIT); bản hiển thị tuân theo glossary của project.
- Lịch Việt: @nghiavuive/lunar_date_vi 2.0.1 (ISC), NghiaCaNgao, dựa trên công trình Hồ Ngọc Đức.
- Dữ liệu v4 và các trích dẫn theo [DATASET-LICENSE](DATASET-LICENSE); xem thêm [README gốc](README.en.md).

## Đưa lên web (tuanchau.io.vn)

Có hai cách đóng gói từ cùng một mã nguồn:

| Lệnh | Kết quả | Cần máy chủ |
|---|---|---|
| `npm.cmd run build:static` | Thư mục `out/` gồm HTML/JS tĩnh | Không: chép lên bất kỳ hosting nào |
| `npm.cmd run build` rồi `npm.cmd run start` | Ứng dụng Next.js đầy đủ | Có: Node 22.15+ |

Bản tĩnh:

1. Đặt địa chỉ trang trong `.env.local`: `NEXT_PUBLIC_SITE_URL=https://tuanchau.io.vn`.
2. Nếu đặt trong thư mục con (ví dụ `https://tuanchau.io.vn/tuvi/`), chạy với `TUVI_BASE_PATH=/tuvi`. PowerShell: `$env:TUVI_BASE_PATH='/tuvi'; npm.cmd run build:static`.
3. Chép toàn bộ nội dung `out/` lên hosting. Trang lá số ở `/chart/`.

Bản tĩnh không có tính năng đối chiếu luận giải v4 và trang tìm kiếm cổ thư (hai phần này cần máy chủ). Lá số được tính ngay trên trình duyệt; thông tin sinh không gửi đi đâu.
