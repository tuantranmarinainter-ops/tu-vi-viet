# Giao diện lá số Việt (đợt 1): kế hoạch triển khai

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Mục tiêu:** Thay khung lá số, trang nhập và bản in trên `/chart` bằng giao diện lá số Việt đã duyệt. Tạo hai bản đóng gói: web tĩnh và máy chủ Node.

**Kiến trúc:**
- Mọi quy đổi từ `ZiweiChart` sang dữ liệu hiển thị nằm trong các hàm thuần ở `lib/la-so/`, kiểm thử bằng tsx. Component React chỉ vẽ dữ liệu đã quy đổi.
- Engine chỉ được thêm (không sửa) ba vòng sao iztro đã tính sẵn vào `Palace`.

**Công nghệ:** Next.js 16 App Router, React 19, TypeScript, iztro 2.6.1, `node:test` + tsx, CSS thuần (không dùng Tailwind cho phần mới).

**Bản thiết kế:** `docs/superpowers/specs/2026-11-23-giao-dien-la-so-viet-design.md`

## Ràng buộc chung

- Toàn bộ chữ hiển thị trên `/chart` và form bằng tiếng Việt. Không còn chữ Hán.
- Khóa nội bộ tiếng Trung giữ nguyên. Chỉ dịch ở lớp hiển thị (AGENTS.md).
- Màu:
  - Hỏa `#E8000B`, Mộc `#00A11A`, Thổ `#F08A00`, Kim `#6A6A6A`, Thủy `#000000`.
  - Tên cung `#0030D0`.
  - Khung `#0B1650`, viền `#E0A800`, giấy `#FFF8E6`.
  - Đường tam phương `#9A9A9A`, opacity 0.45, nằm dưới chữ.
- Phông: Be Vietnam Pro (400–800) cho nội dung, Noto Serif (600–700) cho tiêu đề và dấu triện. Chính tinh weight 800, cỡ 13px. Phụ tinh 11px, weight 500.
- Đầu trang: "TUANCHAU.IO.VN · LÁ SỐ TỬ VI". Dấu triện: "Tuấn Châu Lý Số".
- Không đưa logo, QR, con dấu hay thông tin liên hệ của lyso.vn vào app.
- Không commit dữ liệu sinh thật. Lá số lyso mẫu (24/4/1988 07:15, Nữ) chỉ dùng trong `work/` (đã gitignore).
- Giữ tương thích liên kết chia sẻ và định dạng JSON `tuvi-viet-v1`. Trường mới đều là tùy chọn.
- Lệnh kiểm tra trên Windows dùng `npm.cmd`. Trên máy Claude dùng `node node_modules/tsx/dist/cli.mjs <file>`.

## Trọng tâm khi review

1. **Năm xem nằm trước đại hạn đầu tiên** (ví dụ 2 tuổi): không tô cung nào. Thiên bàn ghi "Chưa vào đại hạn". Không được báo lỗi. Kiểm ở Task 3.
2. **Sinh tháng nhuận** (`lunarMonth` âm): nguyệt hạn và Thiên bàn dùng trị tuyệt đối, Thiên bàn ghi "(nhuận)". Kiểm ở Task 3 và Task 5.
3. **Tuần và Triệt rơi vào cùng một cặp cung:** hai nhãn không được chồng lên nhau mà phải xếp cạnh nhau ("Tuần · Triệt" hoặc lệch nhau). Kiểm ở Task 4.
4. **Cung có rất nhiều sao:** mỗi cột phụ tinh tối đa 10 dòng thì vẫn vừa ô cao 212px, không bị cắt khi in. Kiểm trên 500 lá số sinh ngẫu nhiên ở Task 6.
5. **Tên sao engine sinh ra chưa có bản tiếng Việt:** không được hiện chữ Hán. Kiểm trên 500 lá số ở Task 2.

---

### Task 0: Môi trường kiểm thử cục bộ (chỉ máy Claude, không commit)

Máy Claude không cài được package từ npm.

- [ ] **Bước 1:** Clone mã nguồn các phụ thuộc engine từ GitHub vào `work/nm/`: iztro v2.6.1, lunar-javascript 1.7.7, `@nghiavuive/lunar_date_vi` 2.0.1, dayjs, i18next, lunar-lite, lunar-typescript. Trỏ `node_modules/<tên>` về đó bằng symlink. Package nào chỉ có mã TS thì để `main` trỏ thẳng vào `src/index.ts` (tsx chạy được).
- [ ] **Bước 2:** Chạy `node --import tsx scripts/regression/vietnam-readings.test.ts` (tsx toàn cục ở `~/.npm-global`). Kỳ vọng: PASS. Nếu không dựng được sau hai lần thử: ghi vào `docs/task-log.md`, các bước "Chạy" sau đó chuyển sang máy anh Tuấn.
- [ ] **Bước 3:** Tạo `work/mau-lyso.json` (không commit) từ ảnh lá số lyso. Gồm:
  - Thông tin sinh: dương lịch 1988-04-24 07:15, nữ, lịch Việt, năm xem 2026.
  - Kỳ vọng cho từng chi: chính tinh kèm độ sáng, số đại hạn, Tràng sinh, "năm <chi>", "tháng <n>", sao vòng Bác sĩ và Thái Tuế.
  - Tuần ở Tuất–Hợi, Triệt ở Tý–Sửu.
  - Thiên bàn: Mậu Thìn / Bính Thìn / Kỷ Dậu / Mậu Thìn, âm lịch 9/3, Đại Lâm Mộc, Kim Tứ Cục, Cục khắc Mệnh, Âm Dương thuận lý, Mệnh chủ Tham Lang, Thân chủ Văn Xương.

