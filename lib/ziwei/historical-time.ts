import type { GregorianDate } from './true-solar-time';

export type BirthRegion = 'unknown' | 'north' | 'south';
interface HistoricalHint { utcOffsetMinutes: number; calendarSystem: 'vietnam' | 'chinese'; explanation: string }

/** Suggestions only; the form applies one only after an explicit user action.
 * Civil UTC offsets and the lunar-calendar convention must stay separate.
 * Sources: IANA tzdb asia; Ho Ngoc Duc histcal.html. Uncertain periods are not guessed.
 */
export function historicalHint(date: GregorianDate, region: BirthRegion): HistoricalHint | null {
  const y = date.year;
  if (y >= 1976) return { utcOffsetMinutes: 420, calendarSystem: 'vietnam', explanation: 'Từ 1976: lịch Việt và giờ đồng hồ UTC+7 trong phạm vi Việt Nam.' };
  if (region === 'north' && y >= 1968) return { utcOffsetMinutes: 420, calendarSystem: 'vietnam', explanation: 'Miền Bắc từ 1968 dùng lịch âm theo UTC+7; giờ đồng hồ cũng UTC+7.' };
  if (region === 'south') {
    if (y >= 1960 && y <= 1974) return { utcOffsetMinutes: 480, calendarSystem: 'chinese', explanation: 'Miền Nam giai đoạn 1960–1974: giờ đồng hồ UTC+8; lịch âm theo quy ước UTC+8.' };
    if (y >= 1956 && y <= 1958) return { utcOffsetMinutes: 420, calendarSystem: 'chinese', explanation: 'Miền Nam 1956–1958: đồng hồ UTC+7, nhưng âm lịch theo quy ước UTC+8. Hai mục không được gộp làm một.' };
    if (y === 1975 && date.month >= 7) return { utcOffsetMinutes: 420, calendarSystem: 'chinese', explanation: 'Từ tháng 7/1975 miền Nam đã dùng đồng hồ UTC+7; quy ước lịch âm giai đoạn chuyển tiếp vẫn cần đối chiếu lịch UTC+8.' };
  }
  return null;
}
