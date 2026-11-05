# Kế hoạch Việt hóa

## Phạm vi bản đầu

Ứng dụng cục bộ nhập thông tin sinh tại Việt Nam, hiển thị lá số tiếng Việt, giải thích quy tắc lịch và giờ sinh, có kết quả đối chiếu. Bản đầu không cam kết tái tạo website thương mại của tác giả hoặc tự động tương thích mọi bài luận v4.

## Quyết định đã chốt

- Ưu tiên độ đúng và khả năng kiểm chứng; giảm usage bằng script, fixture, phạm vi giao việc và lưu quyết định.
- Dùng Sol cho logic, Luna cho việc lặp lại; Astra chỉ khi có vấn đề cụ thể chưa giải quyết.
- Giữ khóa tính toán ổn định; thêm lớp hiển thị tiếng Việt.
- Tách ba vấn đề: múi giờ đồng hồ, lựa chọn giờ mặt trời và lịch âm Việt.
- Giữ chế độ tương thích repo gốc để đối chiếu; không gắn nhãn lịch Việt cho đầu ra vẫn dùng lịch Trung Quốc.
- Giữ dữ liệu v4 dạng nén, đọc theo năm và chỉ dịch phần được dùng. Không giải nén toàn bộ vào ổ C.
- So khớp dữ liệu luận giải phải xét profile, phiên bản và cấu trúc cần thiết; không chỉ so ngày dương.
- Không tự thêm AI vào phép tính lịch hoặc an sao. AI hỗ trợ phát triển và soạn/dịch nội dung; code quyết định tính toán.

## Bằng chứng trước khi triển khai

Review bản cục bộ a600484 ngày 04/11/2026, trước các thay đổi trong đợt triển khai này:

- `components/BirthForm.tsx` và `lib/ziwei/share.ts` dùng kinh tuyến 120°E; form chưa truyền múi giờ vào helper hỗ trợ UTC offset.
- Helper `calculateTrueSolarTime()` trong `lib/ziwei/true-solar-time.ts` đã nhận `utcOffsetMinutes`.
- Với ngày 15/07/2000, 11:30, kinh độ 105.8342°E: luồng form cũ trả branch 5 (Tỵ); helper với UTC+7 trả branch 6 (Ngọ), khoảng 11:27:30. Đây là bằng chứng lỗi tích hợp, không phải oracle độc lập cho toàn bộ lịch.
- `algorithm.ts` và `lunar-solar.ts` dùng lịch của lunar-javascript; đổi ngôn ngữ không đổi hệ lịch.
- Nguồn Hồ Ngọc Đức ghi 13/12/1974 là 1/11 âm theo lịch miền Bắc, 30/10 theo lịch Trung Quốc/miền Nam khi đó. Thư viện hiện tại trả 30/10.
- `unknownTime` hiện bị chuyển thành branch 0. Cần sửa sản phẩm để không trình bày thành giờ sinh chắc chắn.
- `app/chart/page.tsx` và `ChartBoard` có trạng thái vận hạn riêng; cần hợp nhất.
- `/api/interpret`, `/api/heming` và thư viện luận giải sản xuất không được cung cấp. STAR_DB là placeholder.
- v4 được tạo từ engine/nội dung ở phiên bản khác; dữ liệu bản mệnh không thay thế luận giải đại hạn/lưu niên.

## Thứ tự thực hiện

| Mã | Công việc | Nghiệm thu | Trạng thái |
| --- | --- | --- | --- |
| WF-001 | Quy trình, cấu hình model, glossary, fixture giờ | Có tài liệu, cấu hình và lệnh chạy cục bộ | Hoàn thành |
| VN-001 | Chuẩn hóa giờ sinh dùng chung | UTC+7, tùy chọn giờ, đổi ngày đúng; form/lịch sử/chia sẻ dùng cùng logic | Đã có trong bản đầu; xem nghiệm thu và giới hạn bên dưới |
| VN-002 | Lịch âm Việt và ranh giới engine | Dương/âm hai chiều; nguồn đối chiếu; không tính lại âm bằng lịch khác | Đã có trong bản đầu; xem nghiệm thu và giới hạn bên dưới |
| VN-003 | Profile quy tắc và dữ liệu tham chiếu | Quy tắc giờ Tý, tháng nhuận, an sao và tuổi hạn ghi rõ | Đã có trong bản đầu; xem nghiệm thu và giới hạn bên dưới |
| VN-004 | Giao diện tiếng Việt | Form, lá số, lỗi, ngày tháng và chia sẻ; khóa tính toán giữ nguyên | Đã có trong bản đầu; xem nghiệm thu và giới hạn bên dưới |
| VN-005 | Luận giải v4 có kiểm tra tương thích | Đọc nén theo năm, kiểm tra profile/phiên bản, lưu bản dịch theo nội dung | Đã có trong bản đầu; xem nghiệm thu và giới hạn bên dưới |
| VN-006 | Mở rộng lịch sử và luận giải riêng | Nơi sinh/thời kỳ có nguồn; quy tắc và nội dung Việt được duyệt | Có diễn giải cơ bản và chọn lịch/UTC thủ công; tự động xác minh mọi thời kỳ chưa hoàn thành |
| READ-001 | Mở rộng bốn chủ đề ưu tiên | Nội dung riêng, quan hệ cung, căn cứ/nguồn, quy tắc có kiểm thử và phân biệt bản mệnh với vận hạn | Hoàn thành phạm vi vi-natal-v2; xem docs/readings-vi.md |