### Task 1: Engine trả thêm ba vòng sao

**Tệp:**
- Sửa: `lib/ziwei/types.ts` (interface `Palace`)
- Sửa: `lib/ziwei/algorithm.ts:597-607` (chỗ trả về object cung)
- Kiểm thử: `scripts/regression/la-so-vong-sao.test.ts`

**Giao diện:**
- Tạo ra: `Palace.changSheng?: string`, `Palace.boShi?: string`, `Palace.suiQian?: string`. Đây là tên tiếng Trung lấy từ `p.changsheng12`, `p.boshi12`, `p.suiqian12` của iztro.

- [ ] **Bước 1: Viết kiểm thử.** `test('Mỗi lá số có đủ 12 sao mỗi vòng, không trùng')`:
  - Với 24 lá số tổng hợp (1950–2020, đủ giờ Tý–Hợi, nam và nữ, `calendarSystem: 'vietnam'`), ba vòng `changSheng`, `boShi`, `suiQian` đều có đúng 12 tên khác nhau trên 12 cung.
  - Ca cụ thể `{ year: 1990, month: 1, day: 1, hour: 0, gender: 'male', calendarSystem: 'vietnam' }`: cung có `boShi === '博士'` cũng chứa sao `禄存`.
- [ ] **Bước 2:** Chạy, kỳ vọng FAIL (`changSheng` là `undefined`).
- [ ] **Bước 3:** Thêm ba trường vào `Palace` (có chú thích tiếng Việt). Gán trong `astrolabe.palaces.map`. Không đổi gì khác.
- [ ] **Bước 4:** Chạy kiểm thử mới cùng `npm test` (hoặc toàn bộ `scripts/regression` trên máy Claude). Kỳ vọng: tất cả PASS.
- [ ] **Bước 5:** Đối chiếu `work/mau-lyso.json`: Tràng sinh, Bác sĩ, Thái Tuế của 12 cung phải khớp, sau khi dịch theo bảng ở Task 2. Ghi kết quả vào `docs/task-log.md`.
- [ ] **Bước 6:** Commit `feat(engine): trả vòng Tràng sinh, Bác sĩ, Thái Tuế cho từng cung`.

### Task 2: Tên Việt, độ sáng, ngũ hành, cát/hung

**Tệp:**
- Tạo: `lib/la-so/ngu-hanh.ts`, `lib/la-so/ten-viet.ts`
- Sửa: `lib/i18n/vi.ts` (bổ sung tên sao còn thiếu)
- Kiểm thử: `scripts/regression/la-so-ten.test.ts`

**Giao diện (tạo ra):**
```ts
export type NguHanh = 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho';
export type DoSang = 'M' | 'V' | 'Đ' | 'B' | 'H';
export function doSangViet(raw?: StarBrightness): DoSang | undefined;
export function nguHanhChi(branch: number): NguHanh;
export function nguHanhSao(name: string): NguHanh | undefined;
export function cotSao(star: Star): 'trai' | 'phai';
export function tenSao(name: string): string;
export function tenCung(name: string, gender: 'male' | 'female'): string; // viết hoa
export function tenVong(name: string): string;
export function canChi(stem: number, branch: number): string;
```
Chú thích: `tenCung` trả về chữ hoa. `canChi` trả về dạng "Đinh Tị".

**Giá trị chốt:**
- **Độ sáng:** 庙→M, 旺→V, 得→Đ, 利→Đ, 地→Đ, 平→B, 闲→B, 不→H, 陷→H.
- **Ngũ hành theo chi:** Tý, Hợi→thủy. Dần, Mão→mộc. Tị, Ngọ→hỏa. Thân, Dậu→kim. Thìn, Tuất, Sửu, Mùi→thổ.
- **Ngũ hành chính tinh:** Tử Vi thổ, Thiên Cơ mộc, Thái Dương hỏa, Vũ Khúc kim, Thiên Đồng thủy, Liêm Trinh hỏa, Thiên Phủ thổ, Thái Âm thủy, Tham Lang thủy, Cự Môn thủy, Thiên Tướng thủy, Thiên Lương thổ, Thất Sát kim, Phá Quân thủy.
  - Tham Lang tô màu Mộc (xanh lá) như lá số mẫu. Thêm ngoại lệ hiển thị `MAU_RIENG = { '贪狼': 'moc' }`.
