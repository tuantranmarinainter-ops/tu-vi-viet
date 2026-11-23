# Kế hoạch dịch nội dung tiếng Trung (trừ bộ dữ liệu v4)

Anh Tuấn yêu cầu ngày 23/11/2026: dịch toàn bộ nội dung tri thức tiếng Trung của repo gốc Renhuai123/ziwei-doushu (bản `39c0abd`, 21/11/2026), **trừ bộ dữ liệu luận giải v4**.
Bản gốc của từng tệp nằm trong `docs/dich/nguon/` (giữ nguyên đường dẫn như repo gốc). Tổng: 47 tệp, khoảng 652.000 chữ Hán.
Bỏ qua: 37 tệp tài liệu quy trình nội bộ trong `research/nishi-video-reading` (nhật ký thử nghiệm AI, khoảng 43.000 chữ) — không có giá trị luận giải.

## Giấy phép — bắt buộc giữ

| Nhóm | Giấy phép nguồn | Bản dịch phải |
|---|---|---|
| 1. Cách cục, hợp hôn (`lib/ziwei/patterns*.ts`, `heming-knowledge.ts`) | MIT | Ghi nguồn Renhuai123/ziwei-doushu ở đầu tệp |
| 2. Lời giảng Nghê Hải Hạ (`lib/nihai`, `docs/tianji-ziwei`) | CC BY-NC-SA 4.0, **phi thương mại** | Đầu tệp ghi: nguồn, tác giả, "Bản dịch tiếng Việt, CC BY-NC-SA 4.0, không dùng thương mại" |
| 3. Ghi chú Cornell (`research/nishi-video-reading/康奈尔笔记`) | CC BY 4.0, có trích lời Nghê Hải Hạ (NC-SA) | Như nhóm 2 (vì có trích lời Nghê Hải Hạ) |

## Quy tắc dịch

1. Tên sao, cung, can chi, cách cục: theo `docs/glossary-vi.md` và `lib/la-so/ten-viet.ts` (Hán Việt quen dùng trong tử vi Việt). Tên cách cục dùng âm Hán Việt (ví dụ 紫府同宫 → Tử Phủ đồng cung), lần đầu xuất hiện có thể kèm chữ Hán trong ngoặc.
2. Văn phong: tiếng Việt tự nhiên, rõ nghĩa; không dịch word-by-word. Câu phú cổ: dịch nghĩa, lần đầu kèm âm Hán Việt.
3. Giữ nguyên mọi dẫn chứng: tên sách, số tập, mốc thời gian video (ví dụ `[2上 · 00:25:27]`), liên kết.
4. Hình ảnh trong ghi chú Cornell: đổi đường dẫn tương đối thành liên kết tới repo gốc `https://github.com/Renhuai123/ziwei-doushu/blob/39c0abd/research/nishi-video-reading/...` (không chép ảnh).
5. Không thêm, không bớt ý; chỗ nào nguồn mơ hồ ghi `[ghi chú người dịch: …]`.
6. Nhóm 1 (mã TS): tạo bản tiếng Việt trong `lib/la-so/cach-cuc/` — **logic, điều kiện, khóa tiếng Trung giữ y nguyên**, chỉ dịch chuỗi hiển thị (`name`, `description`, `conditions`, `source`); tên sao chèn bằng `${x.name}` đổi thành `${tenSao(x.name)}` (import từ `lib/la-so/ten-viet`). Bỏ `import 'server-only'`. Viết kiểm thử: với 500 lá số ngẫu nhiên (`scripts/regression/helpers/la-so-ngau-nhien.ts`) kết quả nhận diện (số cách cục, mức `level`) của bản Việt bằng bản gốc, và chuỗi hiển thị không còn chữ Hán.

## Môi trường kiểm thử khi không cài được npm (nhóm 1)

Phiên tự động không có mạng tới npm. Dựng phụ thuộc engine từ mã nguồn GitHub (git clone vẫn chạy):

