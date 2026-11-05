# Luận giải tiếng Việt mở rộng

Phiên bản `vi-natal-v2`, ngày 04/11/2026. Bốn chủ đề: Tổng quan, Sự nghiệp, Tài chính, Tình cảm. Luồng còn lại giữ bài cơ bản; engine an sao, lịch và bộ đọc v4 không đổi.

## Quy tắc chọn dữ kiện

- Cung chính lần lượt là Mệnh, Quan Lộc, Tài Bạch, Phu Thê. So tên nội bộ sau khi chuẩn hóa hậu tố; không dùng tên dịch để tính toán.
- Tam phương tứ chính lấy theo địa chi: bản cung `b`, tam hợp `(b+4)%12`, `(b+8)%12`, đối cung `(b+6)%12`. Không phụ thuộc thứ tự mảng.
- Vô chính diệu: chỉ tham khảo chính tinh thực sự ở đối cung; không chuyển sao, độ sáng hoặc tứ hóa vào bản cung. Không tin cache `borrowedStars` khi dữ kiện thực không khớp.
- Mệnh/Thân lấy bằng `mingGongBranch` và `shenGongBranch`. Không giả định Thân là cung thứ 13.
- Tứ hóa lấy từ `star.siHua` bản mệnh. Dấu hóa tại cung liên hệ được diễn giải theo vai trò cung đó, không gán thành hóa tại cung chính của chủ đề.
- Cặp Tả–Hữu, Xương–Khúc, Khôi–Việt chỉ xuất hiện khi cả hai nằm trong bốn cung đang xét. Chỉ gọi đồng cung nếu địa chi bằng nhau. Không gọi là đắc cách/cổ cách chỉ vì đủ cặp.
- Lộc/Kỵ trong vùng đang xét được trình bày song song; phân biệt đồng cung với khác cung. Không cộng trừ cát/sát thành điểm hay coi hai dấu tự hóa giải nhau.
- Chỉ nhận xét nhóm Miếu/Vượng và Hãm khi khớp chính xác nhãn. Các mức khác vẫn giữ nguyên, không dùng trường brightness thô để tự gộp.

## Nội dung và nguồn

Dữ kiện engine và diễn giải được trình bày riêng. `reading-content-vi.ts` chứa 14 chính tinh × 4 chủ đề: ý nghĩa biểu tượng và điểm cân bằng. Đây là nội dung ứng dụng tự biên soạn từ bộ mô tả chính tinh đã có, không phải bản dịch v4, cổ thư hoặc tài liệu iztro. Chưa có thẩm định chuyên gia; kiểm thử phần mềm không chứng nhận độ đúng của giáo lý.

Nguồn khái niệm đã đọc, không phải nguồn chứng nhận từng câu biên soạn:

- [iztro — cung và quan hệ cung](https://docs.iztro.com/learn/palace): vai trò cung, Thân, tam hợp và đối cung.
- [iztro — độ sáng](https://docs.iztro.com/learn/star): phân loại và sự khác nhau giữa các hệ bảng.
- [iztro — tứ hóa](https://docs.iztro.com/learn/mutagen): dấu hóa gắn vào sao; phân biệt lớp bản mệnh và vận hạn.
- [iztro — phụ tinh](https://docs.iztro.com/learn/minor-star): đặc tính phụ tinh; không kết luận tốt/xấu chỉ từ phân loại.

Ứng dụng dùng diễn giải khái niệm ngắn, không sao chép toàn bài. Các điều kiện chọn cung/cặp sao được kiểm tra độc lập với văn bản. Chưa bổ sung quy tắc chưa có nguồn cho giáp cung, Tuần/Triệt, mọi tổ hợp chính tinh hoặc phi hóa.

## Nghiệm thu

`npm.cmd run test:readings` kiểm tra 12 vị trí xoay, mảng cung đảo thứ tự, cặp thiếu/một sao ngoài vùng, cache mượn sao sai, Lộc/Kỵ cùng/khác cung, nhãn độ sáng không bị gộp, cung thiếu/sao chưa hỗ trợ, Mệnh/Thân, và tứ hóa giữ vai trò cung thực. Có tích hợp qua `getVietnameseReading` trên lá số Việt và engine v4; kiểm tra tính bất biến đầu vào, nguồn hợp lệ và không lộ khóa Hán trong nội dung hiển thị.

Bài không dùng currentAge/đại hạn hiện tại để thay lời luận. UI nhắc rõ bản mệnh khi đổi lớp vận hạn. Không có fetch/API trong bộ tạo bài; phần fetch v4 cũ vẫn chỉ chạy khi bấm đối chiếu.
