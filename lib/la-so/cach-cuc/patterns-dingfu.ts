/**
 * Bản tiếng Việt của `lib/ziwei/patterns-dingfu.ts`.
 * Nguồn: Renhuai123/ziwei-doushu (bản 39c0abd, 21/11/2026), giấy phép MIT.
 * https://github.com/Renhuai123/ziwei-doushu/blob/39c0abd/lib/ziwei/patterns-dingfu.ts
 * Logic, điều kiện và khóa tiếng Trung giữ nguyên; chỉ dịch chuỗi hiển thị
 * (name, description, note, why, conditions, source, detail). Chú thích mã giữ nguyên bản gốc.
 */

/**
 * 《紫微斗数全书》卷一〈定富局〉六格 · 严格实现
 *
 * 底本：卷一〈定富局〉六条，各带注文。姊妹篇〈定贵局〉二十七格见
 *      `patterns-dinggui.ts`；判读纪律（照字面、不放宽、无解不写死代码）与彼处相同。
 *
 * 本表六条里两条安星无解（财荫夹印、荫印拱身），都是「梁相夹/拱」家族——
 * 天梁恒居天相后一宫（delta 恒 1），这对相邻星对永远无法分居一宫两侧，
 * 也无法同入一宫的三方四正（拱位集 {+4,+8} 与冲位 {+6} 之间最小差 2）。
 *
 * 另外两条可达格各被恒等式锁死成唯一形态：
 *  - 日月夹财：太阳恒在武曲后一宫（delta 恒 1，2,304 盘实测），
 *    故「日月夹武」唯一形态是太阴在前、太阳在后；
 *  - 财禄夹马：禄存永不在天马前一位（天马只在寅申巳亥，马前一位不在禄存
 *    十宫集内，结构性恒真），故「武禄夹马」唯一形态是禄在后、武在前。
 *
 * ⚠️ 盘对象陷阱：`ZiweiChart.palaces` 实际从寅宫（branch=2）起排，
 *    一律按 branch 查，禁止用下标。helper「夹」= 相邻 ±1，不是隔位 ±2。
 */

import type { ZiweiChart, Palace } from '../../ziwei/types';
import type { GeStatus, ProjectVerdict } from './patterns-dinggui';

// ────────────────── 盘面读取 ──────────────────

const palaceAt = (c: ZiweiChart, branch: number): Palace =>
  c.palaces.find(p => p.branch === ((branch % 12) + 12) % 12)!;

const has = (c: ZiweiChart, branch: number, name: string): boolean =>
  palaceAt(c, branch).stars.some(s => s.name === name);

const starBranch = (c: ZiweiChart, name: string): number =>
  c.palaces.find(p => p.stars.some(s => s.name === name))?.branch ?? -1;

const palaceBranch = (c: ZiweiChart, name: string): number =>
  c.palaces.find(p => p.name === name)?.branch ?? -1;

/** 相邻前一宫 / 后一宫。「夹」指的是这两宫，不是 ±2 隔位。 */
const prevBranch = (b: number) => (b + 11) % 12;
const nextBranch = (b: number) => (b + 1) % 12;

const majorCount = (c: ZiweiChart, b: number): number =>
  palaceAt(c, b).stars.filter(s => s.type === 'major').length;

// ────────────────── 类型 ──────────────────

export interface DingFuGe {
  /** 原书序号 1-6 */
  no: number;
  name: string;
  /** 原文注文（含「田宅宫亦然」一类扩展条件） */
  note: string;
  status: GeStatus;
  /** status 为 unreachable 时的几何理由；derivable 但形态唯一时注明 */
  why?: string;
  /** 原项目是否已有对应识别器（定富局六条项目全部没有） */
  inProject: ProjectVerdict;
  /** 判定函数；status 为 unreachable 时缺省 */
  fn?: (c: ZiweiChart) => boolean;
}

// ────────────────── 六格 ──────────────────

