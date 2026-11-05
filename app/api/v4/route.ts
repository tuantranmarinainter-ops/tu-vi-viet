import { getV4Reading } from '@/lib/server/v4';
import { READING_TOPICS } from '@/lib/ziwei/readings-vi';
import type { BirthInfo } from '@/lib/ziwei/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 16_000) return Response.json({ message: 'Yêu cầu quá lớn.' }, { status: 413 });
    const body = JSON.parse(raw);
    if (!body.birth || !READING_TOPICS.some(topic => topic.key === body.topic)) return Response.json({ message: 'Yêu cầu không hợp lệ.' }, { status: 400 });
    const b = body.birth;
    if (![b.year, b.month, b.day, b.hour].every(Number.isInteger) || b.year < 1950 || b.year > 2026 || b.hour < 0 || b.hour > 11 || !['male', 'female'].includes(b.gender)) throw new RangeError('Ngày, giờ, giới tính hoặc năm nằm ngoài dữ liệu v4.');
    if (b.calendarSystem && !['vietnam', 'chinese'].includes(b.calendarSystem)) throw new RangeError('Hệ lịch không hợp lệ.');
    if (b.engineVersion && !['current', 'v4'].includes(b.engineVersion)) throw new RangeError('Phiên bản engine không hợp lệ.');
    if (b.leapMonthPolicy && !['split', 'prev-month', 'next-month', 'origin-month'].includes(b.leapMonthPolicy)) throw new RangeError('Quy tắc tháng nhuận không hợp lệ.');
    const birth: BirthInfo = { year: b.year, month: b.month, day: b.day, hour: b.hour, gender: b.gender, calendarSystem: b.calendarSystem ?? 'chinese', engineVersion: b.engineVersion ?? 'current', leapMonthPolicy: b.leapMonthPolicy ?? 'split' };
    return Response.json(await getV4Reading(birth, body.topic), { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ message: error instanceof Error ? error.message : 'Không đọc được dữ liệu v4.' }, { status: error instanceof RangeError || error instanceof SyntaxError ? 400 : 503 });
  }
}
