# Nhật ký công việc

Ghi kết quả ngắn sau từng gói việc. Không điền usage ước đoán vào cột số đo. Không lưu log thô hoặc dữ liệu sinh thật.

| Mã | Phạm vi | Model / effort | Số lần sửa | Kiểm tra | Usage đo được | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| REVIEW-001 | Review các luồng Việt hóa ở a600484 | Phiên review trước; không có số đo | Không áp dụng | TypeScript đạt; 16/17 chương trình test qua; test cuối thiếu registerHooks trên Node 22.14 | Chưa đo | Có bằng chứng; xem kế hoạch |
| WF-001 | Cấu hình routing, tài liệu, công cụ cục bộ và fixture helper | Phiên thiết lập hiện tại; không tạo subagent hoặc gọi API model riêng | Một lượt soạn, kiểm tra cục bộ | Sáu ca helper đạt, hai TODO tích hợp; TypeScript đạt; inventory tạo 1.041 ứng viên/33 tệp; doctor phát hiện Node 22.14 chưa đủ yêu cầu | Chưa đo | Hoàn thành phần thiết lập |

Ngày 04/11/2026: `codex features list` đọc cấu hình mà không báo lỗi cú pháp; chưa gọi model để kiểm tra routing thực tế. Cấu hình chỉ là mặc định cho phiên/runtime nạp project tin cậy. Bộ test gốc không chạy lại trong đợt thiết lập vì không sửa engine và lỗi Node 22.14 đã được xác định; CI sẽ chạy doctor, TypeScript, bộ helper mới và toàn bộ regression trên Node 22.x được cài bởi actions/setup-node.

## Triển khai tự động bản đầu — 04/11/2026

| Mã | Phạm vi | Model / effort | Kiểm tra | Usage đo được | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| VN-001–003 | Chuẩn hóa đầu vào, lịch Việt, profile và adapter engine | Agent chính; logic_reviewer dùng Sol High để review lịch/adapter | Toàn bộ 20 chương trình regression đạt; review độc lập 73.414 ngày × 4 quy tắc; sau bổ sung gợi ý lịch sử, 11 ca thời gian đạt | Chưa đo | Hoàn thành phạm vi bản đầu |
| VN-004 | Giao diện và từ điển tiếng Việt | Agent chính; vi_worker dùng Luna High cho nhóm component rõ phạm vi | TypeScript và production build đạt; kiểm tra trình duyệt luồng lập lá số, giờ không rõ, liên kết và màn hình 375 px | Chưa đo | Hoàn thành luồng chính /chart |
| VN-005 | Engine tham chiếu v4, đọc nén theo năm và nhập bản dịch | Agent chính | 4 ca v4 đạt; tải mẫu 1990 có SHA-256; trình duyệt từ chối profile không khớp và hash bản dịch sai, nhận bản dịch đúng | Chưa đo | Hoàn thành phạm vi đọc/đối chiếu |
| RUN-001 | Runtime và chạy local | Script/CLI, không gọi API AI | Node portable 22.23.4 đã kiểm SHA-256; build Webpack đạt; production server 127.0.0.1:3100 chạy được | Không áp dụng | Đã mở trang sẵn sàng nhập thông tin |