- **Phụ tinh:** lấy ngũ hành từ `STAR_DESCRIPTIONS[name].element` nếu có. Nếu không có thì bổ sung bảng trong `ngu-hanh.ts`. Không có ngũ hành thì để `undefined`, hiển thị màu đen.
- **Cát hay hung:** `type === 'lucky'` → trái. `type === 'sha'` → phải. `minor` → tra bảng `SAO_HUNG` trong `ngu-hanh.ts` (có trong bảng → phải, còn lại → trái).
- **Tên cung:**
  - 命宫 MỆNH, 兄弟 HUYNH ĐỆ, 子女 TỬ TỨC, 财帛 TÀI BẠCH, 疾厄 TẬT ÁCH, 迁移 THIÊN DI, 仆役/交友 NÔ BỘC, 官禄 QUAN LỘC, 田宅 ĐIỀN TRẠCH, 福德 PHÚC ĐỨC, 父母 PHỤ MẪU.
  - 夫妻: nữ là PHU QUÂN, nam là THÊ THIẾP.
- **Vòng sao:**
  - Tràng sinh: 长生 Trường Sinh, 沐浴 Mộc Dục, 冠带 Quan Đới, 临官 Lâm Quan, 帝旺 Đế Vượng, 衰 Suy, 病 Bệnh, 死 Tử, 墓 Mộ, 绝 Tuyệt, 胎 Thai, 养 Dưỡng.
  - Bác sĩ: 博士 Bác Sĩ, 力士 Lực Sĩ, 青龙 Thanh Long, 小耗 Tiểu Hao, 将军 Tướng Quân, 奏书 Tấu Thư, 飞廉 Phi Liêm, 喜神 Hỷ Thần, 病符 Bệnh Phù, 大耗 Đại Hao, 伏兵 Phục Binh, 官府 Quan Phủ.
  - Thái Tuế: 岁建 Thái Tuế, 晦气 Thiếu Dương, 丧门 Tang Môn, 贯索 Thiếu Âm, 官符 Quan Phù, 小耗 Tử Phù, 大耗/岁破 Tuế Phá, 龙德 Long Đức, 白虎 Bạch Hổ, 天德 Phúc Đức, 吊客 Điếu Khách, 病符 Trực Phù.
  - Bảng vòng Bác sĩ và vòng Thái Tuế có tên trùng nhau (小耗, 大耗, 病符), nên `tenVong` nhận thêm tham số `vong: 'trangSinh' | 'boShi' | 'suiQian'`.

- [ ] **Bước 1: Viết kiểm thử.**
  - `doSangViet` cho đủ 9 giá trị ở trên, và `undefined` → `undefined`.
  - `nguHanhChi` cho 12 chi.
  - `tenCung('夫妻', 'female') === 'PHU QUÂN'`, `tenCung('夫妻', 'male') === 'THÊ THIẾP'`.
  - `canChi(3, 5) === 'Đinh Tị'`.
  - `tenVong('小耗', 'boShi') === 'Tiểu Hao'`, `tenVong('小耗', 'suiQian') === 'Tử Phù'`.
  - **Kiểm toàn bộ:** với 500 lá số sinh ngẫu nhiên có seed cố định (1930–2030, đủ giờ, giới tính, cả hai hệ lịch), mọi `tenSao(star.name)`, `tenCung`, `tenVong` không chứa ký tự trong `/\p{Script=Han}/u`.
- [ ] **Bước 2:** Chạy, kỳ vọng FAIL (module chưa có).
- [ ] **Bước 3:** Viết `ngu-hanh.ts` và `ten-viet.ts`. `tenSao` dùng `viLabel`. Bổ sung vào `labels` của `vi.ts` những tên mà phép kiểm toàn bộ báo thiếu.
- [ ] **Bước 4:** Chạy, kỳ vọng PASS.
- [ ] **Bước 5:** Commit `feat(la-so): tên Việt, độ sáng M/V/Đ/B/H, ngũ hành và cột cát/hung`.

### Task 3: Hạn theo năm xem

**Tệp:**
- Tạo: `lib/la-so/han.ts`
- Kiểm thử: `scripts/regression/la-so-han.test.ts`

**Giao diện (tạo ra):**
```ts
export function tuoiMu(chart: ZiweiChart, namXem: number): number;
export function cungDaiHan(chart: ZiweiChart, namXem: number): number | null;
export function tieuHanNam(chart: ZiweiChart): Record<number, number>;
export function thangHan(chart: ZiweiChart): Record<number, number>;
export function saoLuuNien(namXem: number): Record<number, { ten: string; cot: 'trai' | 'phai' }[]>;
```
Chú thích:
- `tuoiMu` = `namXem - lunarInfo.lunarYear + 1`.
- `cungDaiHan` trả chi của cung có `daXianAge` chứa tuổi mụ. Chưa vào đại hạn thì trả `null`.
- `tieuHanNam` cho mỗi chi cung, trả chi của năm có tiểu hạn rơi vào cung đó.
- `thangHan` cho mỗi chi cung, trả số tháng 1..12.