```bash
mkdir -p work/nm && cd work/nm
git clone -q --depth 1 -b v2.6.1 https://github.com/SylarLong/iztro
for r in 6tail/lunar-javascript iamkun/dayjs SylarLong/lunar-lite 6tail/lunar-typescript; do git clone -q --depth 1 https://github.com/$r; done
git clone -q --depth 1 -b v23.16.8 https://github.com/i18next/i18next
git clone -q --depth 1 https://github.com/NghiaCaNgao/LunarDate lunar_date_vi
cd ../..
python3 - <<'PY'
import json
def fix(d, main, typ=None):
    p = json.load(open(f'work/nm/{d}/package.json')); p['main'] = main
    for k in ('exports', 'module'): p.pop(k, None)
    if typ: p['type'] = typ
    json.dump(p, open(f'work/nm/{d}/package.json', 'w'))
fix('dayjs', 'src/index.js', 'module'); fix('i18next', 'src/index.js', 'module'); fix('iztro', 'src/index.ts')
fix('lunar-lite', 'src/index.ts'); fix('lunar-typescript', 'src/lib/index.ts'); fix('lunar_date_vi', 'src/index.ts')
PY
mkdir -p node_modules/@nghiavuive
for d in dayjs i18next iztro lunar-lite lunar-typescript lunar-javascript; do ln -sfn $PWD/work/nm/$d node_modules/$d; done
ln -sfn $PWD/work/nm/lunar_date_vi node_modules/@nghiavuive/lunar_date_vi
ln -sfn "$(dirname "$(dirname "$(readlink -f "$(which tsx)")")")" node_modules/tsx   # tsx cài toàn cục
node node_modules/tsx/dist/cli.mjs scripts/regression/run-all.ts   # phải đạt hết
```

## Quy trình mỗi phiên dịch

1. `git checkout dich-noi-dung && git pull`.
2. Chọn các dòng **"chưa"** đầu tiên trong bảng dưới, cộng dồn tới khoảng **25.000 chữ Hán** (một tệp lớn hơn thì dịch riêng tệp đó, chia theo mục).
3. Dịch theo quy tắc trên, lưu vào cột "Đầu ra".
4. Kiểm tra: tệp đầu ra không còn câu tiếng Trung chưa dịch (cho phép chữ Hán trong ngoặc chú thích, tên sách); Markdown còn hiển thị đúng.
5. Sửa cột trạng thái thành "xong" (hoặc "đang: tới mục …"), commit `docs(dich): <tệp>` và push nhánh `dich-noi-dung`.
6. Ghi một dòng vào `docs/task-log.md` (mục DICH-NOI-DUNG).

## Câu lệnh mở một phiên dịch mới

> Mở repo tuantranmarinainter-ops/tu-vi-viet, nhánh `dich-noi-dung`. Đọc `docs/dich/KE-HOACH-DICH.md` và làm đúng một lượt "Quy trình mỗi phiên dịch" (khoảng 25.000 chữ Hán), rồi commit và push. Trả lời bằng tiếng Việt, báo các tệp đã dịch và số chữ.

## Bảng việc

