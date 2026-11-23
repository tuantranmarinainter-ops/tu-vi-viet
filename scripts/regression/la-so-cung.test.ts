import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateChart } from '../../lib/ziwei/algorithm';
import { cungHienThi, SO_DONG_TOI_DA } from '../../lib/la-so/cung';
import { laSaoTuanTriet } from '../../lib/la-so/luoi';
import { tenSao } from '../../lib/la-so/ten-viet';
import { laSoNgauNhien } from './helpers/la-so-ngau-nhien';

const c = generateChart({ year: 1990, month: 1, day: 1, hour: 0, gender: 'male', calendarSystem: 'vietnam' });
const ds = cungHienThi(c, 2026);

test('12 cung, vị trí khác nhau, đúng một cung Mệnh', () => {
  assert.equal(ds.length, 12);
  assert.equal(new Set(ds.map(x => `${x.hang},${x.cot}`)).size, 12);
  assert.equal(ds.filter(x => x.laMenh).length, 1);
  assert.equal(ds.find(x => x.laMenh)!.branch, c.mingGongBranch);
});

test('Không hiện sao Tuần/Triệt trong cột', () => {
  const tt = new Set(['旬空', '副旬', '截空', '副截'].map(tenSao));
  for (const x of ds) for (const s of [...x.trai, ...x.phai]) assert.ok(!tt.has(s.ten.replace(/ \(.\)$/, '')), s.ten);
  assert.ok(laSaoTuanTriet('旬空'));
});

test('Hóa Kỵ đứng đầu cột phải; Hóa Lộc/Quyền/Khoa đầu cột trái, màu Mộc', () => {
  for (const x of ds) {
    const ky = x.phai.findIndex(s => s.ten.startsWith('Hóa Kỵ'));
    if (ky >= 0) assert.equal(ky, 0);
    x.trai.forEach((s, i) => { if (/^Hóa (Lộc|Quyền|Khoa)/.test(s.ten)) { assert.equal(s.hanh, 'moc'); assert.ok(x.trai.slice(0, i).every(t => t.ten.startsWith('Hóa '))); } });
  }
  assert.equal(ds.flatMap(x => [...x.trai, ...x.phai]).filter(s => /^Hóa /.test(s.ten)).length, 4);
});

test('Chính tinh viết hoa, in đậm; cung vô chính diệu có mảng rỗng', () => {
  for (const x of ds) for (const s of x.chinhTinh) { assert.equal(s.ten, s.ten.toUpperCase()); assert.ok(s.dam); }
});

test('Không lặp tên sao trong cùng một cung', () => {
  for (const ch of laSoNgauNhien(200)) for (const x of cungHienThi(ch, 2026)) {
    const ten = [...x.trai, ...x.phai].map(s => s.ten.replace(/ \(.\)$/, ''));
    assert.equal(new Set(ten).size, ten.length, `${x.branch}: ${ten.join(', ')}`);
  }
});

test('Chống tràn: mỗi cột không vượt sức chứa thiết kế (SO_DONG_TOI_DA) trên 500 lá số', () => {
  let max = 0;
  for (const ch of laSoNgauNhien(500)) for (const x of cungHienThi(ch, 2026)) max = Math.max(max, x.trai.length, x.phai.length);
  assert.ok(max <= SO_DONG_TOI_DA, `cột dài nhất ${max} dòng`);
});

test('Chỉ ghi độ sáng cho chính tinh, tứ hóa và nhóm sao lá số Việt có ghi', () => {
  const coGhi = new Set(['Lộc Tồn', 'Thiên Mã', 'Văn Xương', 'Văn Khúc', 'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp',
    'Thiên Hình', 'Thiên Diêu', 'Thiên Khốc', 'Thiên Hư', 'Đại Hao']);
  for (const ch of laSoNgauNhien(100)) for (const x of cungHienThi(ch, 2026)) for (const s of [...x.trai, ...x.phai]) {
    const m = s.ten.match(/^(.*) \((.)\)$/);
    if (m && !m[1].startsWith('Hóa ')) assert.ok(coGhi.has(m[1]), `không được ghi độ sáng: ${s.ten}`);
  }
});

test('Không hiện Đại Hao năm chi và Phi Liêm (蜚廉) kiểu Trung Quốc: mỗi tên chỉ một lần trên lá số', () => {
  for (const ch of laSoNgauNhien(100)) {
    const ten = cungHienThi(ch, 2026).flatMap(x => [...x.trai, ...x.phai]).map(s => s.ten.replace(/ \(.\)$/, ''));
    assert.equal(ten.filter(t => t === 'Phi Liêm').length, 1);
    assert.equal(ten.filter(t => t === 'Đại Hao').length, 1);
  }
});
