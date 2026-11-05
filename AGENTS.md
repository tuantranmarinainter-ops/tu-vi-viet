# Quy tắc làm việc trong repo

## Mục tiêu và tài liệu

- Phát triển ứng dụng Tử Vi cho người Việt, ưu tiên kết quả có thể kiểm chứng và tổng usage thấp.
- Đọc `docs/vietnamization-plan.md` và mục công việc hiện tại trong `docs/task-log.md`; chỉ đọc `docs/glossary-vi.md` khi có phần dịch.
- Không review lại toàn repo nếu đã có bằng chứng trong kế hoạch và các tệp liên quan chưa đổi.
- Trao đổi với người dùng bằng tiếng Việt. Giữ nguyên tên API, khóa dữ liệu và thuật ngữ code.

## Phân công model

- Mặc định: GPT-6.1 Sol, reasoning medium; dùng high khi sửa lịch âm, múi giờ, đổi ngày, an sao hoặc tính tương thích v4.
- Chỉ giao cho `vi_worker` (GPT-6 Luna, high) công việc độc lập, rõ đầu vào và tiêu chí: trích xuất chuỗi, dịch theo glossary, sửa component theo mẫu đã chốt.
- Có thể dùng `logic_reviewer` (Sol, high) để kiểm tra một thay đổi có rủi ro về kết quả; không bắt buộc review mọi thay đổi.
- Chỉ dùng `hard_case_reviewer` (Astra, low) khi có mâu thuẫn nguồn hoặc lỗi khó chưa được Sol giải quyết. Gửi bằng chứng, không gửi toàn lịch sử chat.
- Tối đa một subagent đang mở ngoài agent chính; không tạo subagent lồng nhau. Không dùng subagent chỉ để chạy lệnh test.
- Khi runtime không hỗ trợ custom agent, chỉ định đúng model và effort trong lời gọi spawn nếu khả dụng. Không âm thầm thay model đắt hơn.
- Không cần tạo subagent khi agent chính có thể hoàn thành tác vụ nhỏ với ít chi phí phối hợp hơn.
- Chỉ dẫn này cho phép phân công có giới hạn như trên; không yêu cầu dùng nhiều model cho mỗi công việc.

## Giảm usage

- Dùng `rg`, script và CLI cho tìm kiếm, trích xuất, kiểm tra kiểu và so sánh kết quả.
- Mỗi tác vụ cần mục tiêu, phạm vi tệp, tiêu chí nghiệm thu và lệnh kiểm tra; dùng mẫu trong `docs/ai-workflow.md`.
- Mỗi subagent chỉ nhận phần tài liệu cần thiết; ưu tiên ngữ cảnh mới, không sao chép toàn bộ hội thoại.
- Chỉ trả bản sửa, kết quả kiểm tra và điểm chưa chắc chắn. Không đổ log dài vào hội thoại.
- Sau khi kiểm tra đạt, chuyển bước. Chỉ chạy lại khi có thay đổi liên quan hoặc bằng chứng mới.
- Nếu sửa thất bại, đọc lỗi và thu hẹp giả thuyết trước; không lặp nguyên prompt. Nâng model dựa vào bằng chứng, không dựa vào tự đánh giá độ tự tin.
- Ghi kết quả vào `docs/task-log.md`; không tự đoán số token hoặc phần trăm tiết kiệm. Usage trong gói Codex khác chi phí API.
- Không gọi API trả phí, dịch toàn bộ v4 hoặc tải toàn bộ dữ liệu chỉ để benchmark quy trình. Dùng mẫu nhỏ trước.
- Cấu hình là mặc định, không phải giới hạn chi phí cứng. Model của chat đang mở và tốc độ do runtime/bộ chọn model quyết định; ưu tiên Standard.

## Tính đúng cho người Việt

- Giữ khóa nội bộ tiếng Trung hiện có hoặc ID ổn định; dịch tại lớp hiển thị. Không thay chuỗi dùng trong thuật toán bằng bản dịch.
- Tách múi giờ đồng hồ, hiệu chỉnh giờ mặt trời và hệ lịch âm. Sửa một phần không có nghĩa các phần còn lại đã đúng.
- Không giả định mọi ngày sinh Việt Nam đều dùng UTC+7 hoặc cùng hệ lịch lịch sử. Xử lý các trường hợp chưa hỗ trợ một cách minh bạch.
- Không tự gán giờ Tý khi người dùng không biết giờ sinh rồi trình bày thành lá số xác định.
- Mọi thay đổi ảnh hưởng lá số phải có nguồn/quy ước rõ và ca kiểm thử tham chiếu. Hai model đồng ý không thay thế được bằng chứng.
- Không mặc định bài v4 cùng ngày dương là phù hợp với lá số theo lịch Việt. Kiểm tra phiên bản, profile và cấu trúc có liên quan trước khi hiển thị.
- Phân biệt tương thích repo gốc với chế độ lịch Việt; chưa gọi là "chuẩn Tử Vi Việt Nam" nếu chưa đối chiếu hệ quy tắc.
- Giữ thông tin tác giả, giấy phép và nguồn trích dẫn khi tái sử dụng dữ liệu hoặc bản dịch.

## Kiểm tra và phạm vi thay đổi

- Chạy `npm.cmd run doctor` để kiểm tra môi trường khi bắt đầu hoặc khi có lỗi runtime. Script không cài đặt hay gọi mạng.
- Chạy `npm.cmd run inventory:ui` để tạo danh sách chuỗi ứng viên; đây không phải danh sách chuỗi đã được duyệt để dịch.
- Chạy `npm.cmd run test:vietnam-time` khi sửa chuẩn hóa giờ sinh; bộ này kiểm tra helper và luồng chia sẻ/lịch sử. Khi đổi UI vẫn kiểm tra tương tác thực tế.
- Chạy `npm.cmd run test:vietnam-calendar` cho lịch/adapter; `npm.cmd run test:v4` cho đọc nén, so khớp và bản dịch.
- Chạy `npm.cmd run test:readings` khi sửa luận giải tiếng Việt. Giữ vị trí sao, độ sáng và tứ hóa ở cung thực; phân biệt nguồn khái niệm với nội dung biên soạn, không gắn bài bản mệnh thành luận theo năm.
- Chạy `npm.cmd run typecheck` cho thay đổi TypeScript; chạy test liên quan trước, `npm.cmd test` khi thay đổi engine hoặc tích hợp.
- Không viết test chỉ phản chiếu implementation hoặc test cho sửa tài liệu đơn giản.
- Không thay đổi tệp của người dùng ngoài phạm vi. Khi bắt đầu thiết lập, `next-env.d.ts` và `tsconfig.json` đã có thay đổi cục bộ.
- Dùng `work/` cho đầu ra tạm. Không commit dữ liệu sinh thật, khóa API, cache hay dữ liệu giải nén lớn.
- Báo rõ phần hoàn thành, kiểm tra đã chạy và giới hạn còn lại; không tuyên bố toàn bộ Việt hóa đã xong khi chỉ chuẩn bị quy trình.
