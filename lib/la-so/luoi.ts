import type { ZiweiChart } from '../ziwei/types';

/** Vị trí ô của từng chi trên lưới 4×4 (hàng, cột tính từ 1). */
export const O_LUOI: Record<number, { hang: number; cot: number }> = {
  5: { hang: 1, cot: 1 }, 6: { hang: 1, cot: 2 }, 7: { hang: 1, cot: 3 }, 8: { hang: 1, cot: 4 },
  9: { hang: 2, cot: 4 }, 10: { hang: 3, cot: 4 }, 11: { hang: 4, cot: 4 }, 0: { hang: 4, cot: 3 },
  1: { hang: 4, cot: 2 }, 2: { hang: 4, cot: 1 }, 3: { hang: 3, cot: 1 }, 4: { hang: 2, cot: 1 },
};

const TUAN = ['旬空', '副旬'];
const TRIET = ['截空', '副截', '截路', '空亡'];

export function laSaoTuanTriet(name: string): boolean {
  return TUAN.includes(name) || TRIET.includes(name);
}

function capCung(chart: ZiweiChart, ten: string[]): [number, number] | null {
  const b = chart.palaces.filter(p => p.stars.some(s => ten.includes(s.name))).map(p => p.branch).sort((x, y) => x - y);
  return b.length === 2 ? [b[0], b[1]] : null;
}

/** Tọa độ (% của lưới) của nhãn trên ranh giới chung giữa hai cung kề nhau. */
function viTriRanh(a: number, b: number): { x: number; y: number } {
  const p = O_LUOI[a], q = O_LUOI[b];
  if (p.hang === q.hang) return { x: Math.min(p.cot, q.cot) * 25, y: p.hang === 1 ? 25 : 75 };
  return { x: (p.cot - 0.5) * 25, y: Math.min(p.hang, q.hang) * 25 };
}

/** Nhãn Tuần, Triệt đặt trên ranh giới; cùng một cặp cung thì gộp "Tuần - Triệt". */
export function nhanTuanTriet(chart: ZiweiChart): { nhan: string; x: number; y: number }[] {
  const tuan = capCung(chart, TUAN), triet = capCung(chart, TRIET);
  if (tuan && triet && tuan[0] === triet[0] && tuan[1] === triet[1]) return [{ nhan: 'Tuần - Triệt', ...viTriRanh(...tuan) }];
  const out: { nhan: string; x: number; y: number }[] = [];
  if (tuan) out.push({ nhan: 'Tuần', ...viTriRanh(...tuan) });
  if (triet) out.push({ nhan: 'Triệt', ...viTriRanh(...triet) });
  return out;
}

/** Điểm trong của cung: trung điểm cạnh giáp Thiên bàn; 4 cung góc dùng góc trong. */
function diemTrong(branch: number): { x: number; y: number } {
  const { hang, cot } = O_LUOI[((branch % 12) + 12) % 12];
  const x = cot === 1 ? 25 : cot === 4 ? 75 : (cot - 0.5) * 25;
  const y = hang === 1 ? 25 : hang === 4 ? 75 : (hang - 0.5) * 25;
  return { x, y };
}

/** Ba đường từ cung Mệnh tới Quan Lộc (+4), Thiên Di (+6), Tài Bạch (+8). */
export function duongTamPhuong(mingBranch: number): { x1: number; y1: number; x2: number; y2: number }[] {
  const a = diemTrong(mingBranch);
  return [4, 6, 8].map(k => { const b = diemTrong(mingBranch + k); return { x1: a.x, y1: a.y, x2: b.x, y2: b.y }; });
}