## Phạm vi triển khai VN-001

Phạm vi: BirthForm, share, types, true-solar-time và những nơi lưu/đọc thông tin sinh thực sự bị ảnh hưởng. Bắt đầu bằng việc xác định mô hình đầu vào giữ được ngày/giờ gốc, múi giờ và lựa chọn hiệu chỉnh. Không xóa hoặc ghi đè dữ liệu gốc khi đổi ngày lập lá số.

Tiêu chí:

- Phân biệt giờ đồng hồ và giờ mặt trời; hiển thị chính xác cách được chọn.
- Thử ca Hà Nội, UTC+7 ở kinh tuyến 105°E, sát biên giờ, đổi ngày/tháng/năm.
- Không ngầm biến giờ không rõ thành giờ Tý; lựa chọn sản phẩm phải rõ trước khi triển khai.
- Bổ sung test tích hợp form/lịch sử/chia sẻ, không chỉ test helper.
- Giữ ca tương thích UTC+8 cho chế độ repo gốc. Không đổi mặc định lịch/an sao như một tác dụng phụ.

## Kiểm chứng và vấn đề chưa quyết định

Fixture giờ: `scripts/fixtures/vietnam-time.json`; phân biệt phép tính số học có thể chứng minh với kiểm tra hồi quy. Lịch Việt đã tích hợp qua package ISC 2.0.1 và adapter riêng. Dùng các ví dụ công bố năm 1974, 1984, 2004 cùng ca tham chiếu hiện đại; roundtrip không thay thế oracle thiên văn độc lập.

Cần nghiên cứu thêm nếu muốn chứng nhận một trường phái Việt Nam cụ thể hoặc tự động chọn lịch/múi giờ của mọi địa phương lịch sử. Bản đầu công khai lựa chọn: giao diện mặc định lịch Việt, giờ đồng hồ, giờ Tý sang ngày kế tiếp và tháng nhuận chia tại ngày 16. Có thể chọn lại từng mục; chế độ tương thích form cũ giữ công thức cũ, không tự di trú dữ liệu đã lưu.

## Nghiệm thu bản đầu

- VN-001: một đường chuẩn hóa cho form, lịch sử và chia sẻ; giữ ngày giờ gốc, UTC, hệ lịch, giờ đồng hồ/mặt trời; từ chối giờ không rõ. Đã kiểm tra tương tác thực tế.
- VN-002: đổi âm/dương hai chiều 1900–2100; biên ngày 30 dùng năm tương đương cùng can chi, miền engine 1700–2300. Review độc lập đã rà 73.414 ngày dương × bốn quy tắc tháng nhuận; test hồi quy bao phủ các ca cần ±240 năm và mọi đầu vào ngày 30 trong miền này.
- VN-003: profile ghi phiên bản engine, hệ lịch và quy tắc; engine tag v4 được giữ riêng để đối chiếu. Đây vẫn là hệ an sao kế thừa repo, không phải chứng nhận chuẩn chung của Việt Nam.
- VN-004: luồng `/chart` bằng tiếng Việt, một trạng thái vận hạn, lịch sử trên máy, URL, JSON và in/PDF. Các trang cổ thư/nghiên cứu gốc ngoài luồng này còn nguyên văn.
- VN-005: đọc v4 theo năm, xác minh SHA-256, natal fingerprint và ms; không ghi JSONL giải nén. Bản dịch có thể xuất/nạp JSON, khóa theo nội dung/chủ đề/phiên bản glossary và lưu trên trình duyệt. Không dịch sẵn toàn bộ v4 hoặc tự gọi AI.
- VN-006: có lựa chọn lịch, UTC thủ công cho lịch sử, gợi ý một số giai đoạn theo miền Bắc/miền Nam (người dùng bấm để áp dụng) và 13 chủ đề diễn giải cơ bản có điều kiện. Gợi ý tách UTC đồng hồ khỏi quy ước lịch âm. Việc tự xác minh toàn bộ lịch địa phương, chứng nhận trường phái và xây thư viện luận giải chuyên gia vẫn là phạm vi mở, không được đánh dấu hoàn thành.
- READ-001: Tổng quan, Sự nghiệp, Tài chính, Tình cảm đã có nội dung 14 chính tinh theo chủ đề, Mệnh/Thân, bốn cung liên hệ, tứ hóa và một số cặp phụ tinh có điều kiện. Căn cứ chọn dữ kiện và nguồn khái niệm được mở dưới từng nhận xét; phần biên soạn được ghi rõ chưa thẩm định. Có 9 ca kiểm thử riêng, tích hợp vào toàn bộ 21 chương trình regression; build và trình duyệt desktop/mobile đạt. Chưa thay thế luận giải chuyên gia hoặc diễn giải từng vận hạn.

Nguồn:

- https://github.com/Renhuai123/ziwei-doushu/blob/main/README.en.md
- https://www.xemamlich.uhm.vn/vncal.html
- https://www.xemamlich.uhm.vn/calrules.html
- https://www.xemamlich.uhm.vn/histcal.html
- https://github.com/eggert/tz/blob/main/asia
- https://gml.noaa.gov/grad/solcalc/solareqns.PDF

Giữ MIT cho code và thông tin nguồn/điều kiện trong DATASET-LICENSE cho dữ liệu. Trích dẫn bài giảng có điều kiện riêng; bản dịch phải giữ khả năng truy nguyên.
