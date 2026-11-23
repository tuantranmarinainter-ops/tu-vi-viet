import { generateChart } from '../../../lib/ziwei/algorithm';
import type { ZiweiChart } from '../../../lib/ziwei/types';

/** Sinh n lá số giả lập với seed cố định (không phải dữ liệu sinh thật). */
export function laSoNgauNhien(n: number, seed = 20261123): ZiweiChart[] {
  let s = seed >>> 0;
  const r = (m: number) => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s % m; };
  const out: ZiweiChart[] = [];
  while (out.length < n) {
    const birth = { year: 1930 + r(100), month: 1 + r(12), day: 1 + r(28), hour: r(12),
      gender: (r(2) ? 'female' : 'male') as 'male' | 'female', calendarSystem: (r(4) ? 'vietnam' : 'chinese') as 'vietnam' | 'chinese' };
    try { out.push(generateChart(birth)); } catch { /* ngày ngoài phạm vi: bỏ qua */ }
  }
  return out;
}