| # | Nhóm | Tệp nguồn | Chữ Hán | Giấy phép | Đầu ra | Trạng thái |
|---|---|---|---|---|---|---|
| 1 | 1. Cách cục / hợp hôn | `lib/ziwei/patterns.ts` | 5,905 | MIT | `lib/la-so/cach-cuc/ (bản TS tiếng Việt, logic giữ nguyên)` | xong |
| 2 | 1. Cách cục / hợp hôn | `lib/ziwei/patterns-dingfu.ts` | 1,040 | MIT | `lib/la-so/cach-cuc/ (bản TS tiếng Việt, logic giữ nguyên)` | xong |
| 3 | 1. Cách cục / hợp hôn | `lib/ziwei/patterns-dinggui.ts` | 2,552 | MIT | `lib/la-so/cach-cuc/ (bản TS tiếng Việt, logic giữ nguyên)` | xong |
| 4 | 1. Cách cục / hợp hôn | `lib/ziwei/patterns-dingpin.ts` | 1,327 | MIT | `lib/la-so/cach-cuc/ (bản TS tiếng Việt, logic giữ nguyên)` | xong |
| 5 | 1. Cách cục / hợp hôn | `lib/ziwei/patterns-dingza.ts` | 2,020 | MIT | `lib/la-so/cach-cuc/ (bản TS tiếng Việt, logic giữ nguyên)` | xong |
| 6 | 1. Cách cục / hợp hôn | `lib/ziwei/heming-knowledge.ts` | 4,334 | MIT | `lib/la-so/cach-cuc/ (bản TS tiếng Việt, logic giữ nguyên)` | xong |
| 7 | 2. Lời giảng Nghê Hải Hạ | `lib/nihai/diji.ts` | 1,377 | CC BY-NC-SA 4.0 | `docs/dich/vi/lib/nihai/diji.ts` | xong |
| 8 | 2. Lời giảng Nghê Hải Hạ | `lib/nihai/index.ts` | 1,091 | CC BY-NC-SA 4.0 | `docs/dich/vi/lib/nihai/index.ts` | xong |
| 9 | 2. Lời giảng Nghê Hải Hạ | `lib/nihai/renji.ts` | 7,549 | CC BY-NC-SA 4.0 | `docs/dich/vi/lib/nihai/renji.ts` | xong |
| 10 | 2. Lời giảng Nghê Hải Hạ | `lib/nihai/tianji.ts` | 6,678 | CC BY-NC-SA 4.0 | `docs/dich/vi/lib/nihai/tianji.ts` | xong |
| 11 | 2. Lời giảng Nghê Hải Hạ | `lib/nihai/types.ts` | 247 | CC BY-NC-SA 4.0 | `docs/dich/vi/lib/nihai/types.ts` | xong |
| 12 | 2. Lời giảng Nghê Hải Hạ | `docs/tianji-ziwei/10上.md` | 12,035 | CC BY-NC-SA 4.0 | `docs/dich/vi/docs/tianji-ziwei/10上.md` | xong |
| 13 | 2. Lời giảng Nghê Hải Hạ | `docs/tianji-ziwei/11上.md` | 8,170 | CC BY-NC-SA 4.0 | `docs/dich/vi/docs/tianji-ziwei/11上.md` | đang: nhận 2026-11-23 09:31 UTC |
| 14 | 2. Lời giảng Nghê Hải Hạ | `docs/tianji-ziwei/12上.md` | 7,593 | CC BY-NC-SA 4.0 | `docs/dich/vi/docs/tianji-ziwei/12上.md` | đang: nhận 2026-11-23 09:31 UTC |
| 15 | 2. Lời giảng Nghê Hải Hạ | `docs/tianji-ziwei/13上.md` | 8,384 | CC BY-NC-SA 4.0 | `docs/dich/vi/docs/tianji-ziwei/13上.md` | đang: nhận 2026-11-23 09:31 UTC |
| 16 | 2. Lời giảng Nghê Hải Hạ | `docs/tianji-ziwei/14上.md` | 7,064 | CC BY-NC-SA 4.0 | `docs/dich/vi/docs/tianji-ziwei/14上.md` | chưa |
| 17 | 2. Lời giảng Nghê Hải Hạ | `docs/tianji-ziwei/15上.md` | 8,496 | CC BY-NC-SA 4.0 | `docs/dich/vi/docs/tianji-ziwei/15上.md` | chưa |
| 18 | 2. Lời giảng Nghê Hải Hạ | `docs/tianji-ziwei/19上_补充1.md` | 6,464 | CC BY-NC-SA 4.0 | `docs/dich/vi/docs/tianji-ziwei/19上_补充1.md` | chưa |
| 19 | 2. Lời giảng Nghê Hải Hạ | `docs/tianji-ziwei/24下_补充2.md` | 2,767 | CC BY-NC-SA 4.0 | `docs/dich/vi/docs/tianji-ziwei/24下_补充2.md` | chưa |
| 20 | 2. Lời giảng Nghê Hải Hạ | `docs/tianji-ziwei/2上.md` | 7,018 | CC BY-NC-SA 4.0 | `docs/dich/vi/docs/tianji-ziwei/2上.md` | chưa |
| 21 | 2. Lời giảng Nghê Hải Hạ | `docs/tianji-ziwei/3上.md` | 7,319 | CC BY-NC-SA 4.0 | `docs/dich/vi/docs/tianji-ziwei/3上.md` | chưa |
| 22 | 2. Lời giảng Nghê Hải Hạ | `docs/tianji-ziwei/4上.md` | 10,745 | CC BY-NC-SA 4.0 | `docs/dich/vi/docs/tianji-ziwei/4上.md` | chưa |
| 23 | 2. Lời giảng Nghê Hải Hạ | `docs/tianji-ziwei/5上.md` | 12,710 | CC BY-NC-SA 4.0 | `docs/dich/vi/docs/tianji-ziwei/5上.md` | chưa |
| 24 | 2. Lời giảng Nghê Hải Hạ | `docs/tianji-ziwei/6上.md` | 13,380 | CC BY-NC-SA 4.0 | `docs/dich/vi/docs/tianji-ziwei/6上.md` | chưa |
| 25 | 2. Lời giảng Nghê Hải Hạ | `docs/tianji-ziwei/7上.md` | 13,708 | CC BY-NC-SA 4.0 | `docs/dich/vi/docs/tianji-ziwei/7上.md` | chưa |
| 26 | 2. Lời giảng Nghê Hải Hạ | `docs/tianji-ziwei/8上.md` | 12,003 | CC BY-NC-SA 4.0 | `docs/dich/vi/docs/tianji-ziwei/8上.md` | chưa |
| 27 | 2. Lời giảng Nghê Hải Hạ | `docs/tianji-ziwei/9上.md` | 11,713 | CC BY-NC-SA 4.0 | `docs/dich/vi/docs/tianji-ziwei/9上.md` | chưa |
| 28 | 2. Lời giảng Nghê Hải Hạ | `docs/tianji-ziwei/LICENSE.md` | 126 | CC BY-NC-SA 4.0 | `docs/dich/vi/docs/tianji-ziwei/LICENSE.md` | chưa |
| 29 | 2. Lời giảng Nghê Hải Hạ | `docs/tianji-ziwei/README.md` | 1,031 | CC BY-NC-SA 4.0 | `docs/dich/vi/docs/tianji-ziwei/README.md` | chưa |
| 30 | 3. Ghi chú Cornell | `research/nishi-video-reading/康奈尔笔记/P15/P15-康奈尔笔记.md` | 32,816 | CC BY 4.0 + trích lời Nghê Hải Hạ (NC-SA) | `docs/dich/vi/research/nishi-video-reading/康奈尔笔记/P15/P15-康奈尔笔记.md` | chưa |
| 31 | 3. Ghi chú Cornell | `research/nishi-video-reading/康奈尔笔记/P23/P23-康奈尔笔记.md` | 29,487 | CC BY 4.0 + trích lời Nghê Hải Hạ (NC-SA) | `docs/dich/vi/research/nishi-video-reading/康奈尔笔记/P23/P23-康奈尔笔记.md` | chưa |
| 32 | 3. Ghi chú Cornell | `research/nishi-video-reading/康奈尔笔记/P29/P29-康奈尔笔记.md` | 29,527 | CC BY 4.0 + trích lời Nghê Hải Hạ (NC-SA) | `docs/dich/vi/research/nishi-video-reading/康奈尔笔记/P29/P29-康奈尔笔记.md` | chưa |
| 33 | 3. Ghi chú Cornell | `research/nishi-video-reading/康奈尔笔记/P11/P11-康奈尔笔记.md` | 35,544 | CC BY 4.0 + trích lời Nghê Hải Hạ (NC-SA) | `docs/dich/vi/research/nishi-video-reading/康奈尔笔记/P11/P11-康奈尔笔记.md` | chưa |
| 34 | 3. Ghi chú Cornell | `research/nishi-video-reading/康奈尔笔记/P25/P25-康奈尔笔记.md` | 26,483 | CC BY 4.0 + trích lời Nghê Hải Hạ (NC-SA) | `docs/dich/vi/research/nishi-video-reading/康奈尔笔记/P25/P25-康奈尔笔记.md` | chưa |
| 35 | 3. Ghi chú Cornell | `research/nishi-video-reading/康奈尔笔记/P48/P48-康奈尔笔记.md` | 6,412 | CC BY 4.0 + trích lời Nghê Hải Hạ (NC-SA) | `docs/dich/vi/research/nishi-video-reading/康奈尔笔记/P48/P48-康奈尔笔记.md` | chưa |
| 36 | 3. Ghi chú Cornell | `research/nishi-video-reading/康奈尔笔记/P37/P37-康奈尔笔记.md` | 10,165 | CC BY 4.0 + trích lời Nghê Hải Hạ (NC-SA) | `docs/dich/vi/research/nishi-video-reading/康奈尔笔记/P37/P37-康奈尔笔记.md` | chưa |
| 37 | 3. Ghi chú Cornell | `research/nishi-video-reading/康奈尔笔记/P03/P03-康奈尔笔记.md` | 32,797 | CC BY 4.0 + trích lời Nghê Hải Hạ (NC-SA) | `docs/dich/vi/research/nishi-video-reading/康奈尔笔记/P03/P03-康奈尔笔记.md` | chưa |
| 38 | 3. Ghi chú Cornell | `research/nishi-video-reading/康奈尔笔记/P09/P09-康奈尔笔记.md` | 35,045 | CC BY 4.0 + trích lời Nghê Hải Hạ (NC-SA) | `docs/dich/vi/research/nishi-video-reading/康奈尔笔记/P09/P09-康奈尔笔记.md` | chưa |
| 39 | 3. Ghi chú Cornell | `research/nishi-video-reading/康奈尔笔记/P07/P07-康奈尔笔记.md` | 28,377 | CC BY 4.0 + trích lời Nghê Hải Hạ (NC-SA) | `docs/dich/vi/research/nishi-video-reading/康奈尔笔记/P07/P07-康奈尔笔记.md` | chưa |
| 40 | 3. Ghi chú Cornell | `research/nishi-video-reading/康奈尔笔记/P13/P13-康奈尔笔记.md` | 36,726 | CC BY 4.0 + trích lời Nghê Hải Hạ (NC-SA) | `docs/dich/vi/research/nishi-video-reading/康奈尔笔记/P13/P13-康奈尔笔记.md` | chưa |
| 41 | 3. Ghi chú Cornell | `research/nishi-video-reading/康奈尔笔记/P17/P17-康奈尔笔记.md` | 33,281 | CC BY 4.0 + trích lời Nghê Hải Hạ (NC-SA) | `docs/dich/vi/research/nishi-video-reading/康奈尔笔记/P17/P17-康奈尔笔记.md` | chưa |
| 42 | 3. Ghi chú Cornell | `research/nishi-video-reading/康奈尔笔记/P27/P27-康奈尔笔记.md` | 29,060 | CC BY 4.0 + trích lời Nghê Hải Hạ (NC-SA) | `docs/dich/vi/research/nishi-video-reading/康奈尔笔记/P27/P27-康奈尔笔记.md` | chưa |
| 43 | 3. Ghi chú Cornell | `research/nishi-video-reading/康奈尔笔记/P19/P19-康奈尔笔记.md` | 35,876 | CC BY 4.0 + trích lời Nghê Hải Hạ (NC-SA) | `docs/dich/vi/research/nishi-video-reading/康奈尔笔记/P19/P19-康奈尔笔记.md` | chưa |
| 44 | 3. Ghi chú Cornell | `research/nishi-video-reading/康奈尔笔记/P21/P21-康奈尔笔记.md` | 31,204 | CC BY 4.0 + trích lời Nghê Hải Hạ (NC-SA) | `docs/dich/vi/research/nishi-video-reading/康奈尔笔记/P21/P21-康奈尔笔记.md` | chưa |
| 45 | 3. Ghi chú Cornell | `research/nishi-video-reading/康奈尔笔记/P05/P05-康奈尔笔记.md` | 29,484 | CC BY 4.0 + trích lời Nghê Hải Hạ (NC-SA) | `docs/dich/vi/research/nishi-video-reading/康奈尔笔记/P05/P05-康奈尔笔记.md` | chưa |
| 46 | 3. Ghi chú Cornell | `research/nishi-video-reading/康奈尔笔记/P01/P01-康奈尔笔记.md` | 5,310 | CC BY 4.0 + trích lời Nghê Hải Hạ (NC-SA) | `docs/dich/vi/research/nishi-video-reading/康奈尔笔记/P01/P01-康奈尔笔记.md` | chưa |
| 47 | 3. Ghi chú Cornell | `research/nishi-video-reading/docs/康奈尔笔记模板.md` | 122 | CC BY 4.0 + trích lời Nghê Hải Hạ (NC-SA) | `docs/dich/vi/research/nishi-video-reading/docs/康奈尔笔记模板.md` | chưa |
