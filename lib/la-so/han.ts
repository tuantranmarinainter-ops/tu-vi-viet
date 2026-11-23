import type { ZiweiChart } from '../ziwei/types';
import { LUCUN_TABLE, TIANMA_TABLE } from '../ziwei/constants';
import { getLiuNianSiHua, getYearStemIndex, getYearBranchIndex } from '../ziwei/sihua';

const m12 = (n: number) => ((n % 12) + 12) % 12;

/** Tuổi mụ tại năm xem (năm âm lịch sinh tính là 1 tuổi). */
export function tuoiMu(chart: ZiweiChart, namXem: number): number {
  return namXem - chart.lunarInfo.lunarYear + 1;
}

/** Chi của cung đang chạy đại hạn tại năm xem; null khi chưa vào đại hạn đầu. */
export function cungDaiHan(chart: ZiweiChart, namXem: number): number | null {
  const tuoi = tuoiMu(chart, namXem);
  const p = chart.palaces.find(x => x.daXianAge && tuoi >= x.daXianAge[0] && tuoi <= x.daXianAge[1]);
  return p ? p.branch : null;
}

/** Cung khởi tiểu hạn theo tam hợp chi năm sinh. */
const KHOI_TIEU_HAN: Record<number, number> = { 2: 4, 6: 4, 10: 4, 8: 10, 0: 10, 4: 10, 5: 7, 9: 7, 1: 7, 11: 1, 3: 1, 7: 1 };

/** Với mỗi chi cung: chi của năm có tiểu hạn rơi vào cung đó. Nam đi thuận, nữ đi nghịch. */
export function tieuHanNam(chart: ZiweiChart): Record<number, number> {
  const yb = chart.lunarInfo.yearBranch;
  const khoi = KHOI_TIEU_HAN[yb];
  const buoc = chart.birthInfo.gender === 'female' ? -1 : 1;
  const out: Record<number, number> = {};
  for (let i = 0; i < 12; i++) out[m12(khoi + buoc * i)] = m12(yb + i);
  return out;
}

/**
 * Số tháng ở góc dưới mỗi cung: cung Mệnh mang tháng sinh âm lịch, đếm thuận.
 * Quy tắc suy từ một lá số mẫu lyso.vn — cần lá số mẫu thứ hai để xác nhận.
 */
export function thangHan(chart: ZiweiChart): Record<number, number> {
  const thangSinh = Math.abs(chart.lunarInfo.lunarMonth);
  const out: Record<number, number> = {};
  for (let b = 0; b < 12; b++) out[b] = m12(b - chart.mingGongBranch + thangSinh - 1) + 1;
  return out;
}

export interface SaoLuu { ten: string; cot: 'trai' | 'phai' }

const TEN_HOA: Record<string, string> = { '禄': 'Lộc', '权': 'Quyền', '科': 'Khoa', '忌': 'Kỵ' };

/** Sao lưu niên đợt 1: lưu tứ hóa, Lộc Tồn, Kình Dương, Đà La, Thiên Mã. */
export function saoLuuNien(chart: ZiweiChart, namXem: number): Record<number, SaoLuu[]> {
  const out: Record<number, SaoLuu[]> = {};
  const them = (b: number, s: SaoLuu) => { (out[m12(b)] ??= []).push(s); };
  const { transforms } = getLiuNianSiHua(namXem);
  for (const [hoa, sao] of Object.entries(transforms)) {
    const p = chart.palaces.find(x => x.stars.some(s => s.name === sao));
    if (p) them(p.branch, { ten: `L.Hóa ${TEN_HOA[hoa]}`, cot: hoa === '忌' ? 'phai' : 'trai' });
  }
  const loc = LUCUN_TABLE[getYearStemIndex(namXem)];
  them(loc, { ten: 'L.Lộc Tồn', cot: 'trai' });
  them(loc + 1, { ten: 'L.Kình Dương', cot: 'phai' });
  them(loc - 1, { ten: 'L.Đà La', cot: 'phai' });
  them(TIANMA_TABLE[getYearBranchIndex(namXem)], { ten: 'L.Thiên Mã', cot: 'trai' });
  return out;
}