export const DING_FU_GE: DingFuGe[] = [
  {
    no: 1,
    name: 'Tài Ấm giáp Ấn',
    note: 'Thiên Tướng thủ Mệnh, Vũ Lương đến giáp là đúng; cung Điền Trạch cũng vậy',
    status: 'unreachable',
    inProject: 'none',
    why:
      'Chú văn yêu cầu Vũ Khúc, Thiên Lương chia ở hai bên Thiên Tướng. Thiên Lương luôn ở sau Thiên Tướng một cung (delta Tướng→Lương luôn là 1, ' +
      'kiểm thực 2.304 lá số không có ngoại lệ), nửa này có thể thỏa; nhưng khoảng cách cung giữa Vũ Khúc và Thiên Tướng chỉ nhận số chẵn ' +
      '(delta ∈ {0,2,4,6,8,10}, kiểm thực), Vũ Khúc không bao giờ ở cung liền kề Thiên Tướng — nửa “giáp” ' +
      'vô nghiệm. “Cung Điền Trạch cũng vậy” chỉ đổi cung Mệnh thành cung Điền Trạch, ràng buộc hình học không đổi, nên cũng vô nghiệm. ' +
      'Tài = Vũ Khúc (tài tinh), Ấm = Thiên Lương (ấm tinh), Ấn = Thiên Tướng.',
  },
  {
    no: 2,
    name: 'Nhật Nguyệt giáp Tài',
    note: 'Vũ Khúc thủ Mệnh, Nhật Nguyệt đến giáp là đúng; cung Tài Bạch cũng vậy',
    status: 'derivable',
    inProject: 'none',
    // 形态唯一：太阳→武曲 delta 恒 1（太阳恒在武曲后一宫），「前日后月」的
    // 读法永不可能；「前月后日」实测可达（2,304 盘中 32 例，1.39%）。
    fn: c => {
      const wu = starBranch(c, '武曲');
      if (wu < 0) return false;
      const jia = (palace: number): boolean =>
        has(c, prevBranch(palace), '太阴') && has(c, nextBranch(palace), '太阳');
      // 主形态：武曲守命；扩展形态：武曲守财帛宫
      const mingFu = c.mingGongBranch === wu && jia(wu);
      const caiFu = palaceBranch(c, '财帛') === wu && jia(wu);
      return mingFu || caiFu;
    },
    why:
      'Có thể đạt, nhưng hình thái duy nhất: Thái Dương luôn ở sau Vũ Khúc một cung (delta luôn là 1), “Nhật Nguyệt đến giáp” theo phép an sao ' +
      'chỉ có thể là “Thái Âm ở cung trước, Thái Dương ở cung sau”. “Cung Tài Bạch cũng vậy” là cách đọc mở rộng chú văn tự có, hiện thực luôn.',
  },
  {
    no: 3,
    name: 'Tài Lộc giáp Mã',
    note: 'Thiên Mã thủ Mệnh, Vũ Khúc và Lộc đến giáp là đúng; gặp đất sinh vượng càng đẹp',
    status: 'derivable',
    inProject: 'none',
    // 形态唯一：禄存永不在天马前一位（结构性恒真：天马只在寅申巳亥，
    // 马前一位与禄存十宫集无交集），故夹法只能是禄在后（b+1）、武曲在前（b-1）。
    fn: c => {
      const b = c.mingGongBranch;
      if (!has(c, b, '天马')) return false;
      return has(c, prevBranch(b), '武曲') && has(c, nextBranch(b), '禄存');
    },
    why:
      'Có thể đạt nhưng cực hiếm (12.900 lá số có 26 ca, 0,20%), và hình thái duy nhất: Lộc Tồn không bao giờ ở trước Thiên Mã một cung, ' +
      '“Vũ Lộc đến giáp” chỉ có thể là Lộc Tồn ở sau, Vũ Khúc ở trước. Câu “gặp sinh vượng càng đẹp” trong chú văn là điểm cộng, không phải điều kiện thành cách, không gộp vào phép xét chính.',
  },
  {
    no: 4,
    name: 'Ấm Ấn củng Thân',
    note: 'Thân ở Điền Trạch, Lương Tướng củng xung là đúng; chớ tọa Không Vong',
    status: 'unreachable',
    inProject: 'none',
    why:
      'Thiên Lương luôn ở sau Thiên Tướng một cung (cặp sao liền kề). Vị trí “củng” là cung Điền Trạch +4/+8, vị trí “xung” là +6, ' +
      'ba vị trí cách nhau từng đôi ít nhất 2 cung, hai sao liền kề không thể cùng lúc rơi vào — cách đọc “củng” (cùng vào tam phương), ' +
      'cách đọc “xung” (một củng một xung), và cả cách đọc rộng (cùng vào tam phương tứ chính) đều vô nghiệm theo phép an sao. ' +
      'Cùng họ “Lương Tướng giáp/củng” với Tài Ấn giáp Lộc của 〈Định quý cục〉 và Tài Ấm giáp Ấn của 〈Định phú cục〉, đều không thể đạt.',
  },
  {
    no: 5,
    name: 'Nhật Nguyệt chiếu bích',
    note: 'Nhật Nguyệt lâm cung Điền Trạch là đúng; thích ở mộ khố',
    status: 'derivable',
    inProject: 'none',
    // 日月同宫只在丑、未（墓库），注文「喜居墓库」由安星法自动满足。
    fn: c => {
      const tz = palaceBranch(c, '田宅');
      if (tz < 0) return false;
      return has(c, tz, '太阳') && has(c, tz, '太阴');
    },
    why:
      'Nhật Nguyệt đồng cung chỉ xuất hiện ở hai cung Sửu, Mùi, đúng là “mộ khố”; câu “thích ở mộ khố” trong chú văn hoàn toàn khớp với hằng đẳng thức an sao, ' +
      'không cần xét riêng.',
  },
  {
    no: 6,
    name: 'Kim xán quang huy',
    note: 'Thái Dương đơn thủ, Mệnh ở cung Ngọ là đúng',
    status: 'derivable',
    inProject: 'none',
    fn: c => c.mingGongBranch === 6 && has(c, 6, '太阳') && majorCount(c, 6) === 1,
  },
];

// ────────────────── 入口 ──────────────────

export interface DingFuHit {
  no: number;
  name: string;
  note: string;
  status: GeStatus;
}

/**
 * 判一张盘的〈定富局〉格。unreachable 条目跳过；返回顺序即原书序号。
 */
export function detectDingFu(chart: ZiweiChart): DingFuHit[] {
  const out: DingFuHit[] = [];
  for (const g of DING_FU_GE) {
    if (!g.fn) continue;
    if (g.fn(chart)) {
      out.push({ no: g.no, name: g.name, note: g.note, status: g.status });
    }
  }
  return out;
}

/** 可判定的条目数（不含 unreachable） */
export const DING_FU_JUDGEABLE = DING_FU_GE.filter(g => !!g.fn).length;

/** 安星无解的条目 */
export const DING_FU_UNREACHABLE = DING_FU_GE.filter(g => g.status === 'unreachable');