**Thuật toán đã chốt** (khớp lá số mẫu lyso):
- **Tiểu hạn:**
  - Cung khởi theo tam hợp của chi năm sinh: Dần Ngọ Tuất → Thìn; Thân Tý Thìn → Tuất; Tị Dậu Sửu → Mùi; Hợi Mão Mùi → Sửu.
  - Cung khởi mang chi năm sinh. Nam đi thuận, nữ đi nghịch, mỗi cung tiếp theo mang chi kế tiếp.
- **Tháng:** `thang(branch) = ((branch - mingGongBranch + |lunarMonth| - 1) mod 12) + 1`. Tức là cung Mệnh mang số tháng sinh âm lịch, rồi đếm thuận.
  - Quy tắc này chỉ mới khớp một lá số mẫu. Phải ghi rõ trong `docs/task-log.md` và nhờ anh Tuấn gửi lá số lyso thứ hai (năm xem khác) để xác nhận.
- **Sao lưu niên** (theo can chi năm xem):
  - Lưu tứ hóa: dùng `getLiuNianSiHua(namXem)`, hiển thị "L.Hóa Lộc/Quyền/Khoa" bên trái, "L.Hóa Kỵ" bên phải, đặt ở cung chứa sao được hóa.
  - L.Lộc Tồn (trái): theo can, dùng `LUCUN_TABLE`.
  - L.Kình Dương (phải): Lộc Tồn +1. L.Đà La (phải): Lộc Tồn −1.
  - L.Thiên Mã (trái): theo chi, dùng `TIANMA_TABLE`.
  - Chỉ những sao này. Đây là điều chỉnh so với bản thiết kế: bỏ lưu Khôi, Việt, Xương, Khúc vì lá số mẫu lyso không hiện. Ghi vào task-log.

- [ ] **Bước 1: Viết kiểm thử** với lá số tổng hợp `{ year: 1990, month: 1, day: 1, hour: 0, gender: 'male', calendarSystem: 'vietnam' }`:
  - `tieuHanNam` là một song ánh trên 12 chi.
  - Cung khởi đúng theo quy tắc tam hợp.
  - Đổi giới tính thì đảo chiều đi.
  - `thangHan` là song ánh 1..12 và `thangHan[mingGongBranch] === |lunarMonth|`.
  - Bản sao lá số có `lunarMonth = -lunarMonth` cho cùng kết quả.
  - `cungDaiHan(chart, lunarYear)` (tuổi mụ 1) trả `null`.
  - `saoLuuNien(2026)`: L.Lộc Tồn ở Tị (5), L.Kình Dương ở Ngọ (6), L.Đà La ở Thìn (4), L.Thiên Mã ở Thân (8).
- [ ] **Bước 2:** Chạy, kỳ vọng FAIL.
- [ ] **Bước 3:** Viết `han.ts`.
- [ ] **Bước 4:** Chạy, kỳ vọng PASS. Đối chiếu `work/mau-lyso.json`: "năm <chi>", "tháng <n>", cung đại hạn năm 2026 là Dậu, và các sao "L." đều khớp.
- [ ] **Bước 5:** Commit `feat(la-so): tiểu hạn, tháng, đại hạn và sao lưu niên theo năm xem`.

### Task 4: Lưới 4×4, Tuần/Triệt, tam phương

**Tệp:**
- Tạo: `lib/la-so/luoi.ts`
- Kiểm thử: `scripts/regression/la-so-luoi.test.ts`

**Giao diện (tạo ra):**
```ts
export const O_LUOI: Record<number, { hang: number; cot: number }>;
export function nhanTuanTriet(chart: ZiweiChart): { nhan: string; x: number; y: number }[];
export function duongTamPhuong(mingBranch: number): { x1: number; y1: number; x2: number; y2: number }[];
export function laSaoTuanTriet(name: string): boolean;
```
Chú thích:
- `O_LUOI` (hàng và cột tính từ 1): Tị(1,1) Ngọ(1,2) Mùi(1,3) Thân(1,4) Dậu(2,4) Tuất(3,4) Hợi(4,4) Tý(4,3) Sửu(4,2) Dần(4,1) Mão(3,1) Thìn(2,1).
- `nhanTuanTriet` trả tọa độ x, y theo % của toàn lưới.
- `duongTamPhuong` vẽ từ điểm trong của cung Mệnh tới điểm trong của các cung Mệnh+4, Mệnh+8 và Mệnh+6.
- `laSaoTuanTriet` đúng với 旬空, 副旬, 截空, 副截, 截路, 空亡.

**Quy tắc vị trí nhãn:**
- Cặp cung kề nhau theo chiều ngang (cùng hàng): nhãn đặt ở đầu trong của cạnh dọc chung. `x = (min(cot)) * 25`; `y = 25` nếu ở hàng 1, `y = 75` nếu ở hàng 4.
- Cặp kề nhau theo chiều dọc (cùng cột): nhãn đặt ở giữa cạnh ngang chung. `x = (cot - 0.5) * 25`, `y = min(hang) * 25`.
- Tuần và Triệt cùng một cặp: gộp thành một nhãn "Tuần · Triệt".
- "Điểm trong" của cung là trung điểm cạnh của ô giáp với Thiên bàn. Riêng 4 cung góc dùng góc trong.

