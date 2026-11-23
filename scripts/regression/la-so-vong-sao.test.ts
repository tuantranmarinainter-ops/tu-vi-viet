import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateChart } from '../../lib/ziwei/algorithm';

const cases = Array.from({ length: 24 }, (_, i) => ({
  year: 1950 + i * 3, month: (i % 12) + 1, day: 1 + (i % 27), hour: i % 12,
  gender: (i % 2 ? 'female' : 'male') as 'male' | 'female', calendarSystem: 'vietnam' as const,
}));

test('Mỗi lá số có đủ 12 sao mỗi vòng, không trùng', () => {
  for (const birth of cases) {
    const chart = generateChart(birth);
    for (const key of ['changSheng', 'boShi', 'suiQian'] as const) {
      const names = chart.palaces.map(p => p[key]);
      assert.ok(names.every(n => typeof n === 'string' && n.length > 0), `${key} thiếu ở ${JSON.stringify(birth)}`);
      assert.equal(new Set(names).size, 12, `${key} trùng ở ${JSON.stringify(birth)}`);
    }
  }
});

test('Bác Sĩ đứng cùng cung Lộc Tồn', () => {
  const chart = generateChart({ year: 1990, month: 1, day: 1, hour: 0, gender: 'male', calendarSystem: 'vietnam' });
  const boshi = chart.palaces.find(p => p.boShi === '博士');
  assert.ok(boshi?.stars.some(s => s.name === '禄存'));
});
