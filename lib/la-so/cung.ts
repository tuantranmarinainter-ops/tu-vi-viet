import type { Star, ZiweiChart } from '../ziwei/types';
import { type NguHanh, doSangViet, nguHanhChi, nguHanhSao, cotSao, HANH_VONG } from './ngu-hanh';
import { tenCan, tenChi, tenSao, tenCung, tenVong } from './ten-viet';
import { tieuHanNam, thangHan, cungDaiHan, saoLuuNien } from './han';
import { O_LUOI, laSaoTuanTriet } from './luoi';

export interface DongSao { ten: string; hanh?: NguHanh; dam?: boolean }
export interface CungHienThi {
  branch: number; hang: number; cot: number;
  can: string; chi: string; hanhChi: NguHanh;
  ten: string; than: boolean; daiHan?: number;
  chinhTinh: DongSao[]; trai: DongSao[]; phai: DongSao[];
  namTieuHan: string; trangSinh: string; thang: number;
  dangChayDaiHan: boolean; laMenh: boolean;
}

/** Sức chứa thiết kế của một cột phụ tinh (đo trên 500 lá số: tối đa 11). CSS ô cung phải chứa đủ số dòng này. */
export const SO_DONG_TOI_DA = 12;

const TEN_HOA: Record<string, string> = { '禄': 'Lộc', '权': 'Quyền', '科': 'Khoa', '忌': 'Kỵ' };
const BOSHI_CAT = new Set(['Bác Sĩ', 'Thanh Long', 'Tướng Quân', 'Tấu Thư', 'Hỷ Thần']);
const SUIQIAN_CAT = new Set(['Long Đức', 'Phúc Đức']);
/**
 * Sao engine có nhưng lá số Việt không dùng ở dạng này, bỏ khỏi cột:
 * 龙德 (vòng Thái Tuế đã hiện Long Đức), 大耗 theo chi năm và 蜚廉 kiểu Trung Quốc
 * (trùng tên Đại Hao, Phi Liêm của vòng Bác sĩ — đối chiếu hai lá số lyso.vn).
 */
const SAO_TU_VONG = new Set(['龙德', '大耗', '蜚廉']);

/** Phụ tinh được ghi độ sáng, theo lá số mẫu lyso.vn. Chính tinh và tứ hóa luôn ghi. */
const GHI_DO_SANG = new Set(['禄存', '天马', '文昌', '文曲', '擎羊', '陀罗', '火星', '铃星', '地空', '地劫', '天刑', '天姚', '天哭', '天虚', '大耗']);
const kemDoSang = (ten: string, s: Star, luonGhi = false) => {
  const d = luonGhi || s.type === 'major' || GHI_DO_SANG.has(s.name) ? doSangViet(s.brightnessRaw) : undefined;
  return d ? `${ten} (${d})` : ten;
};
const goc = (ten: string) => ten.replace(/ \(.\)$/, '');

export function cungHienThi(chart: ZiweiChart, namXem: number): CungHienThi[] {
  const gioiTinh = chart.birthInfo.gender;
  const tieuHan = tieuHanNam(chart), thang = thangHan(chart, namXem), luu = saoLuuNien(chart, namXem);
  const daiHan = cungDaiHan(chart, namXem);

  return [...chart.palaces].sort((a, b) => a.branch - b.branch).map(p => {
    const hoaTrai: DongSao[] = [], hoaPhai: DongSao[] = [];
    const trai: DongSao[] = [], phai: DongSao[] = [];
    const chinhTinh: DongSao[] = [];
    const sao = p.stars.filter(s => !laSaoTuanTriet(s.name) && !SAO_TU_VONG.has(s.name));

    for (const s of sao) {
      if (s.siHua && TEN_HOA[s.siHua]) {
        const dong = { ten: kemDoSang(`Hóa ${TEN_HOA[s.siHua]}`, s, true), dam: true };
        if (s.siHua === '忌') hoaPhai.push(dong); else hoaTrai.push({ ...dong, hanh: 'moc' });
      }
      if (s.type === 'major') { chinhTinh.push({ ten: kemDoSang(tenSao(s.name).toUpperCase(), s), hanh: nguHanhSao(s.name), dam: true }); continue; }
      (cotSao(s) === 'trai' ? trai : phai).push({ ten: kemDoSang(tenSao(s.name), s), hanh: nguHanhSao(s.name) });
    }
    // Sao lucky trước minor ở cột trái; sha trước minor ở cột phải.
    const thuTu = (a: DongSao[], loai: Star['type']) => {
      const ten = new Set(sao.filter(s => s.type === loai).map(s => kemDoSang(tenSao(s.name), s)));
      return [...a.filter(d => ten.has(d.ten)), ...a.filter(d => !ten.has(d.ten))];
    };

    const daCo = new Set([...trai, ...phai].map(d => goc(d.ten)));
    const vong = (ten: string | undefined, loai: 'boShi' | 'suiQian') => {
      if (!ten) return;
      const vi = tenVong(ten, loai);
      if (daCo.has(vi)) return;
      daCo.add(vi);
      const cat = loai === 'boShi' ? BOSHI_CAT.has(vi) : SUIQIAN_CAT.has(vi);
      return { dong: { ten: vi, hanh: HANH_VONG[vi] } as DongSao, cat };
    };
    const vongTrai: DongSao[] = [], vongPhai: DongSao[] = [];
    for (const v of [vong(p.boShi, 'boShi'), vong(p.suiQian, 'suiQian')]) if (v) (v.cat ? vongTrai : vongPhai).push(v.dong);

    const luuTrai: DongSao[] = [], luuPhai: DongSao[] = [];
    for (const l of luu[p.branch] ?? []) {
      const hanh: NguHanh | undefined = l.ten.startsWith('L.Hóa') ? (l.cot === 'trai' ? 'moc' : undefined)
        : l.ten === 'L.Lộc Tồn' ? 'tho' : l.ten === 'L.Thiên Mã' ? 'hoa' : 'kim';
      (l.cot === 'trai' ? luuTrai : luuPhai).push({ ten: l.ten, hanh });
    }

    const { hang, cot } = O_LUOI[p.branch];
    return {
      branch: p.branch, hang, cot,
      can: tenCan(p.stem), chi: tenChi(p.branch), hanhChi: nguHanhChi(p.branch),
      ten: tenCung(p.name, gioiTinh), than: !!p.isShenGong && !p.isMingGong, daiHan: p.daXianAge?.[0],
      chinhTinh,
      trai: [...hoaTrai, ...thuTu(trai, 'lucky'), ...vongTrai, ...luuTrai],
      phai: [...hoaPhai, ...thuTu(phai, 'sha'), ...vongPhai, ...luuPhai],
      namTieuHan: tenChi(tieuHan[p.branch]),
      trangSinh: p.changSheng ? tenVong(p.changSheng, 'trangSinh') : '',
      thang: thang[p.branch],
      dangChayDaiHan: daiHan === p.branch,
      laMenh: !!p.isMingGong,
    };
  });
}
