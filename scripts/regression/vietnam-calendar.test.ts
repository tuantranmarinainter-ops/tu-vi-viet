import assert from 'node:assert/strict';
import { test } from 'node:test';
import { solarToCalendar, calendarToSolar, engineLunarDate } from '../../lib/ziwei/vietnam-calendar';
import { generateChart } from '../../lib/ziwei/algorithm';

// Published Hồ Ngọc Đức examples (1974, 1984, 2004), plus modern reference dates.
// Round-trip tests below check consistency; they are not an independent astronomy oracle.
const cases = [
  { solar: { year: 1974, month: 12, day: 13 }, lunar: { year: 1974, month: 11, day: 1, isLeapMonth: false } },
  { solar: { year: 1984, month: 2, day: 2 }, lunar: { year: 1984, month: 1, day: 1, isLeapMonth: false } },
  { solar: { year: 1985, month: 1, day: 21 }, lunar: { year: 1985, month: 1, day: 1, isLeapMonth: false } },
  { solar: { year: 2004, month: 3, day: 21 }, lunar: { year: 2004, month: 2, day: 1, isLeapMonth: true } },
  { solar: { year: 2023, month: 3, day: 22 }, lunar: { year: 2023, month: 2, day: 1, isLeapMonth: true } },
  { solar: { year: 2026, month: 2, day: 17 }, lunar: { year: 2026, month: 1, day: 1, isLeapMonth: false } },
];
for (const fixture of cases) test(`Vietnam calendar reference: ${JSON.stringify(fixture.solar)}`, () => {
  assert.deepEqual(solarToCalendar(fixture.solar), fixture.lunar);
  assert.deepEqual(calendarToSolar(fixture.lunar), fixture.solar);
});

test('Vietnam calendar differs from Chinese at the documented 1974 boundary', () => {
  assert.deepEqual(solarToCalendar(cases[0].solar, 'chinese'), { year: 1974, month: 10, day: 30, isLeapMonth: false });
  const chart = generateChart({ ...cases[2].solar, hour: 6, gender: 'male', calendarSystem: 'vietnam' });
  assert.equal(chart.lunarInfo.lunarYear, 1985);
  assert.equal(chart.lunarInfo.lunarMonth, 1);
  assert.equal(chart.lunarInfo.yearStem, 1); // Ất, not Giáp from the Chinese calendar.
  assert.equal(chart.birthInfo.year, 1985);
  assert.equal(chart.birthInfo.profileVersion, 'vn-calendar-v1');
});

test('Invalid leap month and nonexistent lunar day do not silently roll over', () => {
  assert.throws(() => calendarToSolar({ year: 2026, month: 2, day: 1, isLeapMonth: true }));
  assert.throws(() => calendarToSolar({ year: 2026, month: 13, day: 1, isLeapMonth: false }));
});

test('January 1900 round trips through lunar year 1899', () => {
  const date = { year: 1900, month: 1, day: 1 };
  assert.deepEqual(calendarToSolar(solarToCalendar(date)), date);
});

test('Valid day-30 cases requiring distant equivalent years are supported', () => {
  for (const date of [{ year: 1975, month: 1, day: 11 }, { year: 1989, month: 8, day: 30 }, { year: 1955, month: 5, day: 21 }]) {
    const chart = generateChart({ ...date, hour: 6, gender: 'male', calendarSystem: 'vietnam' });
    assert.equal(chart.palaces.length, 12);
    assert.equal(chart.palaces.flatMap(palace => palace.stars).filter(star => star.type === 'major').length, 14);
    assert.equal(chart.birthInfo.year, date.year);
    assert.equal(chart.lunarInfo.lunarDay, 30);
  }
});

test('Every day-30 engine input across all solar dates 1900–2100 and leap policies is representable', () => {
  const tested = new Set<string>();
  for (let time = Date.UTC(1900, 0, 1); time <= Date.UTC(2100, 11, 31); time += 86_400_000) {
    const date = new Date(time);
    const lunar = solarToCalendar({ year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() });
    if (lunar.day !== 30) continue;
    for (const monthShift of lunar.isLeapMonth ? [0, 1] : [0]) {
      const month = lunar.month + monthShift;
      const input = { year: lunar.year + (month > 12 ? 1 : 0), month: month > 12 ? 1 : month, day: 30 };
      const key = JSON.stringify(input);
      if (!tested.has(key)) { engineLunarDate(input); tested.add(key); }
    }
  }
  assert.ok(tested.size > 1000);
});

test('Vietnam dates round trip and every valid natal day has a cycle-equivalent engine input', () => {
  let checked = 0;
  for (let year = 1950; year <= 2026; year++) {
    for (let month = 1; month <= 12; month++) {
      for (const day of [1, 15, 28]) {
        const solar = { year, month, day };
        const lunar = solarToCalendar(solar);
        assert.deepEqual(calendarToSolar(lunar), solar);
        const adapter = engineLunarDate(lunar);
        assert.equal(((adapter.year - lunar.year) % 60 + 60) % 60, 0);
        assert.equal(adapter.month, lunar.month);
        assert.equal(adapter.day, lunar.day);
        checked++;
      }
    }
  }
  assert.equal(checked, 2772);
});
