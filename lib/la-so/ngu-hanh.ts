import type { Star, StarBrightness } from '../ziwei/types';

export type NguHanh = 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho';
export type DoSang = 'M' | 'V' | 'Đ' | 'B' | 'H';

const DO_SANG: Record<StarBrightness, DoSang> = {
  '庙': 'M', '旺': 'V', '得': 'Đ', '利': 'Đ', '地': 'Đ', '平': 'B', '闲': 'B', '不': 'H', '陷': 'H',
};

/** Quy 8–9 mức độ sáng của engine về 5 mức kiểu lá số Việt. */
export function doSangViet(raw?: StarBrightness): DoSang | undefined {
  return raw ? DO_SANG[raw] : undefined;
}

const HANH_CHI: NguHanh[] = ['thuy', 'tho', 'moc', 'moc', 'tho', 'hoa', 'hoa', 'tho', 'kim', 'kim', 'tho', 'thuy'];

export function nguHanhChi(branch: number): NguHanh {
  return HANH_CHI[((branch % 12) + 12) % 12];
}

/**
 * Màu ngũ hành hiển thị của từng sao (khóa tiếng Trung của engine).
 * Ưu tiên màu trên lá số mẫu lyso.vn; sao không có trong mẫu theo ngũ hành truyền thống.
 * Tham Lang tô Mộc như lá số mẫu.
 */
const HANH_SAO: Record<string, NguHanh> = {
  // Chính tinh
  '紫微': 'tho', '天机': 'moc', '太阳': 'hoa', '武曲': 'kim', '天同': 'thuy', '廉贞': 'hoa', '天府': 'tho',
  '太阴': 'thuy', '贪狼': 'moc', '巨门': 'thuy', '天相': 'thuy', '天梁': 'tho', '七杀': 'kim', '破军': 'thuy',
  // Lục cát, lục sát, Lộc Mã
  '文昌': 'kim', '文曲': 'thuy', '左辅': 'tho', '右弼': 'thuy', '天魁': 'hoa', '天钺': 'hoa', '禄存': 'tho', '天马': 'hoa',
  '擎羊': 'kim', '陀罗': 'kim', '火星': 'hoa', '铃星': 'hoa', '地空': 'hoa', '地劫': 'hoa',
  // Tạp diệu
  '红鸾': 'thuy', '天喜': 'thuy', '龙池': 'thuy', '凤阁': 'moc', '华盖': 'kim', '咸池': 'moc', '天姚': 'thuy', '天刑': 'hoa',
  '天官': 'hoa', '天福': 'hoa', '天才': 'tho', '天寿': 'tho', '天贵': 'tho', '恩光': 'moc', '三台': 'thuy', '八座': 'moc',
  '台辅': 'kim', '封诰': 'tho', '天德': 'hoa', '月德': 'hoa', '解神': 'moc', '年解': 'moc', '天巫': 'tho', '天厨': 'tho',
  '天月': 'hoa', '阴煞': 'thuy', '孤辰': 'tho', '寡宿': 'tho', '天哭': 'thuy', '天虚': 'thuy', '天伤': 'tho', '天使': 'thuy',
  '破碎': 'hoa', '劫煞': 'hoa', '龙德': 'thuy', '大耗': 'hoa', '天空': 'thuy', '蜚廉': 'hoa',
};

export function nguHanhSao(name: string): NguHanh | undefined {
  return HANH_SAO[name];
}

/** Sao loại `minor` xếp vào cột hung (phải). Còn lại của loại minor xếp trái. */
export const SAO_HUNG = new Set(['天姚', '破碎', '劫煞']);

export function cotSao(star: Star): 'trai' | 'phai' {
  if (star.type === 'lucky') return 'trai';
  if (star.type === 'sha') return 'phai';
  return SAO_HUNG.has(star.name) ? 'phai' : 'trai';
}

/** Ngũ hành của sao vòng Bác sĩ và vòng Thái Tuế (theo màu lá số mẫu). Khóa: tên tiếng Việt. */
export const HANH_VONG: Record<string, NguHanh> = {
  'Bác Sĩ': 'thuy', 'Lực Sĩ': 'hoa', 'Thanh Long': 'thuy', 'Tiểu Hao': 'hoa', 'Tướng Quân': 'moc', 'Tấu Thư': 'kim',
  'Phi Liêm': 'hoa', 'Hỷ Thần': 'hoa', 'Bệnh Phù': 'tho', 'Đại Hao': 'hoa', 'Phục Binh': 'hoa', 'Quan Phủ': 'hoa',
  'Thái Tuế': 'hoa', 'Thiếu Dương': 'hoa', 'Tang Môn': 'moc', 'Thiếu Âm': 'thuy', 'Quan Phù': 'hoa', 'Tử Phù': 'hoa',
  'Tuế Phá': 'tho', 'Long Đức': 'thuy', 'Bạch Hổ': 'kim', 'Phúc Đức': 'tho', 'Điếu Khách': 'hoa', 'Trực Phù': 'hoa',
};
