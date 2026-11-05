import { SolarDate, LunarDate } from '@nghiavuive/lunar_date_vi';
import { Lunar, Solar } from 'lunar-javascript';
import { isValidGregorianDate, type GregorianDate } from './true-solar-time';

export interface CalendarDate extends GregorianDate { isLeapMonth: boolean }
export type CalendarSystem = 'vietnam' | 'chinese';

function validateYear(year: number, min = 1900) {
  if (!Number.isInteger(year) || year < min || year > 2100) throw new RangeError('Lịch hỗ trợ ngày dương trong năm 1900–2100.');
}

export function solarToCalendar(date: GregorianDate, system: CalendarSystem = 'vietnam'): CalendarDate {
  validateYear(date.year);
  if (!isValidGregorianDate(date.year, date.month, date.day)) throw new RangeError('Ngày dương lịch không tồn tại.');
  if (system === 'chinese') {
    const lunar = Solar.fromYmd(date.year, date.month, date.day).getLunar();
    return { year: lunar.getYear(), month: Math.abs(lunar.getMonth()), day: lunar.getDay(), isLeapMonth: lunar.getMonth() < 0 };
  }
  const lunar = new SolarDate(date).toLunarDate().get();
  return { year: lunar.year, month: lunar.month, day: lunar.day, isLeapMonth: lunar.leap_month };
}

export function calendarToSolar(date: CalendarDate, system: CalendarSystem = 'vietnam'): GregorianDate {
  validateYear(date.year, 1899); // January 1900 belongs to lunar year 1899.
  if (!Number.isInteger(date.month) || date.month < 1 || date.month > 12 || !Number.isInteger(date.day) || date.day < 1 || date.day > 30) {
    throw new RangeError('Ngày âm lịch không hợp lệ.');
  }
  let result: GregorianDate;
  if (system === 'chinese') {
    const solar = Lunar.fromYmd(date.year, date.isLeapMonth ? -date.month : date.month, date.day).getSolar();
    result = { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() };
  } else {
    const lunar = new LunarDate({ year: date.year, month: date.month, day: date.day, leap_month: date.isLeapMonth });
    lunar.init();
    const solar = lunar.toSolarDate().get();
    result = { year: solar.year, month: solar.month, day: solar.day };
  }
  const roundtrip = solarToCalendar(result, system);
  if (roundtrip.year !== date.year || roundtrip.month !== date.month || roundtrip.day !== date.day || roundtrip.isLeapMonth !== date.isLeapMonth) {
    throw new RangeError('Ngày hoặc tháng nhuận không tồn tại trong lịch đã chọn.');
  }
  return result;
}

/** Engine byLunar delegates to a Chinese-calendar conversion. A cycle-equivalent
 * ordinary lunar date supplies the exact year stem/branch, month and day to the
 * natal rules, even if that Vietnamese day 30 does not exist in the Chinese month.
 * The real Gregorian input, Vietnamese date and current age are kept separately.
 */
export function engineLunarDate(date: GregorianDate): GregorianDate {
  for (const offset of [0, -60, 60, -120, 120, -180, 180, -240, 240]) {
    const year = date.year + offset;
    if (year < 1700 || year > 2300) continue;
    try {
      const candidate = Lunar.fromYmd(year, date.month, date.day).getSolar().getLunar();
      if (candidate.getYear() === year && candidate.getMonth() === date.month && candidate.getDay() === date.day) {
        return { year, month: date.month, day: date.day };
      }
    } catch { /* Try an equivalent sexagenary year, never roll an invalid date. */ }
  }
  throw new RangeError('Engine chưa biểu diễn được ngày âm này; không tự chuyển sang ngày khác.');
}
