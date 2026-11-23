import { viLabel } from '../i18n/vi';

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
export const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

export function tenCan(stem: number): string { return CAN[((stem % 10) + 10) % 10]; }
export function tenChi(branch: number): string { return CHI[((branch % 12) + 12) % 12]; }

/** "Đinh Tị" */
export function canChi(stem: number, branch: number): string {
  return `${tenCan(stem)} ${tenChi(branch)}`;
}

/** Tên lá số Việt khác bản dịch chung trong vi.ts. */
const TEN_SAO_RIENG: Record<string, string> = {
  '台辅': 'Thai Phụ', '咸池': 'Đào Hoa', '天喜': 'Thiên Hỷ', '大耗': 'Đại Hao',
};

export function tenSao(name: string): string {
  return TEN_SAO_RIENG[name] ?? viLabel(name);
}

const TEN_CUNG: Record<string, string> = {
  '命宫': 'MỆNH', '命': 'MỆNH', '兄弟': 'HUYNH ĐỆ', '子女': 'TỬ TỨC', '财帛': 'TÀI BẠCH', '疾厄': 'TẬT ÁCH',
  '迁移': 'THIÊN DI', '仆役': 'NÔ BỘC', '交友': 'NÔ BỘC', '官禄': 'QUAN LỘC', '田宅': 'ĐIỀN TRẠCH',
  '福德': 'PHÚC ĐỨC', '父母': 'PHỤ MẪU',
};

/** Tên cung viết hoa; cung Phu Thê theo giới tính (nữ: PHU QUÂN, nam: THÊ THIẾP). */
export function tenCung(name: string, gender: 'male' | 'female'): string {
  const goc = name.replace(/宫$/, '') || name;
  if (goc === '夫妻') return gender === 'female' ? 'PHU QUÂN' : 'THÊ THIẾP';
  return TEN_CUNG[name] ?? TEN_CUNG[goc] ?? viLabel(name).toUpperCase();
}

export type Vong = 'trangSinh' | 'boShi' | 'suiQian';

const VONG: Record<Vong, Record<string, string>> = {
  trangSinh: { '长生': 'Trường Sinh', '沐浴': 'Mộc Dục', '冠带': 'Quan Đới', '临官': 'Lâm Quan', '帝旺': 'Đế Vượng', '衰': 'Suy',
    '病': 'Bệnh', '死': 'Tử', '墓': 'Mộ', '绝': 'Tuyệt', '胎': 'Thai', '养': 'Dưỡng' },
  boShi: { '博士': 'Bác Sĩ', '力士': 'Lực Sĩ', '青龙': 'Thanh Long', '小耗': 'Tiểu Hao', '将军': 'Tướng Quân', '奏书': 'Tấu Thư',
    '飞廉': 'Phi Liêm', '喜神': 'Hỷ Thần', '病符': 'Bệnh Phù', '大耗': 'Đại Hao', '伏兵': 'Phục Binh', '官府': 'Quan Phủ' },
  suiQian: { '岁建': 'Thái Tuế', '晦气': 'Thiếu Dương', '丧门': 'Tang Môn', '贯索': 'Thiếu Âm', '官符': 'Quan Phù', '小耗': 'Tử Phù',
    '大耗': 'Tuế Phá', '岁破': 'Tuế Phá', '龙德': 'Long Đức', '白虎': 'Bạch Hổ', '天德': 'Phúc Đức', '吊客': 'Điếu Khách', '病符': 'Trực Phù' },
};

export function tenVong(name: string, vong: Vong): string {
  return VONG[vong][name] ?? viLabel(name);
}