- [ ] **Bước 1: Viết kiểm thử.**
  - Cặp Sửu–Tý cho `{x: 50, y: 75}`, cặp Tuất–Hợi cho `{x: 87.5, y: 75}` (đúng như mẫu đã duyệt).
  - Đủ 6 cặp Tuần có thể xảy ra đều cho tọa độ nằm trên một ranh giới trong lưới.
  - Một lá số giả có cả Tuần và Triệt ở Tý–Sửu chỉ cho một nhãn "Tuần · Triệt".
  - `duongTamPhuong(0)` cho 3 đoạn, cùng xuất phát từ `{x: 62.5, y: 75}`, kết thúc tại `{75, 25}`, `{25, 37.5}`, `{37.5, 25}`.
- [ ] **Bước 2:** Chạy, kỳ vọng FAIL.
- [ ] **Bước 3:** Viết `luoi.ts`.
- [ ] **Bước 4:** Chạy, kỳ vọng PASS. Đối chiếu mẫu lyso: Tuần ở Tuất–Hợi, Triệt ở Tý–Sửu.
- [ ] **Bước 5:** Commit `feat(la-so): lưới 4×4, vị trí Tuần/Triệt và tam phương`.

### Task 5: Dữ liệu Thiên bàn

**Tệp:**
- Tạo: `lib/la-so/thien-ban.ts`
- Kiểm thử: `scripts/regression/la-so-thien-ban.test.ts`

**Giao diện (tạo ra):**
```ts
export interface TuyChonHienThi { namXem: number; anHoTen?: boolean; anNgaySinh?: boolean }
export interface ThienBan {
  hoTen: string;
  dong: { nhan: string; duong?: string; am?: string; canChi: string }[];
  namXem: string; tuoi: string;
  amDuong: string; thuanNghich: string;
  menh: string; cuc: string; quanHe: string; thanCu: string;
  menhChu: string; thanChu: string; daiHan: string;
}
export function napAm(stem: number, branch: number): string;
export function thienBan(chart: ZiweiChart, tuyChon: TuyChonHienThi): ThienBan;
```
Chú thích:
- `dong` gồm 4 dòng Năm, Tháng, Ngày, Giờ.
- `amDuong`: "Dương Nam", "Âm Nữ"…
- `thuanNghich`: "Âm Dương thuận lý" hoặc "Âm Dương nghịch lý".
- `napAm` trả dạng "Đại Lâm Mộc".

**Giá trị chốt:**
- `napAm`: bảng 30 cặp nạp âm chuẩn, tiếng Việt. Ví dụ Giáp Tý/Ất Sửu → Hải Trung Kim, Mậu Thìn/Kỷ Tị → Đại Lâm Mộc, Bính Ngọ/Đinh Mùi → Thiên Hà Thủy.
- **Thuận/nghịch lý:** thuận lý khi tính âm dương của can năm sinh trùng với tính âm dương của chi cung Mệnh (`yearStem % 2 === mingGongBranch % 2`).
- **Quan hệ Cục–Mệnh:** dựa vào ngũ hành của Cục (`wuxingJuName`) và ngũ hành nạp âm của năm sinh. Một trong năm câu: "Cục sinh Mệnh", "Mệnh sinh Cục", "Cục khắc Mệnh", "Mệnh khắc Cục", "Cục Mệnh bình hòa".
- **Cục:** 水二局 Thủy Nhị Cục, 木三局 Mộc Tam Cục, 金四局 Kim Tứ Cục, 土五局 Thổ Ngũ Cục, 火六局 Hỏa Lục Cục.
- **Thân cư:** "Thân cư " + tên cung có `isShenGong`, viết thường có hoa đầu từ (ví dụ "Thân cư Tài Bạch"). Thân ở cung Mệnh thì ghi "Thân Mệnh đồng cung".
- **Đại hạn:** "Đại hạn hiện tại: 34–43 tuổi · cung Tử Tức". Nếu `cungDaiHan` là `null` thì ghi "Chưa vào đại hạn".
- **Ẩn:**
  - `anHoTen`: `hoTen = '(ẩn)'`.
  - `anNgaySinh`: các ô `duong`, `am` của 4 dòng là `undefined`, `canChi` của Ngày và Giờ là `'(ẩn)'`. Giữ can chi Năm, Tháng và tuổi.
- **Tháng nhuận:** cột âm của dòng Tháng ghi kèm " (nhuận)".
- **Giờ dương lịch:** lấy từ `birthInfo.origInput` (giờ đồng hồ). Không có thì để trống.

- [ ] **Bước 1: Viết kiểm thử.**
  - `napAm(4, 4) === 'Đại Lâm Mộc'`, `napAm(0, 0) === 'Hải Trung Kim'`, `napAm(2, 6) === 'Thiên Hà Thủy'`.
  - Với lá số tổng hợp năm 1990: đủ 4 dòng, mỗi dòng có `canChi` không chứa chữ Hán.
  - `anNgaySinh` xóa đúng các ô như quy định.
  - Lá số tháng nhuận có chữ "(nhuận)".
  - Năm xem bằng năm sinh cho ra "Chưa vào đại hạn".
