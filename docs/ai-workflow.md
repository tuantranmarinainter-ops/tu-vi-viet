# Quy trình AI cho repo

Mục tiêu: giảm tổng usage cho mỗi công việc hoàn thành đúng. Hai model mặc định là Sol và Luna; Astra chỉ dành cho vấn đề khó có bằng chứng. Không có cam kết phần trăm tiết kiệm trước benchmark.

## Kích hoạt cấu hình

1. Cấu hình repo nằm trong `.codex/config.toml`; custom agent nằm trong `.codex/agents/`.
2. Codex chỉ đọc cấu hình project khi project được đánh dấu tin cậy. Cấu hình do tổ chức quản lý và lựa chọn tường minh của phiên có thể ghi đè mặc định.
3. Khi bắt đầu chat tiếp theo trong project, kiểm tra bộ chọn model: GPT-6.1 Sol, Medium, tốc độ Standard. Tệp cấu hình không tự chuyển model của lượt chat đang chạy.
4. Khi cần phân công, gọi `vi_worker`, `logic_reviewer` hoặc `hard_case_reviewer`. Không mở cả ba cùng lúc. Nếu runtime không nhận agent tùy chỉnh, chỉ định model và effort trực tiếp theo AGENTS.md.
5. Nếu model không có trong tài khoản, ghi rõ và dùng model sẵn có phù hợp. Không tự gọi API khác hoặc mua credits.

Không sửa cấu hình cá nhân, quyền sandbox hoặc thiết lập phê duyệt để thực hiện quy trình này. Các agent kế thừa quyền của phiên cha; yêu cầu "chỉ đọc" trong prompt không tạo sandbox riêng.

## Routing

| Dạng công việc | Thực hiện | Điều kiện hoàn thành |
| --- | --- | --- |
| Liệt kê chuỗi, tìm tệp, chạy test | Script/CLI | Đầu ra hoặc mã thoát kiểm chứng được |
| Dịch nhãn và sửa UI theo mẫu | Luna High | Đúng glossary, không sửa khóa tính toán |
| Thiết kế, tích hợp, sửa logic | Sol Medium | Diff có phạm vi và kiểm tra liên quan đạt |
| Lịch âm, múi giờ, đổi ngày, an sao | Sol High | Có nguồn và fixture tham chiếu |
| Review logic quan trọng | Sol High | Phát hiện có thể tái hiện; không review hình thức |
| Mâu thuẫn nguồn hoặc lỗi khó còn lại | Astra Low | Phân tích một vấn đề cụ thể với bằng chứng |

Agent chính thực hiện việc phụ thuộc tuần tự. Chỉ phân công phần độc lập khi lợi ích vượt chi phí truyền ngữ cảnh; tối đa một subagent, không phân công lồng nhau. Không dùng model để quyết định route cho những trường hợp bảng này đã xác định được.

## Mẫu giao việc

```text
Mã công việc:
Mục tiêu và đầu ra:
Tệp được phép sửa:
Quyết định/nguồn cần đọc:
Điều không được thay đổi:
Tiêu chí nghiệm thu:
Lệnh kiểm tra:
Model và reasoning:
Kết quả cần trả: tệp đã sửa, kiểm tra, điểm còn thiếu.
```

Nếu một lần sửa chưa đạt, đọc lỗi, xác định giả thuyết mới và sửa có trọng tâm. Không nâng model chỉ vì một lỗi cú pháp đơn giản. Chỉ dùng review độc lập khi rủi ro kết quả biện minh được chi phí.

## Lệnh cục bộ

```powershell
npm.cmd run doctor
npm.cmd run inventory:ui
npm.cmd run test:vietnam-time
npm.cmd run typecheck
npm.cmd test
```

Inventory được tạo ở `work/ui-text-inventory.json`, bỏ qua comment nhưng vẫn có thể chứa chuỗi nội bộ; cần phân loại trước khi dịch. Không gửi cả inventory cho model nếu tác vụ chỉ liên quan một component.

`test:vietnam-time` kiểm tra helper, chuẩn hóa, chia sẻ/lịch sử và từ chối giờ chưa rõ. Lịch có `test:vietnam-calendar`; bộ đọc và bản dịch có `test:v4`. Các TODO tích hợp ban đầu đã được thay bằng kiểm thử; thay đổi UI vẫn cần kiểm tra trên trình duyệt.

## Benchmark usage

Thử một nhóm nhãn UI, một component và một ca chuẩn hóa giờ sinh. Chọn các đầu việc có độ khó tương đương và dùng cùng tiêu chí nghiệm thu. Ghi vào task-log: model, effort, số lần sửa, kiểm tra, usage quan sát được trước/sau nếu giao diện cung cấp. Nếu không có số liệu, ghi "chưa đo". So sánh usage trên công việc đã nghiệm thu, không chỉ trên một câu trả lời.

Nguồn cấu hình (đã đọc ngày 04/11/2026):

- https://learn.chatgpt.com/docs/agent-configuration/subagents
- https://learn.chatgpt.com/docs/config-file/config-basic
- https://learn.chatgpt.com/docs/models
- https://learn.chatgpt.com/docs/pricing
