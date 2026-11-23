import type { ZiweiChart } from '../ziwei/types';
import { tenCan, tenChi, canChi, tenSao, tenCung } from './ten-viet';
import { tuoiMu, cungDaiHan } from './han';

export interface TuyChonHienThi { namXem: number; anHoTen?: boolean; anNgaySinh?: boolean }

export interface ThienBan {
  hoTen: string;
  dong: { nhan: string; duong?: string; am?: string; canChi: string }[];
  namXem: string; namXemCanChi: string; tuoi: string;
  amDuong: string; thuanNghich: string;
  menh: string; cuc: string; quanHe: string; thanCu: string;
  menhChu: string; thanChu: string; daiHan: string;
}

const NAP_AM = [
  'Hải Trung Kim', 'Lư Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim', 'Sơn Đầu Hỏa',
  'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc', 'Tuyền Trung Thủy', 'Ốc Thượng Thổ',
  'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy', 'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc',
  'Bích Thượng Thổ', 'Kim Bạch Kim', 'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Trạch Thổ', 'Thoa Xuyến Kim',
  'Tang Đố Mộc', 'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy',
];

/** Chỉ số lục thập hoa giáp (0 = Giáp Tý). */
const giapTy = (stem: number, branch: number) => (((6 * stem - 5 * branch) % 60) + 60) % 60;

export function napAm(stem: number, branch: number): string {
  return NAP_AM[Math.floor(giapTy(stem, branch) / 2)];
}

/** Can chi ngày theo ngày dương lịch (số ngày Julian). */
export function canChiNgay(y: number, m: number, d: number): string {
  const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
  const jd = d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
  const i = (jd + 49) % 60;
  return canChi(i % 10, i % 12);
}

type Hanh = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
const SINH: Record<Hanh, Hanh> = { 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim', 'Kim': 'Thủy', 'Thủy': 'Mộc' };
const KHAC: Record<Hanh, Hanh> = { 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim', 'Kim': 'Mộc' };
const CUC: Record<string, [string, Hanh]> = {
  '水二局': ['Thủy Nhị Cục', 'Thủy'], '木三局': ['Mộc Tam Cục', 'Mộc'], '金四局': ['Kim Tứ Cục', 'Kim'],
  '土五局': ['Thổ Ngũ Cục', 'Thổ'], '火六局': ['Hỏa Lục Cục', 'Hỏa'],
};
const AM_DUONG: Record<string, string> = { '阳男': 'Dương Nam', '阴男': 'Âm Nam', '阳女': 'Dương Nữ', '阴女': 'Âm Nữ' };

const hoaDau = (s: string) => s.toLowerCase().replace(/(^|\s)(\p{L})/gu, (_, a, b) => a + b.toUpperCase());

function quanHe(cuc: Hanh, menh: Hanh): string {
  if (cuc === menh) return 'Cục Mệnh bình hòa';
  if (SINH[cuc] === menh) return 'Cục sinh Mệnh';
  if (SINH[menh] === cuc) return 'Mệnh sinh Cục';
  if (KHAC[cuc] === menh) return 'Cục khắc Mệnh';
  return 'Mệnh khắc Cục';
}

export function thienBan(chart: ZiweiChart, tuyChon: TuyChonHienThi): ThienBan {
  const { birthInfo: bi, lunarInfo: li } = chart;
  const an = !!tuyChon.anNgaySinh;
  const goc = bi.origInput;
  const thangAm = Math.abs(li.lunarMonth);
  const canThang = ((li.yearStem % 5) * 2 + 2 + thangAm - 1) % 10;
  const ngay = canChiNgay(bi.year, bi.month, bi.day);
  const canNgay = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'].indexOf(ngay.split(' ')[0]);
  const canGio = ((canNgay % 5) * 2 + bi.hour) % 10;
  const gio = goc ? `${String(goc.clockHour).padStart(2, '0')}:${String(goc.clockMinute).padStart(2, '0')}` : undefined;
  const dong = [
    { nhan: 'Năm', duong: an ? undefined : String(goc?.year ?? bi.year), am: undefined, canChi: canChi(li.yearStem, li.yearBranch) },
    { nhan: 'Tháng', duong: an ? undefined : String(goc?.month ?? bi.month), am: an ? undefined : `${thangAm}${li.isLeapMonth || li.lunarMonth < 0 ? ' (nhuận)' : ''}`, canChi: canChi(canThang, (thangAm + 1) % 12) },
    { nhan: 'Ngày', duong: an ? undefined : String(goc?.day ?? bi.day), am: an ? undefined : String(li.lunarDay), canChi: an ? '(ẩn)' : ngay },
    { nhan: 'Giờ', duong: an ? undefined : gio, am: undefined, canChi: an ? '(ẩn)' : canChi(canGio, bi.hour) },
  ];
  const [cucTen, cucHanh] = CUC[chart.wuxingJuName] ?? [chart.wuxingJuName, 'Thổ' as Hanh];
  const menh = napAm(li.yearStem, li.yearBranch);
  const menhHanh = menh.split(' ').pop() as Hanh;
  const than = chart.palaces.find(p => p.isShenGong);
  const daiHanCung = cungDaiHan(chart, tuyChon.namXem);
  const dh = chart.palaces.find(p => p.branch === daiHanCung);
  const xemStem = ((tuyChon.namXem - 4) % 10 + 10) % 10, xemBranch = ((tuyChon.namXem - 4) % 12 + 12) % 12;
  return {
    hoTen: tuyChon.anHoTen || !bi.name ? (tuyChon.anHoTen ? '(ẩn)' : '—') : bi.name,
    dong,
    namXem: String(tuyChon.namXem), namXemCanChi: `${tenCan(xemStem)} ${tenChi(xemBranch)}`,
    tuoi: `${tuoiMu(chart, tuyChon.namXem)} tuổi`,
    amDuong: AM_DUONG[chart.yinYangGender ?? ''] ?? '',
    thuanNghich: li.yearStem % 2 === chart.mingGongBranch % 2 ? 'Âm Dương thuận lý' : 'Âm Dương nghịch lý',
    menh, cuc: cucTen, quanHe: quanHe(cucHanh, menhHanh),
    thanCu: !than || than.isMingGong ? 'Thân Mệnh đồng cung' : `Thân cư ${hoaDau(tenCung(than.name, bi.gender))}`,
    menhChu: tenSao(chart.mingZhu ?? ''), thanChu: tenSao(chart.shenZhu ?? ''),
    daiHan: dh?.daXianAge ? `Đại hạn hiện tại: ${dh.daXianAge[0]}–${dh.daXianAge[1]} tuổi · cung ${hoaDau(tenCung(dh.name, bi.gender))}` : 'Chưa vào đại hạn',
  };
}
