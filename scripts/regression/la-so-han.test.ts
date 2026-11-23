import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateChart } from '../../lib/ziwei/algorithm';
import { tuoiMu, cungDaiHan, tieuHanNam, thangHan, saoLuuNien } from '../../lib/la-so/han';

const nam = generateChart({ year: 1990, month: 1, day: 1, hour: 0, gender: 'male', calendarSystem: 'vietnam' });
const nu = generateChart({ year: 1990, month: 1, day: 1, hour: 0, gender: 'female', calendarSystem: 'vietnam' });
const KHOI: Record<number, number> = { 2: 4, 6: 4, 10: 4, 8: 10, 0: 10, 4: 10, 5: 7, 9: 7, 1: 7, 11: 1, 3: 1, 7: 1 };

test('Tiểu hạn: song ánh, khởi theo tam hợp, nam thuận nữ nghịch', () => {
  const yb = nam.lunarInfo.yearBranch;
  for (const [chart, buoc] of [[nam, 1], [nu, -1]] as const) {
    const t = tieuHanNam(chart);
    assert.equal(new Set(Object.values(t)).size, 12);
    const khoi = KHOI[yb];
    assert.equal(t[khoi], yb);
    assert.equal(t[(khoi + buoc + 12) % 12], (yb + 1) % 12);
  }
});

test('Tháng: tháng Giêng = từ cung tiểu hạn năm xem đếm nghịch tới tháng sinh, rồi thuận tới giờ sinh', () => {
  // 1/1/1990 giờ Tý, nam: năm âm Kỷ Tị (1989), tháng 12. Tiểu hạn khởi Mùi (Tị Dậu Sửu), nam thuận → năm Ngọ 2026 ở Thân.
  // Từ Thân nghịch 11 cung tới tháng 12 → Dậu; thuận 0 cung (giờ Tý) → tháng Giêng ở Dậu.
  const t = thangHan(nam, 2026);
  assert.deepEqual(Object.values(t).sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(t[9], 1);
  assert.equal(t[10], 2);
  assert.equal(thangHan(nam, 2027)[10], 1, 'năm xem đổi thì tháng Giêng dời theo tiểu hạn');
  const nhuan = { ...nam, lunarInfo: { ...nam.lunarInfo, lunarMonth: -nam.lunarInfo.lunarMonth, isLeapMonth: true } };
  assert.deepEqual(thangHan(nhuan, 2026), t);
});

test('Đại hạn theo năm xem; chưa vào đại hạn thì null', () => {
  assert.equal(tuoiMu(nam, nam.lunarInfo.lunarYear), 1);
  assert.equal(cungDaiHan(nam, nam.lunarInfo.lunarYear), null);
  const p = nam.palaces.find(x => x.daXianAge?.[0] === 30 || (x.daXianAge && x.daXianAge[0] <= 40 && x.daXianAge[1] >= 40))!;
  assert.equal(cungDaiHan(nam, nam.lunarInfo.lunarYear + 39), p.branch);
});

test('Sao lưu niên năm 2026 (Bính Ngọ)', () => {
  const l = saoLuuNien(nam, 2026);
  const o = (ten: string) => Number(Object.entries(l).find(([, v]) => v.some(s => s.ten === ten))?.[0]);
  assert.equal(o('L.Lộc Tồn'), 5);
  assert.equal(o('L.Kình Dương'), 6);
  assert.equal(o('L.Đà La'), 4);
  assert.equal(o('L.Thiên Mã'), 8);
  const dong = nam.palaces.find(p => p.stars.some(s => s.name === '天同'))!.branch;
  assert.equal(o('L.Hóa Lộc'), dong);
  assert.equal(l[dong].find(s => s.ten === 'L.Hóa Lộc')?.cot, 'trai');
  const liem = nam.palaces.find(p => p.stars.some(s => s.name === '廉贞'))!.branch;
  assert.equal(l[liem].find(s => s.ten === 'L.Hóa Kỵ')?.cot, 'phai');
});

test('Năm xem gõ tay: chỉ nhận năm 1900–2100, giá trị dở dang trả null', async () => {
  const { namXemHopLe } = await import('../../lib/la-so/han');
  assert.equal(namXemHopLe('2027'), 2027);
  assert.equal(namXemHopLe(''), null);
  assert.equal(namXemHopLe('20'), null);
  assert.equal(namXemHopLe('2101'), null);
  assert.equal(namXemHopLe('2026.5'), null);
});
