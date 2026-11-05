import type { BirthFormState } from '@/components/BirthForm';
import type { BirthInfo } from './types';
import { branchFromSolarMinutes, calculateTrueSolarTime, isValidGregorianDate, resolveZiweiDayOffset, shiftGregorianDate } from './true-solar-time';
import { calendarToSolar } from './vietnam-calendar';

/** Legacy signature retained for old integrations; modern forms use normalizeBirthForm. */
export function calcTrueSolarBranch(clockHour: number, clockMinute: number, longitude: number): number {
  const minutes = (clockHour * 60 + clockMinute + (longitude - 120) * 4 + 1440) % 1440;
  return branchFromSolarMinutes(minutes);
}

export function normalizeBirthForm(form: BirthFormState) {
  if (form.unknownTime) throw new RangeError('Chưa biết giờ sinh: hãy chọn một giờ giả định để so sánh; chưa thể lập lá số xác định.');
  let date = { year: Number(form.year), month: Number(form.month), day: Number(form.day) };
  if (form.inputCalendar === 'lunar') date = calendarToSolar({ ...date, isLeapMonth: !!form.lunarLeap }, form.calendarSystem ?? 'chinese');
  if (!isValidGregorianDate(date.year, date.month, date.day) || date.year < 1900 || date.year > new Date().getFullYear()) throw new RangeError('Ngày sinh không hợp lệ hoặc nằm ngoài phạm vi hỗ trợ.');
  const clockHour = Number(form.clockHour);
  const clockMinute = Number(form.clockMinute);
  if (form.clockHour === '' || form.clockMinute === '' || !Number.isInteger(clockHour) || clockHour < 0 || clockHour > 23 || !Number.isInteger(clockMinute) || clockMinute < 0 || clockMinute > 59) throw new RangeError('Giờ sinh phải từ 00:00 đến 23:59.');
  if (form.gender !== 'male' && form.gender !== 'female') throw new RangeError('Giới tính lập lá số không hợp lệ.');
  const utcOffsetMinutes = form.utcOffsetMinutes ?? 480;
  if (!Number.isFinite(utcOffsetMinutes) || utcOffsetMinutes < -720 || utcOffsetMinutes > 840) throw new RangeError('Múi giờ không hợp lệ.');
  const convention = form.timeConvention ?? 'legacy-longitude';
  if (!['clock', 'solar', 'legacy-longitude'].includes(convention)) throw new RangeError('Quy ước giờ không hợp lệ.');
  if (convention !== 'clock' && (!Number.isFinite(form.longitude) || form.longitude < -180 || form.longitude > 180)) throw new RangeError('Kinh độ phải từ -180 đến 180.');
  if (convention === 'solar' && !form.city && !form.province && !form.locationConfirmed) throw new RangeError('Chọn nơi sinh hoặc nhập kinh độ đã xác nhận trước khi dùng giờ mặt trời.');
  if (form.calendarSystem && !['vietnam', 'chinese'].includes(form.calendarSystem)) throw new RangeError('Hệ lịch không hợp lệ.');
  if (form.lateZishi && !['next-day', 'current-day'].includes(form.lateZishi)) throw new RangeError('Quy tắc giờ Tý không hợp lệ.');
  let solar = calculateTrueSolarTime({ ...date, clockHour, clockMinute, utcOffsetMinutes, longitude: convention === 'solar' ? form.longitude : undefined });
  if (convention === 'legacy-longitude') {
    const rawMinutes = clockHour * 60 + clockMinute + (form.longitude - 120) * 4;
    const normalizedMinutes = ((rawMinutes % 1440) + 1440) % 1440;
    solar = { ...solar, rawMinutes, normalizedMinutes, dayOffset: Math.floor(rawMinutes / 1440), branch: branchFromSolarMinutes(normalizedMinutes), hour: Math.floor(normalizedMinutes / 60), minute: Math.floor(normalizedMinutes % 60), totalCorrectionMinutes: (form.longitude - 120) * 4 };
  }
  const offset = resolveZiweiDayOffset(solar, form.lateZishi ?? 'next-day');
  return { date: shiftGregorianDate(date, offset), originalDate: date, solar, offset, convention, utcOffsetMinutes, clockHour, clockMinute };
}

