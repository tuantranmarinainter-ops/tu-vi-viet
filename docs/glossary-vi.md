# Từ điển thuật ngữ cho giao diện

Đây là bộ thuật ngữ khởi đầu, chưa phải bản thẩm định mọi trường phái. Giữ nguyên khóa nội bộ. Dịch tại lớp hiển thị, không thay thế hàng loạt trong thuật toán. Các tên cần phân biệt như Triệt/Tuần và sao phụ phải kiểm tra theo ngữ cảnh.

## Chính tinh

| Khóa gốc | Hiển thị |
| --- | --- |
| 紫微 | Tử Vi |
| 天机 | Thiên Cơ |
| 太阳 | Thái Dương |
| 武曲 | Vũ Khúc |
| 天同 | Thiên Đồng |
| 廉贞 | Liêm Trinh |
| 天府 | Thiên Phủ |
| 太阴 | Thái Âm |
| 贪狼 | Tham Lang |
| 巨门 | Cự Môn |
| 天相 | Thiên Tướng |
| 天梁 | Thiên Lương |
| 七杀 | Thất Sát |
| 破军 | Phá Quân |

## Cung

Các biến thể có/không có hậu tố 宫 là cùng nhãn hiển thị, không nhất thiết là cùng chuỗi trong engine.

| Khóa/biến thể | Hiển thị |
| --- | --- |
| 命宫 | Mệnh |
| 兄弟 / 兄弟宫 | Huynh Đệ |
| 夫妻 / 夫妻宫 | Phu Thê |
| 子女 / 子女宫 | Tử Tức |
| 财帛 / 财帛宫 | Tài Bạch |
| 疾厄 / 疾厄宫 | Tật Ách |
| 迁移 / 迁移宫 | Thiên Di |
| 交友 / 交友宫 / 仆役 | Nô Bộc |
| 官禄 / 官禄宫 | Quan Lộc |
| 田宅 / 田宅宫 | Điền Trạch |
| 福德 / 福德宫 | Phúc Đức |
| 父母 / 父母宫 | Phụ Mẫu |
| 身宫 | Thân (vị trí Thân, không phải cung thứ 13) |

## Nhãn và quy ước

| Gốc | Hiển thị |
| --- | --- |
| 禄 / 化禄 | Lộc / Hóa Lộc |
| 权 / 化权 | Quyền / Hóa Quyền |
| 科 / 化科 | Khoa / Hóa Khoa |
| 忌 / 化忌 | Kỵ / Hóa Kỵ |
| 本命 | Bản mệnh |
| 大限 | Đại hạn |
| 流年 | Lưu niên |
| 闰月 | Tháng nhuận |
| 真太阳时 | Giờ mặt trời thực |
| 钟表时间 | Giờ đồng hồ |
| 空宫 | Vô chính diệu (khi không có chính tinh) |
| 庙 / 旺 / 得 / 平 / 陷 | Miếu / Vượng / Đắc / Bình / Hãm |

Các mức 利, 不, 闲, 地 cần nhãn mô tả được duyệt; không gộp âm thầm vào bảng miếu/vượng/đắc/hãm quen dùng tại Việt Nam.

Thiên can: 甲 Giáp, 乙 Ất, 丙 Bính, 丁 Đinh, 戊 Mậu, 己 Kỷ, 庚 Canh, 辛 Tân, 壬 Nhâm, 癸 Quý.

Địa chi: 子 Tý, 丑 Sửu, 寅 Dần, 卯 Mão, 辰 Thìn, 巳 Tỵ, 午 Ngọ, 未 Mùi, 申 Thân, 酉 Dậu, 戌 Tuất, 亥 Hợi.

Ngày hiển thị dd/mm/yyyy. Phân biệt tuổi thực với tuổi mụ và ghi rõ khi dùng để tính hạn. Không dịch "không biết giờ" thành một giờ cụ thể.

Tham khảo: từ điển vi-VN trong `node_modules/iztro/lib/i18n/locales/vi-VN/` và https://github.com/SylarLong/iztro/tree/main/src/i18n/locales/vi-VN . Các lựa chọn trong bảng này là quy ước giao diện của project, không thay đổi ID hoặc quy tắc an sao.