- [ ] **Bước 2:** Chạy, kỳ vọng FAIL.
- [ ] **Bước 3:** Viết `thien-ban.ts`. Can chi tháng, ngày, giờ lấy từ `lunarInfo.fourPillars` (tiếng Trung) rồi dịch bằng `canChi`.
- [ ] **Bước 4:** Chạy, kỳ vọng PASS. Đối chiếu đủ các dòng Thiên bàn với mẫu lyso.
- [ ] **Bước 5:** Commit `feat(la-so): dữ liệu Thiên bàn`.

### Task 6: Lắp dữ liệu một cung

**Tệp:**
- Tạo: `lib/la-so/cung.ts`
- Kiểm thử: `scripts/regression/la-so-cung.test.ts`

**Giao diện:**
- Dùng: toàn bộ hàm của Task 2–4.
- Tạo ra:
```ts
export interface DongSao { ten: string; hanh?: NguHanh; dam?: boolean }
export interface CungHienThi {
  branch: number; hang: number; cot: number;
  can: string; chi: string; hanhChi: NguHanh;
  ten: string; than: boolean; daiHan?: number;
  chinhTinh: DongSao[]; trai: DongSao[]; phai: DongSao[];
  namTieuHan: string; trangSinh: string; thang: number;
  dangChayDaiHan: boolean; laMenh: boolean;
}
export function cungHienThi(chart: ZiweiChart, namXem: number): CungHienThi[];
```
Chú thích: `ten` là tên cung viết hoa. `daiHan` là tuổi bắt đầu đại hạn. Hàm trả về 12 phần tử, xếp theo chi.

**Quy tắc chốt:**
- **Chính tinh:** "TÊN (Đ)", viết hoa, `dam: true`, màu theo `nguHanhSao`.
- **Tứ hóa gốc:** mỗi cái là một dòng riêng, "Hóa Lộc (Đ)" lấy độ sáng của sao được hóa.
  - Lộc, Quyền, Khoa: cột trái, `hanh: 'moc'`, `dam: true`.
  - Kỵ: cột phải, không có `hanh` (màu đen), `dam: true`.
- **Thứ tự cột trái:** tứ hóa → sao `lucky` → sao `minor` cát → vòng Bác sĩ (nếu thuộc cát) → sao "L." cát.
- **Thứ tự cột phải:** Hóa Kỵ → sao `sha` → sao `minor` hung → vòng Thái Tuế → sao "L." hung.
  - Bác Sĩ, Thanh Long, Tướng Quân, Tấu Thư, Hỷ Thần xếp bên trái. Các sao còn lại của vòng Bác sĩ xếp bên phải.
  - Long Đức, Phúc Đức của vòng Thái Tuế xếp trái. Còn lại xếp phải.
- **Bỏ khỏi cột:**
  - Sao Tuần/Triệt (theo `laSaoTuanTriet`).
  - Sao `龙德` và `劫煞` engine đã chèn, nếu vòng Thái Tuế ở cùng cung đã có tên đó.
  - Mọi sao thuộc vòng Tướng tiền.
- **Sao không có độ sáng:** không ghi ngoặc.

- [ ] **Bước 1: Viết kiểm thử.**
  - 12 phần tử với `(hang, cot)` khác nhau.
  - Đúng một cung có `laMenh`.
  - Không cột nào chứa sao Tuần/Triệt.
  - Hóa Kỵ luôn nằm ở `phai[0]` khi cung có Hóa Kỵ.
  - **Chống tràn:** trên 500 lá số ngẫu nhiên (seed cố định), `max(trai.length, phai.length) <= 10`. Nếu vượt, ghi số lớn nhất tìm được vào task-log và giảm `line-height` ở Task 7 tương ứng. Không được cắt sao.
- [ ] **Bước 2:** Chạy, kỳ vọng FAIL.
- [ ] **Bước 3:** Viết `cung.ts`.
- [ ] **Bước 4:** Chạy, kỳ vọng PASS. In ra bảng của mẫu lyso trong `work/` và so tay với ảnh. Sao chỉ có trong tử vi Việt ghi vào mục "Đợt 2" trong task-log.
- [ ] **Bước 5:** Commit `feat(la-so): lắp dữ liệu hiển thị cho 12 cung`.

### Task 7: Component lá số

**Tệp:**
- Tạo: `components/la-so/LaSoViet.tsx`, `components/la-so/CungViet.tsx`, `components/la-so/ThienBan.tsx`, `components/la-so/la-so.css`, `app/chart/fonts.ts`

**Giao diện:**
- Dùng: `cungHienThi`, `thienBan`, `nhanTuanTriet`, `duongTamPhuong`.
- Tạo ra: `<LaSoViet chart={ZiweiChart} namXem={number} tuyChon={TuyChonHienThi} onChonCung?={(branch: number) => void} />`.

