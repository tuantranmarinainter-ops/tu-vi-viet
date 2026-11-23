import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateChart } from '../../lib/ziwei/algorithm';
import type { ZiweiChart } from '../../lib/ziwei/types';
import { O_LUOI, nhanTuanTriet, duongTamPhuong, laSaoTuanTriet } from '../../lib/la-so/luoi';

const goc = generateChart({ year: 1990, month: 1, day: 1, hour: 0, gender: 'male', calendarSystem: 'vietnam' });
function gia(cap: Record<string, [number, number]>): ZiweiChart {
  const palaces = goc.palaces.map(p => ({ ...p, stars: p.stars.filter(s => !laSaoTuanTriet(s.name)) }));
  for (const [ten, [a, b]] of Object.entries(cap)) {
    const [s1, s2] = ten === 'tuan' ? ['旬空', '副旬'] : ['截空', '副截'];
    palaces.find(p => p.branch === a)!.stars.push({ name: s1, type: 'sha' });
    palaces.find(p => p.branch === b)!.stars.push({ name: s2, type: 'sha' });
  }
  return { ...goc, palaces };
}

test('Lưới 4×4 đủ 12 ô khác nhau trên viền', () => {
  const o = Object.values(O_LUOI).map(v => `${v.hang},${v.cot}`);
  assert.equal(new Set(o).size, 12);
  assert.deepEqual(O_LUOI[5], { hang: 1, cot: 1 });
  assert.deepEqual(O_LUOI[0], { hang: 4, cot: 3 });
});

test('Vị trí nhãn khớp mẫu đã duyệt', () => {
  assert.deepEqual(nhanTuanTriet(gia({ triet: [0, 1] })), [{ nhan: 'Triệt', x: 50, y: 75 }]);
  assert.deepEqual(nhanTuanTriet(gia({ tuan: [10, 11] })), [{ nhan: 'Tuần', x: 87.5, y: 75 }]);
});

test('Sáu cặp Tuần đều nằm trên ranh giới trong lưới', () => {
  for (const a of [0, 2, 4, 6, 8, 10]) {
    const [n] = nhanTuanTriet(gia({ tuan: [a, a + 1] }));
    assert.ok(n.x > 0 && n.x < 100 && n.y > 0 && n.y < 100, `cặp ${a}`);
    assert.ok(n.x % 25 === 0 || n.y % 25 === 0, `cặp ${a} không trên ranh`);
  }
});

test('Tuần và Triệt cùng cặp gộp một nhãn', () => {
  assert.deepEqual(nhanTuanTriet(gia({ tuan: [0, 1], triet: [1, 0] })), [{ nhan: 'Tuần - Triệt', x: 50, y: 75 }]);
});

test('Tam phương từ Mệnh Tý', () => {
  assert.equal(duongTamPhuong(0).length, 3);
  const ends = duongTamPhuong(0).map(d => `${d.x2},${d.y2}`).sort();
  assert.deepEqual(ends, ['25,37.5', '37.5,25', '75,25']);
  assert.ok(duongTamPhuong(0).every(d => d.x1 === 62.5 && d.y1 === 75));
});
