import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateChart } from '../../lib/ziwei/algorithm';
import { napAm, thienBan, canChiNgay } from '../../lib/la-so/thien-ban';

const han = /\p{Script=Han}/u;
const c = generateChart({ year: 1990, month: 1, day: 1, hour: 0, gender: 'male', calendarSystem: 'vietnam' });

test('Nạp âm', () => {
  assert.equal(napAm(4, 4), 'Đại Lâm Mộc');
  assert.equal(napAm(0, 0), 'Hải Trung Kim');
  assert.equal(napAm(2, 6), 'Thiên Hà Thủy');
  assert.equal(napAm(9, 11), 'Đại Hải Thủy');
});

test('Can chi ngày theo dương lịch', () => {
  assert.equal(canChiNgay(1988, 4, 24), 'Kỷ Dậu');
  assert.equal(canChiNgay(2000, 1, 1), 'Mậu Ngọ');
});

test('Đủ 4 dòng, không chữ Hán, có đủ các mục', () => {
  const t = thienBan(c, { namXem: 2026 });
  assert.deepEqual(t.dong.map(d => d.nhan), ['Năm', 'Tháng', 'Ngày', 'Giờ']);
  for (const v of [t.hoTen, t.namXem, t.namXemCanChi, t.tuoi, t.amDuong, t.thuanNghich, t.menh, t.cuc, t.quanHe, t.thanCu, t.menhChu, t.thanChu, t.daiHan, ...t.dong.map(d => d.canChi)])
    assert.ok(v && !han.test(v), `giá trị lỗi: ${v}`);
  assert.match(t.daiHan, /^Đại hạn hiện tại: \d+–\d+ tuổi · cung /);
  assert.equal(t.tuoi, '38 tuổi'); // 1/1/1990 vẫn thuộc năm âm Kỷ Tị 1989
});

test('Ẩn họ tên và ngày sinh', () => {
  const t = thienBan({ ...c, birthInfo: { ...c.birthInfo, name: 'Nguyễn Văn An' } }, { namXem: 2026, anHoTen: true, anNgaySinh: true });
  assert.equal(t.hoTen, '(ẩn)');
  assert.ok(t.dong.every(d => d.duong === undefined && d.am === undefined));
  assert.equal(t.dong[2].canChi, '(ẩn)');
  assert.equal(t.dong[3].canChi, '(ẩn)');
  assert.ok(!han.test(t.dong[0].canChi) && t.dong[0].canChi !== '(ẩn)');
});

test('Tháng nhuận và chưa vào đại hạn', () => {
  const nhuan = { ...c, lunarInfo: { ...c.lunarInfo, lunarMonth: -Math.abs(c.lunarInfo.lunarMonth), isLeapMonth: true } };
  assert.match(thienBan(nhuan, { namXem: 2026 }).dong[1].am ?? '', /\(nhuận\)$/);
  assert.equal(thienBan(c, { namXem: c.lunarInfo.lunarYear }).daiHan, 'Chưa vào đại hạn');
});