**Dựng theo đúng bản mẫu v3 đã duyệt:**
- Lưới CSS 4×4, mỗi hàng 212px, rộng tối thiểu 680px.
- SVG bát quái (opacity 0.08) và SVG tam phương (`z-index: 0`) nằm dưới lưới (`z-index: 1`). Nhãn Tuần/Triệt `z-index: 3`.
- Ô đại hạn đang chạy: nền `#FFE9A8`, viền trong 2px `#E0A800`. Ô Mệnh: nền `#FFEFD0`.
- Dấu triện: khung 2px `#E00000`, nền giấy để che đường kẻ.
- Màu ngũ hành là các class `.hanh-kim` … `.hanh-tho`.
- `fonts.ts` dùng `next/font/google` (`Be_Vietnam_Pro`, `Noto_Serif`, subset `vietnamese`), xuất ra biến CSS `--font-noi-dung` và `--font-tieu-de`.
- Không dùng framer-motion trong lá số mới.

- [ ] **Bước 1:** Viết ba component và CSS.
- [ ] **Bước 2:** Chạy `npm.cmd run typecheck` trên máy anh Tuấn (máy Claude không có React types). Kỳ vọng không có lỗi.
- [ ] **Bước 3:** Commit `feat(ui): component lá số Việt`.

### Task 8: Form nhập theo mẫu

**Tệp:**
- Sửa: `components/BirthForm.tsx`, `lib/ziwei/share.ts`
- Kiểm thử: `scripts/regression/la-so-form.test.ts`

**Giao diện:**
- `BirthFormState` thêm các trường tùy chọn: `namXem?: string`, `anHoTen?: boolean`, `anNgaySinh?: boolean`, `moTa?: string`, `gioChi?: number`. `gioChi` là chỉ số chi 0..11, chỉ dùng khi nhập âm lịch.
- `BirthFormProps` thêm `onPreview?: (info: BirthInfo) => void`.

**Quy tắc chốt:**
- **Nhập âm lịch:**
  - Giờ là ô chọn 12 chi kèm khung giờ ("Tý (23–01)").
  - Khi gửi: `clockHour = gioChi * 2`, `clockMinute = 0`, ép `timeConvention = 'clock'`.
  - Tháng là ô chọn Giêng, Hai, Ba, Tư, Năm, Sáu, Bảy, Tám, Chín, Mười, Một, Chạp, tương ứng 1..12.
- **Nhập dương lịch:** Giờ (00–23), Phút (00–59), Ngày, Tháng (ô chọn), Năm (ô số).
- **Năm:** bên cạnh hiện can chi. Năm xem mặc định là năm hiện tại.
- **"Theo âm lịch Trung Quốc (GMT+8)":** đánh dấu thì `calendarSystem = 'chinese'`, không đánh thì `'vietnam'`.
- **"Tôi chưa biết giờ sinh":** giữ nguyên cách xử lý hiện có (AGENTS.md), đặt dưới dòng ngày giờ.
- **Tùy chọn nâng cao:** dùng `<details>` "Tùy chọn nâng cao" gồm quy ước giờ, giờ Tý từ 23:00, tháng nhuận, múi giờ, kinh độ, khu vực, phiên bản engine.
- **Lỗi kiểm tra:** hiển thị ngay trên nút, màu `#E8000B`.
- **Liên kết chia sẻ:** `formToSearchParams` thêm `nx`, `ah`, `an`, `gc`. **Không** đưa `moTa` vào. `searchParamsToForm` đọc lại được các khóa đó.
- **Nút:** "Xem trước" gọi `onPreview`. "Lập lá số" gọi `onSubmit`.

- [ ] **Bước 1: Viết kiểm thử.**
  - Đi qua `formToSearchParams` rồi `searchParamsToForm` giữ được `namXem`, `anHoTen`, `anNgaySinh`, `gioChi`.
  - Tham số URL không chứa chuỗi mô tả, kể cả khi `moTa` có giá trị.
  - Form âm lịch có `gioChi = 1` thì `formToBirthInfo(...).hour === 1` (Sửu).
- [ ] **Bước 2:** Chạy, kỳ vọng FAIL.
- [ ] **Bước 3:** Sửa `share.ts`, rồi dựng lại giao diện `BirthForm.tsx` theo mẫu form đã duyệt. Logic kiểm tra hiện có giữ nguyên.
- [ ] **Bước 4:** Chạy kiểm thử mới và `test:vietnam-time`. Kỳ vọng PASS.
- [ ] **Bước 5:** Commit `feat(ui): form nhập theo mẫu lá số Việt`.

### Task 9: Trang `/chart`, năm xem và bản in

**Tệp:**
- Sửa: `app/chart/page.tsx`, `components/VietnameseReadings.tsx`
- Tạo: `components/la-so/in-an.css`

