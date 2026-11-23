import assert from 'node:assert/strict';
import { test } from 'node:test';
import { doSangViet, nguHanhChi, nguHanhSao } from '../../lib/la-so/ngu-hanh';
import { tenSao, tenCung, tenVong, canChi } from '../../lib/la-so/ten-viet';
import { laSoNgauNhien } from './helpers/la-so-ngau-nhien';

const han = /\p{Script=Han}/u;

test('Độ sáng quy về M/V/Đ/B/H', () => {
  const exp: Record<string, string> = { '庙': 'M', '旺': 'V', '得': 'Đ', '利': 'Đ', '地': 'Đ', '平': 'B', '闲': 'B', '不': 'H', '陷': 'H' };
  for (const [k, v] of Object.entries(exp)) assert.equal(doSangViet(k as never), v, k);
  assert.equal(doSangViet(undefined), undefined);
});

test('Ngũ hành 12 chi', () => {
  assert.deepEqual([...Array(12).keys()].map(nguHanhChi),
    ['thuy', 'tho', 'moc', 'moc', 'tho', 'hoa', 'hoa', 'tho', 'kim', 'kim', 'tho', 'thuy']);
});

test('Ngũ hành hiển thị chính tinh (Tham Lang tô Mộc)', () => {
  assert.equal(nguHanhSao('紫微'), 'tho');
  assert.equal(nguHanhSao('廉贞'), 'hoa');
  assert.equal(nguHanhSao('贪狼'), 'moc');
  assert.equal(nguHanhSao('七杀'), 'kim');
  assert.equal(nguHanhSao('天梁'), 'tho');
});

test('Tên cung theo giới tính, can chi và vòng sao', () => {
  assert.equal(tenCung('夫妻', 'female'), 'PHU QUÂN');
  assert.equal(tenCung('夫妻', 'male'), 'THÊ THIẾP');
  assert.equal(tenCung('命宫', 'male'), 'MỆNH');
  assert.equal(tenCung('仆役', 'male'), 'NÔ BỘC');
  assert.equal(canChi(3, 5), 'Đinh Tị');
  assert.equal(tenVong('小耗', 'boShi'), 'Tiểu Hao');
  assert.equal(tenVong('小耗', 'suiQian'), 'Tử Phù');
  assert.equal(tenVong('病符', 'suiQian'), 'Trực Phù');
  assert.equal(tenVong('长生', 'trangSinh'), 'Trường Sinh');
});

test('500 lá số ngẫu nhiên: không còn chữ Hán trong tên sao, cung, vòng', () => {
  const thieu = new Set<string>();
  for (const chart of laSoNgauNhien(500)) for (const p of chart.palaces) {
    for (const s of p.stars) if (han.test(tenSao(s.name))) thieu.add(s.name);
    for (const g of ['male', 'female'] as const) if (han.test(tenCung(p.name, g))) thieu.add(p.name);
    if (p.changSheng && han.test(tenVong(p.changSheng, 'trangSinh'))) thieu.add(p.changSheng);
    if (p.boShi && han.test(tenVong(p.boShi, 'boShi'))) thieu.add(p.boShi);
    if (p.suiQian && han.test(tenVong(p.suiQian, 'suiQian'))) thieu.add(p.suiQian);
  }
  assert.deepEqual([...thieu], []);
});