/** Shared conversion for chart, compatibility, saved history and URL round trips. */
export function formToBirthInfo(form: BirthFormState): BirthInfo {
  const normalized = normalizeBirthForm(form);
  return {
    ...normalized.date,
    hour: normalized.solar.branch,
    gender: form.gender,
    name: form.name || undefined,
    province: form.province || undefined,
    city: form.city || undefined,
    longitude: form.province || normalized.convention === 'solar' ? form.longitude : undefined,
    calendarSystem: form.calendarSystem ?? 'chinese',
    calendarUtcOffsetMinutes: form.calendarSystem === 'vietnam' ? 420 : 480,
    utcOffsetMinutes: normalized.utcOffsetMinutes,
    timeConvention: normalized.convention,
    lateZishi: form.lateZishi ?? 'next-day',
    leapMonthPolicy: form.leapMonthPolicy ?? 'split',
    engineVersion: form.engineVersion ?? 'current',
    inputCalendar: form.inputCalendar ?? 'solar',
    originalCalendarDate: { year: Number(form.year), month: Number(form.month), day: Number(form.day), isLeapMonth: !!form.lunarLeap },
    origInput: { ...normalized.originalDate, clockHour: normalized.clockHour, clockMinute: normalized.clockMinute },
  };
}

export function formToSearchParams(form: BirthFormState): URLSearchParams {
  const p = new URLSearchParams();
  if (form.name) p.set('n', form.name);
  for (const [key, value] of [['y', form.year], ['m', form.month], ['d', form.day], ['h', form.clockHour], ['mi', form.clockMinute], ['p', form.province], ['c', form.city], ['lo', String(form.longitude)]]) if (value) p.set(key, value);
  p.set('g', form.gender === 'male' ? 'm' : 'f');
  if (form.unknownTime) p.set('u', '1');
  if (form.calendarSystem) p.set('cal', form.calendarSystem);
  if (form.inputCalendar) p.set('input', form.inputCalendar);
  if (form.lunarLeap) p.set('leap', '1');
  if (form.utcOffsetMinutes !== undefined) p.set('tz', String(form.utcOffsetMinutes));
  if (form.timeConvention) p.set('time', form.timeConvention);
  if (form.lateZishi) p.set('ty', form.lateZishi);
  if (form.leapMonthPolicy) p.set('lm', form.leapMonthPolicy);
  if (form.engineVersion) p.set('engine', form.engineVersion);
  if (form.locationConfirmed) p.set('loc', '1');
  if (form.birthRegion) p.set('region', form.birthRegion);
  return p;
}

export function searchParamsToForm(params: URLSearchParams): Partial<BirthFormState> | null {
  const year = params.get('y'), month = params.get('m'), day = params.get('d');
  if (!year || !month || !day) return null;
  const time = params.get('time');
  const leapPolicy = params.get('lm');
  return {
    name: params.get('n') || '', year, month, day,
    unknownTime: params.get('u') === '1', clockHour: params.get('h') ?? '8', clockMinute: params.get('mi') ?? '0',
    province: params.get('p') || '', city: params.get('c') || '', longitude: Number(params.get('lo') ?? '120'),
    gender: params.get('g') === 'f' ? 'female' : 'male',
    calendarSystem: params.get('cal') === 'vietnam' ? 'vietnam' : 'chinese',
    inputCalendar: params.get('input') === 'lunar' ? 'lunar' : 'solar', lunarLeap: params.get('leap') === '1',
    utcOffsetMinutes: Number(params.get('tz') ?? '480'),
    timeConvention: time === 'clock' || time === 'solar' ? time : 'legacy-longitude',
    lateZishi: params.get('ty') === 'current-day' ? 'current-day' : 'next-day',
    leapMonthPolicy: leapPolicy === 'prev-month' || leapPolicy === 'next-month' || leapPolicy === 'origin-month' ? leapPolicy : 'split',
    engineVersion: params.get('engine') === 'v4' ? 'v4' : 'current',
    locationConfirmed: params.get('loc') === '1',
    birthRegion: params.get('region') === 'north' ? 'north' : params.get('region') === 'south' ? 'south' : 'unknown',
  };
}