**Quy tắc chốt:**
- **Bố cục:** khung chàm bọc toàn trang, theo mục 7.4 của bản thiết kế.
  - Thanh công cụ gồm: Sửa thông tin sinh, ô Năm xem (số, kèm nút − và +), Sao chép liên kết, Lưu tệp JSON, In / lưu PDF.
  - Bỏ `TimeNav`, bỏ nút sáng/tối.
- **Xem trước:** `onPreview` lập lá số nhưng không gọi `save()`.
- **Ẩn họ tên:** khi `anHoTen` bật, tiêu đề trang ghi "Lá số Tử Vi", không ghi tên.
- **Liên kết:** liên kết chia sẻ và liên kết trên đầu trang dùng `process.env.NEXT_PUBLIC_BASE_PATH ?? ''` làm tiền tố.
- **Mô tả bản thân:** nếu có thì hiện khối "Mô tả bản thân" sau phần luận giải, giữ nguyên xuống dòng (`white-space: pre-wrap`).
- **Bản tĩnh:** khi `process.env.NEXT_PUBLIC_STATIC === '1'`, `VietnameseReadings` không hiện khối "Đối chiếu luận giải v4 gốc" và không gọi `fetch('/api/v4')`.
- **In:**
  - `@page { size: A4 portrait; margin: 10mm }`.
  - Ẩn thanh công cụ, đầu trang, chân trang, nút bấm.
  - Lá số (kèm tiêu đề trong khung) `break-after: page`, `break-inside: avoid`, scale vừa 190mm, `print-color-adjust: exact`.
  - Luận giải bắt đầu từ trang 2. Mô tả bản thân `break-before: page`.

- [ ] **Bước 1:** Sửa trang và CSS in.
- [ ] **Bước 2: Kiểm tra trên máy anh Tuấn.**
  - Chạy `npm.cmd run typecheck` và `npm.cmd test`, kỳ vọng tất cả PASS.
  - Chạy `npm.cmd run dev`, lập lá số 1990-01-01 00:00 nam.
  - Bấm "In / lưu PDF" và lưu PDF. Kỳ vọng trang 1 chỉ có lá số, đủ màu, không bị cắt. Luận giải bắt đầu từ trang 2.
  - Gửi ảnh chụp và file PDF cho Claude.
- [ ] **Bước 3:** Commit `feat(ui): trang lá số mới, năm xem và bản in A4`.

### Task 10: Hai bản đóng gói

**Tệp:**
- Sửa: `next.config.js`, `package.json`, `app/sitemap.ts`, `app/robots.ts`, `README.vi.md`
- Tạo: `scripts/dev/build-static.mjs`

**Quy tắc chốt:**
- **`next.config.js`:** khi `STATIC_EXPORT === '1'` thì thêm `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`, `basePath: process.env.TUVI_BASE_PATH || undefined`. Đồng thời đặt `env.NEXT_PUBLIC_STATIC = '1'` và `NEXT_PUBLIC_BASE_PATH`.
- **`build-static.mjs`:**
  - Chuyển `app/api` sang `work/api-tam` trước khi build. Trả lại trong `finally` (kể cả khi build lỗi).
  - Gọi `run.mjs build` với `STATIC_EXPORT=1`.
  - In ra đường dẫn thư mục `out/`.
- **`package.json`:** thêm `"build:static": "node scripts/dev/build-static.mjs"`.
- **`sitemap.ts`, `robots.ts`:** thêm `export const dynamic = 'force-static'`.
- **`README.vi.md`:** thêm mục "Đưa lên web" gồm:
  - Lệnh `npm.cmd run build:static`.
  - Chép thư mục `out/` lên hosting.
  - Dùng `TUVI_BASE_PATH=/tuvi` nếu đặt trong thư mục con.
  - Bản tĩnh không có v4.

- [ ] **Bước 1:** Sửa cấu hình và script.
- [ ] **Bước 2: Kiểm tra trên máy anh Tuấn.**
  - `npm.cmd run build:static` thành công, có `out/chart/index.html`, và `app/api` vẫn còn sau khi build.
  - `npx serve out` rồi mở `/chart/`, lập lá số. DevTools không có request nào tới `/api/`.
  - Mở `/` thì chuyển sang `/chart/`.
  - `npm.cmd run build` (bản Node) vẫn thành công.
- [ ] **Bước 3:** Commit `feat(build): bản web tĩnh và bản máy chủ Node`.

### Task 11: Kiểm tra cuối và ghi nhật ký

- [ ] **Bước 1:** Ghi vào `docs/task-log.md`: kết quả đối chiếu mẫu lyso (khớp hay lệch từng mục), những điều chỉnh so với bản thiết kế (quy tắc tháng, bỏ lưu Khôi/Việt/Xương/Khúc), và danh sách sao để dành cho đợt 2.
- [ ] **Bước 2:** Anh Tuấn chạy `npm.cmd run typecheck`, `npm.cmd test`, `npm.cmd run build`, `npm.cmd run build:static`. Tất cả phải đạt.
- [ ] **Bước 3:** Commit `docs: nhật ký giao diện lá số Việt đợt 1`, đẩy nhánh `giao-dien-la-so-viet`, mở pull request vào `main` của repo anh Tuấn.