- Routing được dùng theo phạm vi: một worker dịch UI, một reviewer logic, không chạy đồng thời hai subagent. Không dùng Astra; không có số đo để kết luận phần trăm tiết kiệm.
- Môi trường ban đầu Node 22.14 thiếu API cần cho test/zstd; dùng bản portable trong `work/runtime`, giữ nguyên Node hệ thống. Cài lại dependency sau khi phát hiện cây `node_modules` thiếu dependency bắc cầu. Webpack khắc phục lỗi tiến trình con Turbopack trong môi trường này.
- Kiểm tra trình duyệt: lịch Việt năm 1985, v4 mẫu 1990, khôi phục lựa chọn từ URL, khóa record đúng, từ chối/nhận bản dịch, xóa bản dịch thử. Ở 375 px, toàn trang không tràn ngang; riêng lá số cuộn trong vùng 560 px. Đã dọn hai lịch sử sinh giả và bản dịch giả tạo trong kiểm thử.
- Chỉ cache một tệp nén năm 1990, 1.957.581 byte; không giải nén toàn bộ dataset và không gọi API AI trả phí. Bản v4 chưa có bản dịch vẫn giữ nguyên tiếng Trung.
- Gợi ý lịch sử chỉ bao phủ các giai đoạn có nguồn được mã hóa; yêu cầu bấm áp dụng. Tự xác minh mọi lịch địa phương và luận giải chuyên gia vẫn ngoài phạm vi nghiệm thu, xem kế hoạch.
- `next-env.d.ts` và `tsconfig.json` đã có thay đổi trước phiên triển khai; không khôi phục các thay đổi của người dùng. Không tạo commit hoặc đưa dữ liệu sinh thật vào repo.

## READ-001 — Bốn chủ đề luận giải mở rộng — 04/11/2026

- Mục tiêu: hoàn thành ưu tiên Tổng quan, Sự nghiệp, Tài chính, Tình cảm với nội dung riêng theo chủ đề, quan hệ cung và căn cứ cho nhận xét; không thêm AI runtime.
- Phân công thực tế: agent chính tích hợp bộ đọc/UI/kiểm tra; một `reading_content` dùng Luna High, ngữ cảnh mới và phạm vi duy nhất `reading-content-vi.ts`, để soạn 14 sao × 4 chủ đề. Không dùng Astra hoặc reviewer phụ. Usage chưa có số đo.
- Triển khai: `detailed-readings-vi.ts` chọn dữ kiện theo địa chi; vị trí Mệnh/Thân; chính tinh bản cung hoặc đối cung khi vô chính diệu; tứ hóa giữ vai trò cung thực; cặp Tả–Hữu/Xương–Khúc/Khôi–Việt có điều kiện; đọc song song Lộc/Kỵ và giữ nhãn độ sáng. Nội dung biên soạn và nguồn khái niệm được phân biệt rõ, không tự nhận là giáo lý đã duyệt.
- UI: mục lục, bốn phần phân tích và câu hỏi thực tế; mỗi nhận xét có disclosure căn cứ/nguồn. Bài dài đọc theo một cột, giữ luồng cũ cho các chủ đề cơ bản và phần đối chiếu/dịch v4. Khi đổi Đại hạn/Lưu niên, thông báo bài vẫn là bản mệnh.
- Kiểm tra: 9/9 ca `npm.cmd run test:readings` đạt; toàn bộ 21/21 chương trình regression đạt; TypeScript và production build đạt. Build trong sandbox bị chặn mkdir output `.next`; build được chạy lại với quyền môi trường cho phép và thành công.
- Trình duyệt production: bốn chủ đề ra nội dung khác nhau; mở căn cứ đúng sao/cung; vô chính diệu ghi sao ở đối cung; thông báo bản mệnh khi bật Lưu niên; chủ đề cơ bản vẫn hoạt động; chọn cung Quan Lộc bằng Enter chuyển sang Sự nghiệp. Ở 1180 px bài rộng 980 px; ở 375 px bài rộng khoảng 346 px, trang không tràn ngang. Tab mẫu riêng đã đóng, không sửa hoặc xóa lá số người dùng.
- Đã build và chạy lại local ở `http://127.0.0.1:3100/chart`. Không gọi API AI trả phí, không tải thêm dataset. Không đổi engine/lịch/an sao. Xem `docs/readings-vi.md` cho điều kiện, nguồn và giới hạn.
- Chưa bao phủ mọi tổ hợp chính tinh, giáp cung, Tuần/Triệt hoặc phi hóa; chưa luận riêng từng đại hạn/lưu niên, chưa có thẩm định chuyên gia. Đây là phần ngoài nghiệm thu READ-001, không đánh dấu VN-006 toàn bộ hoàn thành.

## REVIEW-002 — So sánh bản hiện tại với dữ liệu v4 — 05/11/2026

