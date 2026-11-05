import assert from 'node:assert/strict';
import { test } from 'node:test';
import fixtures from '../fixtures/vietnam-time.json';
import { calculateTrueSolarTime, resolveZiweiDayOffset, shiftGregorianDate } from '../../lib/ziwei/true-solar-time';
import { formToBirthInfo, formToSearchParams, searchParamsToForm } from '../../lib/ziwei/share';
import { historyKey } from '../../lib/ziwei/history';
import type { BirthFormState } from '../../components/BirthForm';
import { historicalHint } from '../../lib/ziwei/historical-time';

for (const fixture of fixtures.cases) {
  test(`Vietnam time helper: ${fixture.id}`, () => {
    const solar = calculateTrueSolarTime(fixture.input);
    const expected = fixture.expected;
    assert.equal(solar.dateValid, true);
    assert.equal(solar.branch, expected.branch);
    assert.equal(solar.dayOffset, expected.dayOffset);
    assert.ok(Math.abs(solar.longitudeCorrectionMinutes - expected.longitudeCorrectionMinutes) < 1e-8);
    assert.deepEqual(shiftGregorianDate(fixture.input, resolveZiweiDayOffset(solar, 'next-day')), expected.nextDayDate);
    if (expected.currentDayDate) {
      assert.deepEqual(shiftGregorianDate(fixture.input, resolveZiweiDayOffset(solar, 'current-day')), expected.currentDayDate);
    }
  });
}

const form: BirthFormState = { name: '', year: '2000', month: '7', day: '15', clockHour: '11', clockMinute: '30', unknownTime: false, province: 'Việt Nam', city: 'Hà Nội', longitude: 105.8342, gender: 'male', calendarSystem: 'vietnam', utcOffsetMinutes: 420, inputCalendar: 'solar', timeConvention: 'solar', lateZishi: 'next-day', leapMonthPolicy: 'split' };

test('VN-001: URL round trip preserves profile, normalized hour and original input', () => {
  const birth = formToBirthInfo(form);
  assert.equal(birth.hour, 6);
  assert.equal(birth.origInput?.clockHour, 11);
  const restored = searchParamsToForm(formToSearchParams(form)) as BirthFormState;
  assert.deepEqual(formToBirthInfo(restored), birth);
  assert.equal(historyKey(form), historyKey(restored));
  assert.notEqual(historyKey(form), historyKey({ ...form, utcOffsetMinutes: 480 }));
  assert.notEqual(historyKey(form), historyKey({ ...form, longitude: 108 }));
});

test('VN-001: unknown birth time is rejected instead of becoming a Ty-hour chart', () => {
  assert.throws(() => formToBirthInfo({ ...form, unknownTime: true }), /Chưa biết giờ sinh/);
});

test('VN-001: clock convention and day rollover preserve the original date', () => {
  const input = { ...form, year: '2000', month: '12', day: '31', clockHour: '23', timeConvention: 'clock' as const };
  const nextDay = formToBirthInfo(input);
  assert.deepEqual([nextDay.year, nextDay.month, nextDay.day, nextDay.hour], [2001, 1, 1, 0]);
  assert.equal(nextDay.origInput?.day, 31);
  assert.equal(formToBirthInfo({ ...input, lateZishi: 'current-day' }).day, 31);
});

test('VN-001: invalid runtime date, time and timezone are rejected', () => {
  for (const invalid of [{ ...form, clockHour: '' }, { ...form, clockMinute: '60' }, { ...form, month: '2', day: '30' }, { ...form, utcOffsetMinutes: NaN }]) assert.throws(() => formToBirthInfo(invalid));
});

test('Historical advice separates clock UTC from the lunar-calendar convention', () => {
  const d = { year: 1974, month: 12, day: 13 };
  assert.equal(historicalHint(d, 'north')?.calendarSystem, 'vietnam');
  assert.equal(historicalHint(d, 'south')?.utcOffsetMinutes, 480);
  const southern1957 = historicalHint({ year: 1957, month: 3, day: 1 }, 'south');
  assert.equal(southern1957?.utcOffsetMinutes, 420);
  assert.equal(southern1957?.calendarSystem, 'chinese');
  assert.equal(historicalHint({ year: 1945, month: 4, day: 1 }, 'unknown'), null);
});