- Mục tiêu/phạm vi: kiểm tra phiên bản và độ chi tiết luận giải qua package, readings-vi, detailed-readings-vi, VietnameseReadings, server/v4 và một record giả lập đã cache; không sửa engine/UI hoặc dịch nội dung.
- Phiên bản: package 0.1.0, HEAD a600484 kèm thay đổi cục bộ; bài tiếng Việt vi-natal-v2; dữ liệu/engine tham chiếu v4.0-13d (0e39b5c). Đã đọc lại README và trang phát hành gốc trực tuyến.
- Đối chiếu record 1990-01-01-0-male từ tệp nén năm 1990 có sẵn, qua script work/compare-readings.ts: v4 có đủ 13 chủ đề, 1.350–3.265 ký tự/chủ đề; có mục riêng cho cặp chính tinh và tổ hợp chính/phụ/sát thực tế. Tiếng Việt có bốn chủ đề mở rộng; chín chủ đề còn lại ở mẫu này khoảng 605–930 ký tự. Số ký tự giữa hai ngôn ngữ không đo trực tiếp độ sâu hoặc độ đúng; đây chỉ là một mẫu, không benchmark toàn bộ dataset.
- Kết luận: dữ liệu v4 rộng và có phân tích tổ hợp cụ thể hơn phạm vi nội dung Việt hiện tại; tải code tag v4 không cung cấp thư viện phán đoán đóng hoặc backend AI. Có thể đọc dữ liệu gốc qua chức năng đối chiếu đã có, chỉ khi cấu trúc tương thích; không tự gán cho lịch Việt khác cấu trúc hoặc cho luận vận hạn.
- Kiểm tra: doctor đạt; test:readings 9/9 và test:v4 4/4 đạt. Đọc trực tiếp đủ 13 chủ đề của record mẫu, không tải thêm dữ liệu, không giải nén JSONL ra đĩa, không gọi API AI. Usage chưa đo; không dùng subagent.

## RELEASE-001 — Chuẩn bị phát hành v0.1 — 05/11/2026

- Mục tiêu: đưa bản hiện tại lên repo public của người dùng và phát hành GitHub Release v0.1; không deploy website.
- Đã tạo repo https://github.com/MDuke235/tu-vi-viet bằng GitHub CLI chính thức tải trong work/. Xác minh tài khoản MDuke235 qua Git Credential Manager; không in/lưu token vào tệp. origin trỏ tới repo mới; upstream giữ repo tác giả.
- Phạm vi bản phát hành: toàn bộ mã và tài liệu bản đầu đã có trong workspace, cùng README dẫn tới hướng dẫn Việt và docs/releases/v0.1.md. Giữ các thay đổi next-env.d.ts/tsconfig.json có trước; không khôi phục chúng. Dọn dòng trắng cuối một số tệp để diff --check đạt, không sửa logic.
- Kiểm tra nghiệm thu: doctor, typecheck, 21/21 chương trình regression và production build Webpack đạt trên Node 22.23.4. Build đầu bị sandbox chặn mkdir trong .next; chạy lại với quyền môi trường phù hợp thành công. Đã kiểm tra tệp staged, mẫu khóa bí mật và đường dẫn loại trừ; không đưa work/, data/v4/, runtime, dependency hay .env thật vào bản phát hành.
- Đích phát hành: nhánh main và tag v0.1, package 0.1.0; ghi chú nêu rõ giới hạn lịch lịch sử, luận giải bản mệnh, dữ liệu v4 và giấy phép nguồn. Không dùng subagent hoặc API AI; usage chưa đo.

## Mẫu cho lần tiếp theo

```text
Mã / mục tiêu:
Model / reasoning thực sự dùng:
Tệp đã sửa:
Tiêu chí nghiệm thu và kết quả:
Số lần sửa / lý do nâng model (nếu có):
Usage trước/sau, đơn vị và nguồn số đo (hoặc chưa đo):
Phần còn thiếu / quyết định tiếp theo:
```
