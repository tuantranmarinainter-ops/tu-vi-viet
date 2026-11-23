/**
 * Bản tiếng Việt của `lib/ziwei/patterns.ts`.
 * Nguồn: Renhuai123/ziwei-doushu (bản 39c0abd, 21/11/2026), giấy phép MIT.
 * https://github.com/Renhuai123/ziwei-doushu/blob/39c0abd/lib/ziwei/patterns.ts
 * Logic, điều kiện và khóa tiếng Trung giữ nguyên; chỉ dịch chuỗi hiển thị
 * (name, description, note, why, conditions, source, detail). Chú thích mã giữ nguyên bản gốc.
 */

/**
 * 紫微斗数格局识别（v2 严格化版本）
 *
 * 设计原则：
 * 1. 古书条件优先：每个格局列出"必须 / 加分 / 破格"三层结构，出处可考
 * 2. 倪师立场：不使用宫干自化、大限四化、来因宫等飞星派工具
 * 3. 庙旺利陷：用 brightness 字段（bright=庙旺、normal=平、dim=陷）
 * 4. 三方四正会照：命宫 + 财帛 + 官禄 + 迁移
 * 5. 夹宫：命宫前后两宫
 *
 * 主要古籍出处：
 *  - 《紫微斗数全集》（陈抟祖师传，明代刊本）
 *  - 《紫微斗数全书》（罗洪先编，明代刊本）
 *  - 《骨髓赋》《女命骨髓赋》《十二宫诸星得地合格诀》
 *  - 倪师《天纪》紫微斗数讲义
 */

import type { ZiweiChart, Palace, Star, SiHua } from '../../ziwei/types';
import { tenSao } from '../ten-viet';
import { detectDingGui } from './patterns-dinggui';
import { detectDingFu } from './patterns-dingfu';
import { detectDingPin } from './patterns-dingpin';

// ────────────────── 类型 ──────────────────
export interface PatternCondition {
  required: string[];   // 必须满足条件（已通过的）
  bonus?: string[];     // 加分项（已触发）
  breaking?: string[];  // 破格警示（已触发）
}

export interface Pattern {
  name: string;
  level: 'excellent' | 'good' | 'neutral' | 'caution';
  description: string;
  palaces: string[];                 // 涉及宫位
  conditions?: PatternCondition;     // 成立条件分层（v2 新增）
  source?: string;                   // 古籍出处（v2 新增）
}

// ────────────────── 常量 ──────────────────
const SHA_NAMES = ['擎羊', '陀罗', '火星', '铃星', '地空', '地劫'];
const SHA_HARD = ['擎羊', '陀罗', '火星', '铃星'];   // 四煞
const SHA_KONG = ['地空', '地劫'];                  // 空劫
const ZUO_YOU = ['左辅', '右弼'];
const CHANG_QU = ['文昌', '文曲'];
const KUI_YUE = ['天魁', '天钺'];

// ────────────────── 辅助函数 ──────────────────
function getMajorStarNames(palace: Palace): string[] {
  return palace.stars.filter(s => s.type === 'major').map(s => s.name);
}
function findStar(palace: Palace, name: string): Star | undefined {
  return palace.stars.find(s => s.name === name);
}
function hasStar(palace: Palace, name: string): boolean {
  return palace.stars.some(s => s.name === name);
}
function findStarPalace(chart: ZiweiChart, name: string): Palace | undefined {
  return chart.palaces.find(p => p.stars.some(s => s.name === name));
}
function getPalaceByBranch(chart: ZiweiChart, branch: number): Palace | undefined {
  return chart.palaces.find(p => p.branch === ((branch % 12) + 12) % 12);
}
function shaCountInPalace(palace: Palace, list: string[] = SHA_HARD): number {
  return palace.stars.filter(s => list.includes(s.name)).length;
}
function hasShaInPalace(palace: Palace, list: string[] = SHA_NAMES): boolean {
  return palace.stars.some(s => list.includes(s.name));
}
function getSanFangPalaces(chart: ZiweiChart): Palace[] {
  const m = chart.mingGongBranch;
  const branches = [m, (m + 4) % 12, (m + 8) % 12, (m + 6) % 12];
  return chart.palaces.filter(p => branches.includes(p.branch));
}
function isInSanFang(chart: ZiweiChart, branch: number): boolean {
  const m = chart.mingGongBranch;
  return [m, (m + 4) % 12, (m + 8) % 12, (m + 6) % 12].includes(branch);
}
function getDuiGong(chart: ZiweiChart, branch: number): Palace | undefined {
  return getPalaceByBranch(chart, (branch + 6) % 12);
}
function getJiaPalaces(chart: ZiweiChart, branch: number): { prev?: Palace; next?: Palace } {
  return {
    prev: getPalaceByBranch(chart, (branch + 11) % 12),
    next: getPalaceByBranch(chart, (branch + 1) % 12),
  };
}
function sanFangAllStars(chart: ZiweiChart): Set<string> {
  return new Set(getSanFangPalaces(chart).flatMap(p => p.stars.map(s => s.name)));
}
function sanFangShaCount(chart: ZiweiChart, list: string[] = SHA_HARD): number {
  return getSanFangPalaces(chart).reduce((sum, p) => sum + shaCountInPalace(p, list), 0);
}
function isBright(palace: Palace, starName: string): boolean {
  const s = findStar(palace, starName);
  return s?.brightness === 'bright';
}
function isDim(palace: Palace, starName: string): boolean {
  const s = findStar(palace, starName);
  return s?.brightness === 'dim';
}
function getStarSiHua(palace: Palace, starName: string): Star['siHua'] | undefined {
  return findStar(palace, starName)?.siHua;
}
// 四化挂在星曜的 siHua 字段上，不是独立星名——不能用 hasStar / sanFangAllStars 查「化禄」
function palaceHasSiHua(palace: Palace, hua: SiHua): boolean {
  return palace.stars.some(s => s.siHua === hua);
}
function sanFangHasSiHua(chart: ZiweiChart, hua: SiHua): boolean {
  return getSanFangPalaces(chart).some(p => palaceHasSiHua(p, hua));
}
const BRANCH_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// ────────────────── 正格识别器 ──────────────────

/** 君臣庆会：紫微入命，左辅右弼同会（同宫或三方） */
function detectJunChenQingHui(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (!hasStar(ming, '紫微')) return;
  const sanFangSet = sanFangAllStars(chart);
  const hasZuo = sanFangSet.has('左辅');
  const hasYou = sanFangSet.has('右弼');
  if (!hasZuo || !hasYou) return;

  const required = ['Tử Vi nhập Mệnh', 'Tả Phụ, Hữu Bật cùng hội tam phương tứ chính'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangSet.has('文昌') || sanFangSet.has('文曲')) bonus.push('Hội thêm Văn Xương hoặc Văn Khúc');
  if (sanFangSet.has('天魁') || sanFangSet.has('天钺')) bonus.push('Khôi Việt quý nhân gia chiếu');
  if (getStarSiHua(ming, '紫微') === '权') bonus.push('Tử Vi Hóa Quyền');
  if (sanFangShaCount(chart, SHA_KONG) >= 2) breaking.push('Địa Không, Địa Kiếp giáp hoặc hội chiếu (Tử Vi kỵ Không Kiếp)');

  patterns.push({
    name: 'Quân thần khánh hội',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Tử Vi nhập Mệnh, Tả Phụ Hữu Bật cùng hội: bậc đế vương được hiền thần phò tá, chủ đại phú đại quý, mệnh thống lĩnh. Cả đời quý nhân không dứt, hợp đi đường địa vị cao trong chính trường, thương trường, hoặc làm người dẫn dắt nhiều lĩnh vực.',
    palaces: ['命宫'],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư · cách Quân thần khánh hội》',
  });
}

/** 紫府同宫：紫微+天府于命宫（限寅、申宫） */
function detectZiFu(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const ziwei = findStarPalace(chart, '紫微');
  const tianfu = findStarPalace(chart, '天府');
  if (!ziwei || !tianfu || ziwei.branch !== tianfu.branch) return;

  const inMing = ziwei.branch === chart.mingGongBranch;
  const required = inMing
    ? ['Tử Vi, Thiên Phủ cùng nhập cung Mệnh']
    : ['Tử Vi, Thiên Phủ đồng cung (không ở cung Mệnh, hội chiếu nên giảm lực)'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  const sanFangSet = sanFangAllStars(chart);
  if (sanFangSet.has('左辅') && sanFangSet.has('右弼')) bonus.push('Tả Phụ, Hữu Bật cùng hội');
  if (sanFangSet.has('文昌') || sanFangSet.has('文曲')) bonus.push('Hội thêm Xương Khúc');
  if (hasShaInPalace(ziwei, SHA_KONG)) breaking.push('Cung Tử Phủ tọa Không Kiếp (phá quý khí của Tử Phủ)');
  if (shaCountInPalace(ziwei, SHA_HARD) >= 2) breaking.push('Cung Tử Phủ có hai sát tinh cùng tọa');

  patterns.push({
    name: 'Tử Phủ đồng cung',
    level: inMing && !breaking.length ? 'excellent' : 'good',
    description: inMing
      ? 'Tử Vi, Thiên Phủ cùng nhập cung Mệnh, đế tinh và tướng tinh cùng lâm, mệnh tôn quý. Chủ phẩm hạnh đoan chính, cơm áo không lo, có tài lãnh đạo, hợp giữ chức vụ quan trọng. Cần có Tả Phụ, Hữu Bật phối hợp mới thành đại cách trọn vẹn.'
      : 'Tử Vi, Thiên Phủ đồng cung nhưng không tọa Mệnh: chủ cả đời có quý nhân, quý khí để nương tựa, nhưng bản thân chưa chắc đại phú quý, phải xem cát sát hội chiếu mà định.',
    palaces: [ziwei.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư · cách Tử Phủ đồng cung》',
  });
}

/** 府相朝垣：天府、天相分别坐守命宫的三方四正 */
function detectFuXiangChaoYuan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const tianfu = findStarPalace(chart, '天府');
  const tianxiang = findStarPalace(chart, '天相');
  if (!tianfu || !tianxiang) return;
  if (!isInSanFang(chart, tianfu.branch) || !isInSanFang(chart, tianxiang.branch)) return;
  if (tianfu.branch === chart.mingGongBranch && tianxiang.branch === chart.mingGongBranch) return;
  if (tianfu.branch === tianxiang.branch) return;

  const required = ['Thiên Phủ ở tam phương của Mệnh', 'Thiên Tướng ở tam phương của Mệnh', 'Hai sao không đồng cung'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (hasStar(ming, '禄存') || palaceHasSiHua(ming, '禄')) bonus.push('Cung Mệnh gặp Lộc');
  if (sanFangAllStars(chart).has('左辅')) bonus.push('Hội thêm Tả Phụ');
  if (hasShaInPalace(ming, SHA_HARD)) breaking.push('Cung Mệnh tọa sát tinh');
  if (sanFangShaCount(chart, SHA_HARD) >= 3) breaking.push('Tam phương tứ chính quá nhiều sát tinh');

  patterns.push({
    name: 'Phủ Tướng triều viên',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thiên Phủ, Thiên Tướng chia nhau giữ tam phương tứ chính của Mệnh, văn võ kiêm toàn, quyền và ấn cùng sáng; chủ cả đời cơm áo đầy đủ, địa vị cao. Sách xưa nói “Phủ Tướng triều viên, thiên chung thực lộc” (Phủ Tướng chầu Mệnh, hưởng lộc ngàn chung), thường gặp ở người trong chính giới, quản lý doanh nghiệp.',
    palaces: [tianfu.name, tianxiang.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư · cách Phủ Tướng triều viên》',
  });
}

/** 阳梁昌禄：太阳+天梁+文昌+禄存四星会命宫，大贵格 */
function detectYangLiangChangLu(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('太阳') || !sanFangSet.has('天梁') ||
      !sanFangSet.has('文昌') || !sanFangSet.has('禄存')) return;

  const sun = findStarPalace(chart, '太阳')!;
  const liang = findStarPalace(chart, '天梁')!;
  const required = [
    'Thái Dương hội tam phương của Mệnh',
    'Thiên Lương hội tam phương của Mệnh',
    'Văn Xương hội tam phương của Mệnh',
    'Lộc Tồn hội tam phương của Mệnh',
  ];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (isBright(sun, '太阳')) bonus.push('Thái Dương miếu vượng');
  if (isBright(liang, '天梁')) bonus.push('Thiên Lương miếu vượng');
  if (sanFangHasSiHua(chart, '科')) bonus.push('Hội thêm Hóa Khoa');
  if (isDim(sun, '太阳')) breaking.push('Thái Dương lạc hãm (Dương Lương mất ánh sáng)');
  if (sanFangShaCount(chart, SHA_HARD) >= 2) breaking.push('Tam phương sát nặng');

  patterns.push({
    name: 'Dương Lương Xương Lộc',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thái Dương, Thiên Lương, Văn Xương, Lộc Tồn bốn sao cùng hội tam phương của Mệnh, được gọi là “sao khoa cử”; chủ thanh quý hiển đạt, vận thi cử rất tốt, hợp đi đường học thuật, giáo dục, nghiên cứu, chứng chỉ chuyên môn, công danh cả đời dễ thành.',
    palaces: [sun.name, liang.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư · cách Dương Lương Xương Lộc》',
  });
}

/** 火贪格 / 铃贪格：贪狼+火星 或 贪狼+铃星 同宫或会照 */
function detectHuoTanLingTan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const tan = findStarPalace(chart, '贪狼');
  if (!tan) return;
  const huo = findStarPalace(chart, '火星');
  const ling = findStarPalace(chart, '铃星');

  for (const [shaName, shaPalace] of [['火星', huo], ['铃星', ling]] as const) {
    if (!shaPalace) continue;
    const sameOrTrine =
      tan.branch === shaPalace.branch ||
      (tan.branch + 4) % 12 === shaPalace.branch ||
      (tan.branch + 8) % 12 === shaPalace.branch ||
      (tan.branch + 6) % 12 === shaPalace.branch;
    if (!sameOrTrine) continue;
    if (!isInSanFang(chart, tan.branch)) continue;

    const required = [`Tham Lang ${tan.branch === shaPalace.branch ? 'đồng cung' : 'hội chiếu'} ${tenSao(shaName)}`, 'Tham Lang hội chiếu tam phương của Mệnh'];
    const bonus: string[] = [];
    const breaking: string[] = [];
    if (isBright(tan, '贪狼')) bonus.push('Tham Lang miếu vượng');
    if (getStarSiHua(tan, '贪狼') === '禄' || getStarSiHua(tan, '贪狼') === '权') bonus.push('Tham Lang Hóa Lộc/Hóa Quyền');
    if (hasShaInPalace(tan, ['擎羊', '陀罗'])) breaking.push('Cung Tham Lang lại gặp Kình Đà (phá lực hoạnh phát)');
    if (hasShaInPalace(tan, SHA_KONG)) breaking.push('Tham Lang gặp Không Kiếp (tiền đến rồi đi)');

    patterns.push({
      name: shaName === '火星' ? 'Hỏa Tham cách' : 'Linh Tham cách',
      level: breaking.length ? 'good' : 'excellent',
      description: `Tham Lang gặp ${tenSao(shaName)} ${tan.branch === shaPalace.branch ? 'đồng cung' : 'hội chiếu từ tam phương'}, chủ hoạnh tài bất ngờ, cơ hội đến đột ngột. Sách xưa nói “Tham Lang ngộ Hỏa Linh, tất phát hoạnh tài” (Tham Lang gặp Hỏa Linh ắt phát của bất ngờ), nhưng đến nhanh đi cũng nhanh, nên biết dừng khi được. ${breaking.length ? 'Lá số này đã kích hoạt điều kiện phá cách, lực phát bị giảm.' : ''}`,
      palaces: [tan.name, shaPalace.name],
      conditions: { required, bonus, breaking },
      source: '《Tử Vi Đẩu Số cốt tủy phú》',
    });
  }
}

/** 武贪格：武曲+贪狼 同宫（丑、未） 或 对照 */
function detectWuTan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const wu = findStarPalace(chart, '武曲');
  const tan = findStarPalace(chart, '贪狼');
  if (!wu || !tan) return;
  const sameOrOppose = wu.branch === tan.branch || (wu.branch + 6) % 12 === tan.branch;
  if (!sameOrOppose) return;
  if (!isInSanFang(chart, wu.branch) && !isInSanFang(chart, tan.branch)) return;

  const required = [
    wu.branch === tan.branch ? 'Vũ Khúc, Tham Lang đồng cung (Sửu/Mùi)' : 'Vũ Khúc, Tham Lang ở hai cung đối nhau củng chiếu',
    'Hội chiếu tam phương của Mệnh',
  ];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('火星') || sanFangAllStars(chart).has('铃星'))
    bonus.push('Gặp thêm Hỏa Tinh/Linh Tinh (Hỏa Tham/Linh Tham chồng lên)');
  if (getStarSiHua(wu, '武曲') === '禄') bonus.push('Vũ Khúc Hóa Lộc');
  if (hasShaInPalace(wu, ['擎羊', '陀罗'])) breaking.push('Cung Vũ Tham gặp Kình Đà');
  if (hasShaInPalace(wu, SHA_KONG)) breaking.push('Cung Vũ Tham gặp Không Kiếp');

  patterns.push({
    name: 'Vũ Tham cách',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Vũ Khúc, Tham Lang hội Mệnh: tài tinh và sao dục vọng đào hoa cùng chiếu sáng. Sách xưa nói “Vũ Tham bất phát thiếu niên nhân” (Vũ Tham không phát lúc tuổi trẻ) — sau ba mươi tuổi mới tích lũy dày mà phát. Chủ sau trung niên đại phú đại quý, nguồn tiền đến từ quan hệ, giao tế và việc quản lý ham muốn; hợp tài chính, đầu cơ, bán hàng, giải trí.',
    palaces: [wu.name, tan.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số cốt tủy phú》',
  });
}

/** 杀破狼：七杀、破军、贪狼三方齐聚 */
function detectShaPoLang(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  const has = ['七杀', '破军', '贪狼'].filter(s => sanFangSet.has(s));
  if (has.length < 3) return;

  const required = ['Thất Sát, Phá Quân, Tham Lang ba sao cùng vào tam phương tứ chính của Mệnh'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangHasSiHua(chart, '禄') || sanFangHasSiHua(chart, '权')) bonus.push('Tam phương có Hóa Lộc hoặc Hóa Quyền (động mà có lực)');
  if (sanFangSet.has('左辅') && sanFangSet.has('右弼')) bonus.push('Phụ Bật cùng hội (trong biến động được quý nhân)');
  if (sanFangShaCount(chart, SHA_HARD) >= 3) breaking.push('Sát tinh quá nặng (động mà không thành)');
  if (hasShaInPalace(ming, SHA_KONG)) breaking.push('Mệnh tọa Không Kiếp (động mà vất vả)');

  patterns.push({
    name: 'Sát Phá Tham',
    level: breaking.length ? 'caution' : 'good',
    description: 'Thất Sát, Phá Quân, Tham Lang ba sao hội Mệnh, mệnh cách khai sáng, xông pha. Cả đời nhiều biến động, không cam bình thường; hợp lập nghiệp, quân đội cảnh sát, kinh doanh, bán hàng. Sau trung niên mới ổn định giữ thành quả, lúc trẻ dễ thất bại vì bốc đồng.',
    palaces: getSanFangPalaces(chart).filter(p => has.includes(getMajorStarNames(p)[0])).map(p => p.name),
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư · Sát Phá Tham》',
  });
}

/** 机月同梁：天机、太阴、天同、天梁四星齐入命迁财官 */
function detectJiYueTongLiang(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  const has = ['天机', '太阴', '天同', '天梁'].filter(s => sanFangSet.has(s));
  if (has.length < 4) return;

  const required = ['Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương bốn sao cùng vào tam phương tứ chính của Mệnh'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangSet.has('文昌') || sanFangSet.has('文曲')) bonus.push('Hội thêm Xương Khúc');
  if (sanFangHasSiHua(chart, '科')) bonus.push('Hội thêm Hóa Khoa');
  if (sanFangShaCount(chart, SHA_HARD) >= 3) breaking.push('Quá nhiều sát tinh (Cơ Nguyệt Đồng Lương kỵ sát)');
  if (hasShaInPalace(ming, SHA_HARD)) breaking.push('Cung Mệnh tọa sát');

  patterns.push({
    name: 'Cơ Nguyệt Đồng Lương',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương bốn sao cùng vào Mệnh, Thiên Di, Tài, Quan: nho nhã lịch thiệp, thông minh giỏi mưu tính. Hợp nhất với công chức, học thuật, văn nghệ, y tế, dịch vụ và những nghề cần tích lũy ổn định; không nên mạo hiểm hay đầu cơ lớn.',
    palaces: getSanFangPalaces(chart).filter(p => has.some(s => getMajorStarNames(p).includes(s))).map(p => p.name),
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư · cách Cơ Nguyệt Đồng Lương》',
  });
}

/** 廉贞天相：同宫 */
function detectLianXiang(chart: ZiweiChart, patterns: Pattern[]) {
  const lian = findStarPalace(chart, '廉贞');
  const xiang = findStarPalace(chart, '天相');
  if (!lian || !xiang || lian.branch !== xiang.branch) return;

  const inMing = lian.branch === chart.mingGongBranch;
  const required = ['Liêm Trinh, Thiên Tướng đồng cung'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (hasStar(lian, '禄存') || getStarSiHua(lian, '廉贞') === '禄') bonus.push('Gặp Lộc Tồn hoặc Liêm Trinh Hóa Lộc');
  if (sanFangAllStars(chart).has('左辅')) bonus.push('Tả Phụ hội chiếu');
  if (hasShaInPalace(lian, ['擎羊'])) breaking.push('Cung Liêm Tướng tọa Kình Dương (khuynh hướng Liêm Sát Dương)');
  if (getStarSiHua(lian, '廉贞') === '忌') breaking.push('Liêm Trinh Hóa Kỵ');

  patterns.push({
    name: 'Liêm Trinh Thiên Tướng cách',
    level: breaking.length ? 'caution' : (inMing ? 'good' : 'neutral'),
    description: 'Liêm Trinh, Thiên Tướng đồng cung, cách cục ấn thụ: chủ xử sự công minh, có tiếng thanh liêm, hợp làm công chức, quản lý hành chính, pháp vụ, hoạch định. Sợ gặp Kình Dương, Hóa Kỵ, khi đó ngược lại chủ kiện tụng, vướng việc quan.',
    palaces: [lian.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

/** 武曲七杀：同宫，将星配财星 */
function detectWuQiSha(chart: ZiweiChart, patterns: Pattern[]) {
  const wu = findStarPalace(chart, '武曲');
  const qi = findStarPalace(chart, '七杀');
  if (!wu || !qi || wu.branch !== qi.branch) return;

  const inMing = wu.branch === chart.mingGongBranch;
  const required = ['Vũ Khúc, Thất Sát đồng cung'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (getStarSiHua(wu, '武曲') === '权') bonus.push('Vũ Khúc Hóa Quyền');
  if (getStarSiHua(wu, '武曲') === '禄') bonus.push('Vũ Khúc Hóa Lộc');
  if (getStarSiHua(wu, '武曲') === '忌') breaking.push('Vũ Khúc Hóa Kỵ (Vũ Khúc Hóa Kỵ là điềm tiền bị cướp mất)');
  if (hasShaInPalace(wu, ['擎羊', '陀罗', '火星', '铃星'])) breaking.push('Cung Vũ Sát có quá nhiều sát tinh');

  patterns.push({
    name: 'Vũ Khúc Thất Sát',
    level: breaking.length ? 'caution' : (inMing ? 'excellent' : 'good'),
    description: 'Vũ Khúc, Thất Sát đồng cung, tướng tinh đi cùng tài tinh: chủ quyết đoán cương nghị, giỏi quản lý tiền bạc, hợp tài chính, quân đội cảnh sát, lập nghiệp. Nhưng kỵ gặp Hóa Kỵ và sát tinh, nếu không thì hung hiểm. Cả đời phấn đấu, tích được của nhưng nhiều lo nghĩ.',
    palaces: [wu.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

/** 天同天梁：同宫 */
function detectTongLiang(chart: ZiweiChart, patterns: Pattern[]) {
  const tong = findStarPalace(chart, '天同');
  const liang = findStarPalace(chart, '天梁');
  if (!tong || !liang || tong.branch !== liang.branch) return;

  const required = ['Thiên Đồng, Thiên Lương đồng cung'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('文昌')) bonus.push('Văn Xương hội chiếu');
  if (getStarSiHua(tong, '天同') === '禄') bonus.push('Thiên Đồng Hóa Lộc');
  if (hasShaInPalace(tong, SHA_HARD)) breaking.push('Sát tinh cùng tọa');

  patterns.push({
    name: 'Thiên Đồng Thiên Lương cách',
    level: breaking.length ? 'neutral' : 'good',
    description: 'Thiên Đồng, Thiên Lương đồng cung, phúc tinh và ấm tinh cùng hội: chủ rộng lượng hiền hòa, thích giúp người, hợp y tế, giáo dục, tôn giáo, công ích xã hội. Nhưng thiên về ôn hòa bảo thủ, khó thành cục đại phú đại quý.',
    palaces: [tong.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

/** 日月同宫：太阳太阴丑或未宫同宫 */
function detectRiYueTongGong(chart: ZiweiChart, patterns: Pattern[]) {
  const sun = findStarPalace(chart, '太阳');
  const moon = findStarPalace(chart, '太阴');
  if (!sun || !moon || sun.branch !== moon.branch) return;
  if (sun.branch !== 1 && sun.branch !== 7) return;  // 必须丑(1) 或 未(7)

  const inMing = sun.branch === chart.mingGongBranch;
  const required = [`Thái Dương, Thái Âm cùng nhập cung ${BRANCH_NAMES[sun.branch]}`];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sun.branch === 7) bonus.push('Nhật Nguyệt cùng sáng ở cung Mùi (sách xưa nói Nhật Nguyệt ở Mùi cả hai đều đẹp)');
  if (sanFangAllStars(chart).has('文昌') && sanFangAllStars(chart).has('文曲')) bonus.push('Xương Khúc hội chiếu');
  if (hasShaInPalace(sun, SHA_HARD)) breaking.push('Cung Nhật Nguyệt có sát tinh cùng tọa');

  patterns.push({
    name: 'Nhật Nguyệt đồng cung',
    level: breaking.length ? 'good' : (inMing ? 'excellent' : 'good'),
    description: `Thái Dương, Thái Âm đồng cung tại ${BRANCH_NAMES[sun.branch]}, âm dương cân bằng, văn võ kiêm toàn. Chủ duyên với người khác giới tốt, sự nghiệp thuận lợi, danh tiếng vang xa. ${sun.branch === 7 ? 'Nhật Nguyệt ở cung Mùi cả hai đều đẹp, càng tốt.' : 'Nhật Nguyệt đồng cung ở Sửu thì lực bình hơn.'}`,
    palaces: [sun.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

/** 日月夹命：太阳太阴在命宫前后两宫 */
function detectRiYueJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const prevHasSun = hasStar(prev, '太阳');
  const prevHasMoon = hasStar(prev, '太阴');
  const nextHasSun = hasStar(next, '太阳');
  const nextHasMoon = hasStar(next, '太阴');
  const ok = (prevHasSun && nextHasMoon) || (prevHasMoon && nextHasSun);
  if (!ok) return;

  const sunPalace = prevHasSun ? prev : next;
  const moonPalace = prevHasMoon ? prev : next;
  const required = ['Thái Dương, Thái Âm chia ở hai cung trước sau cung Mệnh'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (isBright(sunPalace, '太阳')) bonus.push('Thái Dương miếu vượng');
  if (isBright(moonPalace, '太阴')) bonus.push('Thái Âm miếu vượng');
  if (isDim(sunPalace, '太阳') || isDim(moonPalace, '太阴')) breaking.push('Nhật Nguyệt lạc hãm (giáp Mệnh mà không sáng)');

  patterns.push({
    name: 'Nhật Nguyệt giáp Mệnh',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Thái Dương, Thái Âm chia ở hai bên cung Mệnh giáp chiếu: quang minh lỗi lạc, cả đời có quý nhân giúp đỡ, sự nghiệp phát triển. Nam chủ quan quý, nữ chủ vượng phu, hưng gia. Nhật Nguyệt phải không lạc hãm mới là giáp thật.',
    palaces: [sunPalace.name, moonPalace.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư · Nhật Nguyệt giáp Mệnh》',
  });
}

/** 巨日同宫：巨门太阳同入寅或申 */
function detectJuRiTongGong(chart: ZiweiChart, patterns: Pattern[]) {
  const ju = findStarPalace(chart, '巨门');
  const sun = findStarPalace(chart, '太阳');
  if (!ju || !sun || ju.branch !== sun.branch) return;
  if (ju.branch !== 2 && ju.branch !== 8) return;  // 必须寅(2) 或 申(8)

  const inMing = ju.branch === chart.mingGongBranch;
  const required = [`Cự Môn, Thái Dương cùng nhập cung ${BRANCH_NAMES[ju.branch]}`];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (ju.branch === 2) bonus.push('Thái Dương ở Dần miếu vượng, Cự Môn được ánh mặt trời hóa giải thị phi');
  if (getStarSiHua(ju, '巨门') === '禄' || getStarSiHua(ju, '巨门') === '权') bonus.push('Cự Môn Hóa Lộc/Hóa Quyền (nhờ tài ăn nói mà sinh tiền)');
  if (getStarSiHua(ju, '巨门') === '忌') breaking.push('Cự Môn Hóa Kỵ (khẩu thiệt, kiện tụng)');
  if (ju.branch === 8) breaking.push('Thái Dương ở Thân đã ngả về tây, ám diệu Cự Môn càng lộ');

  patterns.push({
    name: 'Cự Nhật đồng cung',
    level: breaking.length ? 'caution' : (inMing && ju.branch === 2 ? 'excellent' : 'good'),
    description: `Cự Môn, Thái Dương đồng cung tại ${BRANCH_NAMES[ju.branch]}, Thái Dương hóa giải ám diệu của Cự Môn; chủ lập nghiệp bằng tài ăn nói, truyền thông, ngoại ngữ, chuyên môn. Ở Dần là đẹp, ở Thân lực giảm. Sợ Cự Môn Hóa Kỵ thì vướng kiện tụng.`,
    palaces: [ju.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư · Cự Nhật đồng cung》',
  });
}

/** 石中隐玉：巨门入命于子午宫 */
function detectShiZhongYinYu(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (!hasStar(ming, '巨门')) return;
  if (ming.branch !== 0 && ming.branch !== 6) return;  // 子(0) 或 午(6)

  const required = [`Cự Môn nhập Mệnh tại cung ${BRANCH_NAMES[ming.branch]}`];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (getStarSiHua(ming, '巨门') === '禄' || getStarSiHua(ming, '巨门') === '权') bonus.push('Cự Môn Hóa Lộc/Hóa Quyền');
  if (sanFangAllStars(chart).has('文昌')) bonus.push('Văn Xương hội chiếu (ngọc trong đá được soi sáng)');
  if (getStarSiHua(ming, '巨门') === '忌') breaking.push('Cự Môn Hóa Kỵ (ngọc vùi sâu trong bùn)');
  if (hasShaInPalace(ming, SHA_HARD)) breaking.push('Mệnh tọa sát tinh');

  patterns.push({
    name: 'Thạch trung ẩn ngọc',
    level: breaking.length ? 'caution' : 'excellent',
    description: 'Cự Môn tọa Mệnh ở Tý hoặc Ngọ, bề ngoài bình thường mà bên trong chứa tài học. Thời trẻ lặng lẽ không tên tuổi, trung niên mới hiển lộ quý khí; hợp đi đường chuyên môn, nghiên cứu, ăn nói, truyền thông. Cần có Lộc, Quyền hoặc Văn Xương giúp sức mới “đục đá thấy ngọc”.',
    palaces: ['命宫'],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số cốt tủy phú · Thạch trung ẩn ngọc》',
  });
}

/** 明珠出海：命宫在未空宫，对宫丑宫为太阳太阴 */
function detectMingZhuChuHai(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (ming.branch !== 7) return;   // 命在未
  if (getMajorStarNames(ming).length > 0) return;   // 命宫为空宫
  const dui = getDuiGong(chart, ming.branch);
  if (!dui) return;
  if (!hasStar(dui, '太阳') || !hasStar(dui, '太阴')) return;

  const required = ['Cung Mệnh ở Mùi là cung trống', 'Cung đối Sửu có Thái Dương, Thái Âm đồng độ'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('文昌') || sanFangAllStars(chart).has('文曲')) bonus.push('Hội thêm Xương Khúc');
  if (sanFangAllStars(chart).has('左辅') || sanFangAllStars(chart).has('右弼')) bonus.push('Phụ Bật trợ giúp');
  if (sanFangShaCount(chart, SHA_HARD) >= 2) breaking.push('Sát tinh hội chiếu (ánh ngọc mờ đi)');

  patterns.push({
    name: 'Minh châu xuất hải',
    level: breaking.length ? 'good' : 'excellent',
    description: 'Mệnh ở Mùi là cung trống, cung đối Sửu có Nhật Nguyệt cùng sáng củng chiếu, gọi là “Minh châu xuất hải” (ngọc sáng ra biển). Chủ xuất thân bình thường, nhờ nỗ lực về sau mà vươn lên; hợp đi xa lập nghiệp nơi khác, nghiên cứu học thuật hoặc giữ vị trí cao ở công ty lớn, chủ đại phú đại quý.',
    palaces: ['命宫', dui.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn tập · Minh châu xuất hải》',
  });
}

/** 紫微独坐入命 */
function detectZiWeiInMing(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (!hasStar(ming, '紫微') || hasStar(ming, '天府')) return;

  const required = ['Tử Vi độc tọa cung Mệnh (không có Thiên Phủ cùng tọa)'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  const sanFangSet = sanFangAllStars(chart);
  if (sanFangSet.has('左辅') && sanFangSet.has('右弼')) bonus.push('Tả Phụ, Hữu Bật cùng hội');
  if (sanFangSet.has('文昌') && sanFangSet.has('文曲')) bonus.push('Văn Xương, Văn Khúc cùng hội');
  if (!sanFangSet.has('左辅') && !sanFangSet.has('右弼')) breaking.push('Không có Phụ Bật (vua cô độc không bề tôi)');
  if (hasShaInPalace(ming, SHA_KONG)) breaking.push('Tử Vi gặp Không Kiếp (sách xưa kỵ nhất)');

  patterns.push({
    name: 'Tử Vi nhập Mệnh',
    level: breaking.length ? 'caution' : (bonus.length ? 'excellent' : 'good'),
    description: 'Tử Vi độc tọa cung Mệnh, là sao đế vương, lòng tự trọng cao, có sức hút lãnh đạo. Nhưng Tử Vi kỵ nhất cảnh “vua cô độc ở chốn đồng nội” — nếu không có Tả Phụ, Hữu Bật cùng hội, ngược lại thành người cao ngạo cô độc, dễ bị gièm pha.',
    palaces: ['命宫'],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

/** 辅弼夹命 */
function detectFuBiJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const prevHasZuo = hasStar(prev, '左辅');
  const prevHasYou = hasStar(prev, '右弼');
  const nextHasZuo = hasStar(next, '左辅');
  const nextHasYou = hasStar(next, '右弼');
  if (!((prevHasZuo && nextHasYou) || (prevHasYou && nextHasZuo))) return;

  const required = ['Tả Phụ, Hữu Bật chia ở hai cung trước sau cung Mệnh'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('天魁') || sanFangAllStars(chart).has('天钺')) bonus.push('Hội thêm Khôi Việt');

  patterns.push({
    name: 'Phụ Bật giáp Mệnh',
    level: 'excellent',
    description: 'Tả Phụ, Hữu Bật giáp Mệnh: luận thuyết truyền thống cho rằng cách này tượng trưng cho quý nhân giúp đỡ và phúc dày. Hợp đi đường quan chức, quản lý doanh nghiệp lớn và những hướng phát huy được tài tổ chức. Sách xưa nói “Tả Phụ Hữu Bật, chung thân phúc hậu” (cả đời phúc dày) — nhấn mạnh ưu thế của cách này trong việc tổ chức, điều phối.',
    palaces: ['命宫', prev.name, next.name],
    conditions: { required, bonus, breaking },
    source: '《Tử Vi Đẩu Số toàn thư · Phụ Bật giáp Mệnh》',
  });
}

/** 昌曲夹命 */
function detectChangQuJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const prevHasChang = hasStar(prev, '文昌');
  const prevHasQu = hasStar(prev, '文曲');
  const nextHasChang = hasStar(next, '文昌');
  const nextHasQu = hasStar(next, '文曲');
  if (!((prevHasChang && nextHasQu) || (prevHasQu && nextHasChang))) return;

  patterns.push({
    name: 'Xương Khúc giáp Mệnh',
    level: 'excellent',
    description: 'Văn Xương, Văn Khúc giáp cung Mệnh: chủ thông minh tuấn tú, văn chương xuất sắc, hợp đi đường giáo dục, học thuật, nghệ thuật, viết lách. Sách xưa nói “Xương Khúc giáp Mệnh chủ khoa giáp” (đỗ đạt khoa cử), lợi nhất cho vận thi cử.',
    palaces: ['命宫', prev.name, next.name],
    conditions: { required: ['Văn Xương, Văn Khúc chia ở hai cung trước sau cung Mệnh'] },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

/** 魁钺夹命 */
function detectKuiYueJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const okA = hasStar(prev, '天魁') && hasStar(next, '天钺');
  const okB = hasStar(prev, '天钺') && hasStar(next, '天魁');
  if (!okA && !okB) return;

  patterns.push({
    name: 'Khôi Việt giáp Mệnh',
    level: 'good',
    description: 'Thiên Khôi, Thiên Việt giáp Mệnh, nam gọi là Thiên Ất, nữ gọi là Ngọc Đường, cả đời được quý nhân nâng đỡ. Khi thi cử, tìm việc hay lúc then chốt thường có quý nhân bất ngờ giúp sức.',
    palaces: ['命宫', prev.name, next.name],
    conditions: { required: ['Thiên Khôi, Thiên Việt chia ở hai cung trước sau cung Mệnh'] },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

/** 双禄朝垣：化禄 + 禄存 同会三方 */
function detectShuangLuChaoYuan(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFang = getSanFangPalaces(chart);
  let huaLuFound = false;
  let luCunFound = false;
  for (const p of sanFang) {
    if (p.stars.some(s => s.siHua === '禄')) huaLuFound = true;
    if (hasStar(p, '禄存')) luCunFound = true;
  }
  if (!huaLuFound || !luCunFound) return;

  patterns.push({
    name: 'Song Lộc triều viên',
    level: 'excellent',
    description: 'Hóa Lộc, Lộc Tồn cùng hội tam phương tứ chính của Mệnh, nguồn tiền dồi dào, cơm áo đầy đủ. Sách xưa nói “Song Lộc triều viên, phú tỷ Đào Chu” (hai Lộc chầu Mệnh, giàu sánh Đào Chu Công); chủ cả đời không lo tiền, thường được cả chính tài lẫn hoạnh tài.',
    palaces: sanFang.map(p => p.name),
    conditions: {
      required: ['Hóa Lộc hội chiếu tam phương tứ chính', 'Lộc Tồn hội chiếu tam phương tứ chính'],
      breaking: hasShaInPalace(ming, SHA_KONG) ? ['Mệnh tọa Không Kiếp (song Lộc gặp Không, tiền đến rồi đi)'] : undefined,
    },
    source: '《Tử Vi Đẩu Số toàn thư · Song Lộc triều viên》',
  });
}

/** 三奇加会：化禄 化权 化科 同会三方 */
function detectSanQiJiaHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangPalaces = getSanFangPalaces(chart);
  let lu = false, quan = false, ke = false;
  for (const p of sanFangPalaces) {
    for (const s of p.stars) {
      if (s.siHua === '禄') lu = true;
      if (s.siHua === '权') quan = true;
      if (s.siHua === '科') ke = true;
    }
  }
  if (!(lu && quan && ke)) return;

  patterns.push({
    name: 'Tam kỳ gia hội',
    level: 'excellent',
    description: 'Hóa Lộc, Hóa Quyền, Hóa Khoa ba cát hóa cùng hội tam phương tứ chính của Mệnh, gọi là “Tam kỳ gia hội”. Chủ cả đời công danh, tiền tài, quý nhân đều đủ cả ba, là một trong những cát cách cao nhất của Tử Vi Đẩu Số.',
    palaces: sanFangPalaces.map(p => p.name),
    conditions: { required: ['Hóa Lộc, Hóa Quyền, Hóa Khoa ba cát hóa cùng hội tam phương tứ chính của Mệnh'] },
    source: '《Tử Vi Đẩu Số toàn thư · Tam kỳ gia hội》',
  });
}

/** 化禄入命/官/财 */
function detectHuaLuRuMing(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const huaLuStar = ming.stars.find(s => s.siHua === '禄' && s.type === 'major');
  if (!huaLuStar) return;

  patterns.push({
    name: `${tenSao(huaLuStar.name)} Hóa Lộc nhập Mệnh`,
    level: 'good',
    description: `${tenSao(huaLuStar.name)} Hóa Lộc tọa Mệnh, chủ kiếm tiền thuận lợi, nhân duyên tốt, nhiều cơ hội. ${huaLuStar.name === '武曲' ? 'Vũ Khúc Hóa Lộc thuộc chính tài, hợp thực nghiệp, tài chính.' : huaLuStar.name === '太阴' ? 'Thái Âm Hóa Lộc thuộc âm tài, bất động sản.' : huaLuStar.name === '贪狼' ? 'Tham Lang Hóa Lộc thuộc tiền từ quan hệ, tiền đào hoa.' : ''}`,
    palaces: ['命宫'],
    conditions: { required: [`${tenSao(huaLuStar.name)} Hóa Lộc tọa cung Mệnh`] },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

// ────────────────── 恶格识别器 ──────────────────

/** 化忌入命/迁 */
function detectHuaJiRuMingQian(chart: ZiweiChart, patterns: Pattern[]) {
  const qianBranch = (chart.mingGongBranch + 6) % 12;
  for (const palace of chart.palaces) {
    if (palace.branch !== chart.mingGongBranch && palace.branch !== qianBranch) continue;
    const jiStar = palace.stars.find(s => s.siHua === '忌' && s.type === 'major');
    if (!jiStar) continue;

    const inMing = palace.branch === chart.mingGongBranch;
    patterns.push({
      name: `${tenSao(jiStar.name)} Hóa Kỵ nhập ${inMing ? 'Mệnh' : 'Thiên Di'}`,
      level: 'caution',
      description: inMing
        ? `${tenSao(jiStar.name)} Hóa Kỵ tọa cung Mệnh, cần lưu ý tính cố chấp, trở ngại tâm lý hoặc nguy cơ sức khỏe tiềm ẩn của bản thân, việc gì cũng nên lùi một bước mà nghĩ. Hóa Kỵ chưa chắc là xấu, nó cho biết năng lượng của sao này cần được đặc biệt chú ý.`
        : `${tenSao(jiStar.name)} Hóa Kỵ tọa cung Thiên Di: ra ngoài, đi xa, quan hệ với người dễ có trắc trở, nên giữ hơn là động.`,
      palaces: [palace.name],
      conditions: { required: [`${tenSao(jiStar.name)} Hóa Kỵ tọa cung ${inMing ? 'Mệnh' : 'Thiên Di'}`] },
      source: '《Tử Vi Đẩu Số toàn thư》',
    });
  }
}

/** 羊陀夹忌：化忌坐宫，左右被擎羊陀罗夹 */
function detectYangTuoJiaJi(chart: ZiweiChart, patterns: Pattern[]) {
  for (const palace of chart.palaces) {
    const jiStar = palace.stars.find(s => s.siHua === '忌');
    if (!jiStar) continue;
    if (palace.branch !== chart.mingGongBranch) continue;   // 只看命宫被夹

    const { prev, next } = getJiaPalaces(chart, palace.branch);
    if (!prev || !next) continue;
    const aPrev = hasStar(prev, '擎羊') && hasStar(next, '陀罗');
    const aNext = hasStar(prev, '陀罗') && hasStar(next, '擎羊');
    if (!aPrev && !aNext) continue;

    patterns.push({
      name: 'Kình Đà giáp Kỵ',
      level: 'caution',
      description: 'Hóa Kỵ tọa Mệnh, hai bên có Kình Dương, Đà La giáp Mệnh. Sách xưa nói “Dương Đà giáp Kỵ vi bại cục” (Kình Đà giáp Kỵ là cục thất bại), chủ cả đời lao lực bôn ba, gập ghềnh không thuận, thân tâm mệt mỏi. Cần tu dưỡng đức hạnh và tích cực làm việc để hóa giải, việc gì cũng thận trọng là trên hết.',
      palaces: ['命宫', prev.name, next.name],
      conditions: { required: ['Hóa Kỵ tọa Mệnh', 'Kình Dương, Đà La chia ở hai cung trước sau cung Mệnh'] },
      source: '《Tử Vi Đẩu Số cốt tủy phú · Kình Đà giáp Kỵ》',
    });
    return;
  }
}

/** 火铃夹命：火星铃星分居命宫前后 */
function detectHuoLingJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const okA = hasStar(prev, '火星') && hasStar(next, '铃星');
  const okB = hasStar(prev, '铃星') && hasStar(next, '火星');
  if (!okA && !okB) return;

  patterns.push({
    name: 'Hỏa Linh giáp Mệnh',
    level: 'caution',
    description: 'Hỏa Tinh, Linh Tinh chia ở hai cung trước sau giáp Mệnh, chủ tính nóng, dễ bốc đồng, dễ gặp sự cố hoặc tranh chấp bất ngờ. Cần rèn tính kiên nhẫn, tránh quyết định vội vàng.',
    palaces: ['命宫', prev.name, next.name],
    conditions: { required: ['Hỏa Tinh, Linh Tinh chia ở hai cung trước sau cung Mệnh'] },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

/** 空劫夹命：地空地劫分居命宫前后 */
function detectKongJieJiaMing(chart: ZiweiChart, patterns: Pattern[]) {
  const { prev, next } = getJiaPalaces(chart, chart.mingGongBranch);
  if (!prev || !next) return;
  const okA = hasStar(prev, '地空') && hasStar(next, '地劫');
  const okB = hasStar(prev, '地劫') && hasStar(next, '地空');
  if (!okA && !okB) return;

  patterns.push({
    name: 'Không Kiếp giáp Mệnh',
    level: 'caution',
    description: 'Địa Không, Địa Kiếp giáp Mệnh, chủ tiền đến rồi đi, tư tưởng thoát tục, dễ đi vào tôn giáo, triết học. Sách xưa nói “Không Kiếp giáp Mệnh, tài bất tụ” (tiền không tụ). Hợp các nghề kỹ nghệ, tôn giáo, nghiên cứu không nặng vật chất.',
    palaces: ['命宫', prev.name, next.name],
    conditions: { required: ['Địa Không, Địa Kiếp chia ở hai cung trước sau cung Mệnh'] },
    source: '《Tử Vi Đẩu Số toàn thư》',
  });
}

/** 廉杀羊：廉贞、七杀、擎羊三星会照（流年大限最凶） */
function detectLianShaYang(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!(sanFangSet.has('廉贞') && sanFangSet.has('七杀') && sanFangSet.has('擎羊'))) return;

  patterns.push({
    name: 'Liêm Sát Dương',
    level: 'caution',
    description: 'Liêm Trinh, Thất Sát, Kình Dương ba sao hội chiếu tam phương của Mệnh, trong luận thuyết truyền thống được đánh dấu là tổ hợp cần đặc biệt chú ý. Khi cách này được kích hoạt ở đại hạn, lưu niên, nó nhắc giữ thái độ thận trọng: an toàn khi lái xe, hòa khí trong quan hệ, quyết định y tế cần lý trí — nhấn mạnh chủ động quản lý thay vì cam chịu số mệnh.',
    palaces: ['命宫'],
    conditions: { required: ['Liêm Trinh, Thất Sát, Kình Dương ba sao hội chiếu tam phương tứ chính'] },
    source: '《Tử Vi Đẩu Số toàn thư · Liêm Sát Dương》',
  });
}

/** 巨火羊：巨门、火星、擎羊会照 */
function detectJuHuoYang(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!(sanFangSet.has('巨门') && sanFangSet.has('火星') && sanFangSet.has('擎羊'))) return;

  patterns.push({
    name: 'Cự Hỏa Dương',
    level: 'caution',
    description: 'Cự Môn, Hỏa Tinh, Kình Dương ba sao hội chiếu; sách cổ truyền thống ghi đây là tổ hợp cần cảnh giác (câu cổ “chung thân ải tử” là lối nói số mệnh, nay không còn áp dụng). Cách hiểu hiện đại: tổ hợp này tượng trưng cho việc nói thẳng dễ gây xung đột, khi cảm xúc mạnh cần tự nhận biết. Hướng tu dưỡng: tập diễn đạt ôn hòa, chủ động hóa giải đối lập, rèn khả năng quản lý cảm xúc.',
    palaces: ['命宫'],
    conditions: { required: ['Cự Môn, Hỏa Tinh, Kình Dương ba sao hội chiếu tam phương tứ chính'] },
    source: '《Tử Vi Đẩu Số cốt tủy phú · Cự Hỏa Dương》',
  });
}

/** 铃昌陀武：铃星、文昌、陀罗、武曲会照（限至投河） */
function detectLingChangTuoWu(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!(sanFangSet.has('铃星') && sanFangSet.has('文昌') && sanFangSet.has('陀罗') && sanFangSet.has('武曲'))) return;

  patterns.push({
    name: 'Linh Xương Đà Vũ',
    level: 'caution',
    description: 'Linh Tinh, Văn Xương, Đà La, Vũ Khúc bốn sao cùng hội; sách cổ truyền thống ghi đây là tổ hợp cần đặc biệt chú ý (câu cổ “hạn chí đầu hà” là lối nói số mệnh, không phải cách hiểu hiện đại). Lời khuyên hiện đại: khi tổ hợp này được kích hoạt ở đại hạn, lưu niên, nó nhắc xử lý quyết định lớn một cách lý trí, chú ý biến động cảm xúc, giữ cuộc sống ổn định — nhấn mạnh chủ động quản lý thay vì thụ động chờ đợi.',
    palaces: ['命宫'],
    conditions: { required: ['Linh Tinh, Văn Xương, Đà La, Vũ Khúc bốn sao hội chiếu tam phương tứ chính'] },
    source: '《Tử Vi Đẩu Số cốt tủy phú · Linh Xương Đà Vũ》',
  });
}

/** 马头带箭：擎羊在午宫坐命 */
function detectMaTouDaiJian(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  if (ming.branch !== 6) return;   // 必须午
  if (!hasStar(ming, '擎羊')) return;

  const required = ['Kình Dương tọa Mệnh tại cung Ngọ'];
  const bonus: string[] = [];
  const breaking: string[] = [];
  if (sanFangAllStars(chart).has('七杀') || sanFangAllStars(chart).has('破军')) bonus.push('Hội thêm Thất Sát hoặc Phá Quân (võ chức đại quý)');
  if (sanFangAllStars(chart).has('天魁') || sanFangAllStars(chart).has('天钺')) bonus.push('Khôi Việt gia chiếu');

  patterns.push({
    name: 'Mã đầu đới tiễn',
    level: bonus.length ? 'good' : 'caution',
    description: 'Kình Dương tọa Mệnh tại cung Ngọ, gọi là “Mã đầu đới tiễn” (đầu ngựa mang tên), sách xưa nói “uy trấn biên cương”. Cách này tượng trưng cho sức hành động quyết đoán và tinh thần cạnh tranh, hợp những nghề cần năng lực thực thi và quyết định dứt khoát. Luận thuyết truyền thống cũng nhắc cách này cần phối hợp cát tinh mới phát huy tốt nhất — nhấn mạnh ảnh hưởng của tổ hợp thay vì luận riêng một sao.',
    palaces: ['命宫'],
    conditions: { required, bonus },
    source: '《Tử Vi Đẩu Số cốt tủy phú · Mã đầu đới tiễn》',
  });
}

// ────────────────── 基础格局（提升识别覆盖率）──────────────────
// 设计：让普通命盘也能识别出 1-3 个常见格局，而不是 30+ 严格古书格局都不匹配。
// 这些都是单一条件触发的轻量识别，level 多为 neutral / good。

/** 禄存守身：禄存入身宫（或命宫与身宫同宫） */
function detectLuCunShouShen(chart: ZiweiChart, patterns: Pattern[]) {
  const luCunPalace = findStarPalace(chart, '禄存');
  if (!luCunPalace) return;
  const inMing = luCunPalace.branch === chart.mingGongBranch;
  const inShen = luCunPalace.branch === chart.shenGongBranch;
  if (!inMing && !inShen) return;
  patterns.push({
    name: inMing ? 'Lộc Tồn thủ Mệnh' : 'Lộc Tồn thủ Thân',
    level: 'good',
    description: inMing
      ? 'Lộc Tồn tọa Mệnh, chủ cả đời cơm áo không lo, tiền lộc ổn định. Tính cách bảo thủ, giỏi tích lũy, nhưng Kình Đà giáp Lộc thì phải phòng tiểu nhân. Hợp nhất khi phối Hóa Lộc, Tả Phụ, Hữu Bật mới thành đại cách.'
      : 'Lộc Tồn nhập cung Thân, chủ sau trung niên nguồn tiền ổn định, được lộc tự hưởng. Thầy Nghê nói “Lộc Tồn nhập Thân, tài khí cận thân” (tài khí ở gần mình) — người phối ngẫu hoặc hướng sự nghiệp có thể mang lại tiền lộc ổn định.',
    palaces: [inMing ? '命宫' : '身宫'],
    conditions: { required: [inMing ? 'Lộc Tồn nhập cung Mệnh' : 'Lộc Tồn nhập cung Thân'] },
    source: '《Tử Vi Đẩu Số toàn thư · sao Lộc Tồn》',
  });
}

/** 天马入命/迁：驿马星动 */
function detectTianMaRuMing(chart: ZiweiChart, patterns: Pattern[]) {
  const tianMaPalace = findStarPalace(chart, '天马');
  if (!tianMaPalace) return;
  const inMing = tianMaPalace.branch === chart.mingGongBranch;
  const inQian = tianMaPalace.branch === ((chart.mingGongBranch + 6) % 12);
  if (!inMing && !inQian) return;
  patterns.push({
    name: inMing ? 'Thiên Mã nhập Mệnh' : 'Thiên Mã tại Thiên Di',
    level: 'neutral',
    description: inMing
      ? 'Thiên Mã tọa Mệnh, chủ cả đời bôn ba, trong động mà được tiền, hợp đi đường buôn bán đi lại, công việc bên ngoài, phát triển đa lĩnh vực. Thầy Nghê nói “Thiên Mã nhập Mệnh, vô Lộc bất phát” (không có Lộc thì không phát) — nếu hội thêm Lộc Tồn hoặc Hóa Lộc tức là cách giàu “Lộc Mã giao trì”.'
      : 'Thiên Mã ở cung Thiên Di, chủ ra ngoài có lợi, đi xa được tiền, hợp phát triển nơi đất khách. Phối Hóa Lộc chủ sinh tiền ở nơi khác, phối sát tinh thì đường đi nhiều trắc trở.',
    palaces: [tianMaPalace.name],
    conditions: { required: [inMing ? 'Thiên Mã nhập cung Mệnh' : 'Thiên Mã nhập cung Thiên Di'] },
    source: '《Tử Vi Đẩu Số toàn thư · sao Thiên Mã》',
  });
}

/** 化禄入财：财帛宫主星化禄 */
function detectHuaLuRuCai(chart: ZiweiChart, patterns: Pattern[]) {
  const cai = chart.palaces.find(p => p.name === '财帛');
  if (!cai) return;
  const luStar = cai.stars.find(s => s.type === 'major' && s.siHua === '禄');
  if (!luStar) return;
  patterns.push({
    name: 'Hóa Lộc nhập Tài',
    level: 'good',
    description: `${tenSao(luStar.name)} Hóa Lộc nhập cung Tài Bạch, chủ nguồn tiền thông suốt, thu nhập ổn định. Thầy Nghê giảng Hóa Lộc là biểu tượng của “chính tài” — năng lực mà sao hóa Lộc này đại diện (đặc tính cốt lõi của ${tenSao(luStar.name)}) là trục chính để bạn kiếm tiền. Phối Lộc Tồn hoặc Thiên Mã thì nguồn tiền càng rộng.`,
    palaces: ['财帛'],
    conditions: { required: [`${tenSao(luStar.name)} Hóa Lộc nhập cung Tài Bạch`] },
    source: '《Tử Vi Đẩu Số toàn thư · luận Tứ Hóa》',
  });
}

/** 化权入官：官禄宫主星化权 */
function detectHuaQuanRuGuan(chart: ZiweiChart, patterns: Pattern[]) {
  const guan = chart.palaces.find(p => p.name === '官禄');
  if (!guan) return;
  const quanStar = guan.stars.find(s => s.type === 'major' && s.siHua === '权');
  if (!quanStar) return;
  patterns.push({
    name: 'Hóa Quyền nhập Quan',
    level: 'good',
    description: `${tenSao(quanStar.name)} Hóa Quyền nhập cung Quan Lộc, chủ sự nghiệp có khả năng nắm quyền, đảm đương được vị trí tự lập một phương. Hóa Quyền đại diện cho quyền lực và năng lực thực thi — ${tenSao(quanStar.name)} Hóa Quyền cho thấy trong sự nghiệp bạn có thể thành người quyết định hoặc người thực thi nòng cốt, hợp đi đường quản lý hoặc chuyên gia kỹ thuật có uy tín.`,
    palaces: ['官禄'],
    conditions: { required: [`${tenSao(quanStar.name)} Hóa Quyền nhập cung Quan Lộc`] },
    source: '《Tử Vi Đẩu Số toàn thư · luận Tứ Hóa》',
  });
}

/** 化科入命/身：科名加身 */
function detectHuaKeRuMingShen(chart: ZiweiChart, patterns: Pattern[]) {
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  const shen = chart.palaces.find(p => p.branch === chart.shenGongBranch);
  const target = [ming, shen].filter((p): p is Palace => Boolean(p));
  for (const p of target) {
    const keStar = p.stars.find(s => s.type === 'major' && s.siHua === '科');
    if (!keStar) continue;
    const isMing = p.branch === chart.mingGongBranch;
    patterns.push({
      name: isMing ? 'Hóa Khoa nhập Mệnh' : 'Hóa Khoa nhập Thân',
      level: 'good',
      description: `${tenSao(keStar.name)} Hóa Khoa nhập cung ${isMing ? 'Mệnh' : 'Thân'}, chủ vận danh tiếng, văn thư, học thuật. Thầy Nghê giảng Hóa Khoa là “sao quý nhân” — ${tenSao(keStar.name)} Hóa Khoa mang lại phẩm chất được người khác coi trọng, hợp làm văn thư, giáo dục, nghiên cứu, tư vấn, sáng tạo văn hóa và những hướng “lấy danh mà được lợi”.`,
      palaces: [isMing ? '命宫' : '身宫'],
      conditions: { required: [`${tenSao(keStar.name)} Hóa Khoa nhập cung ${isMing ? 'Mệnh' : 'Thân'}`] },
      source: '《Tử Vi Đẩu Số toàn thư · luận Tứ Hóa》',
    });
    return; // 命和身重复时只识别一次
  }
}

/** 机月同梁三星会（3 星不全格，非四星真格）：天机/太阴/天同/天梁 任 3 星齐入三方四正 */
function detectJiYueTongLiangPartial(chart: ZiweiChart, ming: Palace, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  const has = ['天机', '太阴', '天同', '天梁'].filter(s => sanFangSet.has(s));
  if (has.length !== 3) return; // 4 星齐由 detectJiYueTongLiang 处理
  // 避免和上面 detectJiYueTongLiang 重复（4 星齐的不进这里）
  const missing = ['天机', '太阴', '天同', '天梁'].filter(s => !sanFangSet.has(s));
  patterns.push({
    name: 'Cơ Nguyệt Đồng Lương (hội ba sao)',
    level: 'neutral',
    description: `Cơ Nguyệt Đồng Lương cần đủ bốn sao Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương cùng hội tam phương tứ chính mới là chân cách trọn vẹn; lá số này chỉ hội đủ 3 sao (${has.map(tenSao).join(', ')}), thiếu ${missing.map(tenSao).join(', ')} không hội, nên không phải chân cách trọn vẹn, lực giảm một bậc. Văn nhã có mưu, hợp công chức, giảng dạy nghiên cứu, y tế, dịch vụ và các nghề dựa vào tích lũy và ổn định; điểm then chốt là sao còn thiếu phối hợp với Tứ Hóa thế nào.`,
    palaces: getSanFangPalaces(chart).filter(p => has.some(s => getMajorStarNames(p).includes(s))).map(p => p.name),
    conditions: { required: [`Tam phương tứ chính hội ${has.map(tenSao).join(', ')} (Cơ Nguyệt Đồng Lương thiếu ${missing.map(tenSao).join(', ')})`] },
    source: '《Tử Vi Đẩu Số toàn thư · cách Cơ Nguyệt Đồng Lương》',
  });
  void ming;
}

/** 昌曲同会：文昌+文曲都在命三方四正 */
function detectChangQuTongHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('文昌') || !sanFangSet.has('文曲')) return;
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  if (!ming) return;
  const inMing = hasStar(ming, '文昌') && hasStar(ming, '文曲');
  patterns.push({
    name: inMing ? 'Xương Khúc tọa Mệnh' : 'Xương Khúc đồng hội',
    level: 'good',
    description: inMing
      ? 'Văn Xương, Văn Khúc cùng nhập cung Mệnh, chủ thông minh tuấn tú, văn chương xuất sắc, hợp văn học, giáo dục, viết lách, tư vấn. Kỵ nhất Hóa Kỵ — Xương Khúc Hóa Kỵ chủ thiệt thòi ngầm về văn thư, hợp đồng.'
      : 'Văn Xương, Văn Khúc cùng hội tam phương tứ chính, chủ tài hoa dồi dào, ăn nói và viết lách đều giỏi. Hợp những nghề cần diễn đạt và văn tài; có Hóa Khoa trợ lực thì danh tiếng hiển đạt.',
    palaces: ['命宫'],
    conditions: { required: ['Văn Xương, Văn Khúc cùng hội tam phương tứ chính của Mệnh'] },
    source: '《Tử Vi Đẩu Số toàn thư · luận Văn tinh》',
  });
}

/** 辅弼同会：左辅+右弼都在命三方四正 */
function detectFuBiTongHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('左辅') || !sanFangSet.has('右弼')) return;
  patterns.push({
    name: 'Phụ Bật đồng hội',
    level: 'good',
    description: 'Tả Phụ, Hữu Bật cùng hội tam phương tứ chính của Mệnh, chủ cả đời quý nhân không dứt, nhân duyên rất tốt. Hợp nhất với vị trí lãnh đạo và công việc kiểu làm việc nhóm. Thầy Nghê nói “Phụ Bật giáp Mệnh, bình sinh quý nhân đa” (cả đời nhiều quý nhân) — bạn không phải mệnh đơn thương độc mã, hãy khéo dùng mạng lưới quan hệ.',
    palaces: ['命宫'],
    conditions: { required: ['Tả Phụ, Hữu Bật cùng hội tam phương tứ chính của Mệnh'] },
    source: '《Tử Vi Đẩu Số toàn thư · luận Phụ Bật》',
  });
}

/** 魁钺同会：天魁+天钺都在命三方四正 */
function detectKuiYueTongHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sanFangSet = sanFangAllStars(chart);
  if (!sanFangSet.has('天魁') || !sanFangSet.has('天钺')) return;
  patterns.push({
    name: 'Khôi Việt đồng hội',
    level: 'good',
    description: 'Thiên Khôi, Thiên Việt cùng hội tam phương tứ chính của Mệnh, chủ được “Thiên Ất quý nhân” trợ lực, lúc then chốt luôn có quý nhân nâng đỡ. Thầy Nghê nói “Khôi Việt giáp Mệnh, tất vi quý nhân” (ắt là người quý) — khi gặp khó khăn sẽ có người đắc lực xuất hiện giúp đỡ, nên chủ động giữ gìn các mối quan hệ.',
    palaces: ['命宫'],
    conditions: { required: ['Thiên Khôi, Thiên Việt cùng hội tam phương tứ chính của Mệnh'] },
    source: '《Tử Vi Đẩu Số toàn thư · luận Khôi Việt》',
  });
}

/** 科权双会：化科 + 化权 同会三方四正 */
function detectKeQuanShuangHui(chart: ZiweiChart, patterns: Pattern[]) {
  const sfPalaces = getSanFangPalaces(chart);
  let hasKe = false, hasQuan = false;
  for (const p of sfPalaces) {
    for (const s of p.stars) {
      if (s.type === 'major' && s.siHua === '科') hasKe = true;
      if (s.type === 'major' && s.siHua === '权') hasQuan = true;
    }
  }
  if (!hasKe || !hasQuan) return;
  patterns.push({
    name: 'Khoa Quyền song hội',
    level: 'good',
    description: 'Hóa Khoa + Hóa Quyền cùng hội tam phương tứ chính, chủ danh và quyền đều đẹp — vừa có học thức/danh tiếng (Khoa), vừa có năng lực nắm quyền (Quyền); hợp đi đường “chuyên gia có uy tín” (như bác sĩ, luật sư, giáo sư, kỹ thuật nòng cốt), danh lợi đều được và nền móng vững chắc.',
    palaces: ['命宫'],
    conditions: { required: ['Hóa Khoa, Hóa Quyền cùng hội tam phương tứ chính của Mệnh'] },
    source: '《Tử Vi Đẩu Số toàn thư · Tứ Hóa hội chiếu》',
  });
}

// ────────────────── 《全书》四张格表 · 严格判定接入 ──────────────────
//
// 卷一〈定贵局〉27 /〈定富局〉6 /〈定贫贱局〉8 共 41 条命盘可判格
// （〈定杂局〉8 条为大限格，另行架构，未收录）。严格实现见
// patterns-dinggui/dingfu/dingpin.ts：照原文判，不放宽；安星无解的
// 条目在源表标 unreachable，不参与判定。识别器分工：
//  - 本文件原有 41 个识别器：宽松判据，带加分项/破格警示的 UI 文案；
//  - 严格版：description 即原书注文，source 带原书条目序号，可溯源。
// 同名时严格版取代宽松版（君臣庆会/府相朝垣/日月夹命/明珠出海 4 条），
// 宽松版的 bonus/breaking 原样保留——严格条件是宽松条件的子集，
// 宽松版能触发时其加分判定依然有效。
// 马头带剑不参与取代：严格版已证 unreachable（注文「不是居午格」否定了
// 项目所采读法，见 patterns-dinggui.ts 第 10 条），不会产生命中；
// 宽松版「马头带箭」按原样保留，其判据质量已在核查报告中标 wrong。

interface QuanshuHit {
  no: number;
  name: string;
  note: string;
  status: string;
}

function detectQuanshuStrict(chart: ZiweiChart): Pattern[] {
  const out: Pattern[] = [];
  const push = (hits: QuanshuHit[], table: string, level: Pattern['level']) => {
    for (const h of hits) {
      const tag = h.status === 'disputed' ? ' [cách còn nghi vấn: chú văn có nhiều nghĩa, xét theo cách đọc thông dụng nhất]' : '';
      out.push({
        name: h.name,
        level,
        description: `Nguyên thư điều ${h.no}: “${h.note}”${tag}`,
        palaces: ['命宫'],
        conditions: { required: [`《Toàn thư》 ${table} điều ${h.no}: ${h.note}`] },
        source: `《Tử Vi Đẩu Số toàn thư · quyển 1 · ${table}》 điều ${h.no}`,
      });
    }
  };
  push(detectDingGui(chart), 'Định quý cục', 'excellent');
  push(detectDingFu(chart), 'Định phú cục', 'good');
  push(detectDingPin(chart), 'Định bần tiện cục', 'caution');
  return out;
}

// ────────────────── 主入口 ──────────────────
export function detectPatterns(chart: ZiweiChart): Pattern[] {
  const patterns: Pattern[] = [];
  const ming = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  if (!ming) return patterns;

  // 上格
  detectJunChenQingHui(chart, ming, patterns);
  detectZiFu(chart, ming, patterns);
  detectFuXiangChaoYuan(chart, ming, patterns);
  detectYangLiangChangLu(chart, ming, patterns);
  detectHuoTanLingTan(chart, ming, patterns);
  detectWuTan(chart, ming, patterns);
  detectShaPoLang(chart, ming, patterns);
  detectJiYueTongLiang(chart, ming, patterns);

  // 中格
  detectLianXiang(chart, patterns);
  detectWuQiSha(chart, patterns);
  detectTongLiang(chart, patterns);
  detectRiYueTongGong(chart, patterns);
  detectRiYueJiaMing(chart, patterns);
  detectJuRiTongGong(chart, patterns);
  detectShiZhongYinYu(chart, ming, patterns);
  detectMingZhuChuHai(chart, ming, patterns);
  detectZiWeiInMing(chart, ming, patterns);

  // 助力格
  detectFuBiJiaMing(chart, patterns);
  detectChangQuJiaMing(chart, patterns);
  detectKuiYueJiaMing(chart, patterns);
  detectShuangLuChaoYuan(chart, ming, patterns);
  detectSanQiJiaHui(chart, patterns);
  detectHuaLuRuMing(chart, ming, patterns);

  // 恶格
  detectHuaJiRuMingQian(chart, patterns);
  detectYangTuoJiaJi(chart, patterns);
  detectHuoLingJiaMing(chart, patterns);
  detectKongJieJiaMing(chart, patterns);
  detectLianShaYang(chart, patterns);
  detectJuHuoYang(chart, patterns);
  detectLingChangTuoWu(chart, patterns);
  detectMaTouDaiJian(chart, ming, patterns);

  // 基础格局（提升识别覆盖率，让普通命盘也能识别 1-3 个）
  detectLuCunShouShen(chart, patterns);
  detectTianMaRuMing(chart, patterns);
  detectHuaLuRuCai(chart, patterns);
  detectHuaQuanRuGuan(chart, patterns);
  detectHuaKeRuMingShen(chart, patterns);
  detectJiYueTongLiangPartial(chart, ming, patterns);
  detectChangQuTongHui(chart, patterns);
  detectFuBiTongHui(chart, patterns);
  detectKuiYueTongHui(chart, patterns);
  detectKeQuanShuangHui(chart, patterns);

  // 《全书》四张格表严格判定接入（同名严格版取代宽松版，见上方注释）
  const strict = detectQuanshuStrict(chart);
  const looseByName = new Map(patterns.map(p => [p.name, p]));
  const out = patterns.slice();
  for (const s of strict) {
    const loose = looseByName.get(s.name);
    if (loose) {
      const idx = out.indexOf(loose);
      out[idx] = {
        ...s,
        conditions: {
          required: s.conditions!.required,
          bonus: loose.conditions?.bonus,
          breaking: loose.conditions?.breaking,
        },
      };
    } else {
      out.push(s);
    }
  }
  return out;
}

// ────────────────── 命宫摘要（保持向后兼容）──────────────────
export function getMingGongSummary(chart: ZiweiChart): {
  stars: string[];
  keywords: string[];
  nature: string;
} {
  const mingPalace = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  if (!mingPalace) return { stars: [], keywords: [], nature: '' };

  const majorStars = mingPalace.stars.filter(s => s.type === 'major');
  const starNames = majorStars.map(s => s.name);

  const keywordMap: Record<string, string[]> = {
    '紫微': ['Tôn quý', 'Độc lập', 'Lãnh đạo'],
    '天机': ['Trí tuệ', 'Cơ biến', 'Giỏi mưu tính'],
    '太阳': ['Dương cương', 'Quan quý', 'Hào phóng'],
    '武曲': ['Giàu có', 'Cương nghị', 'Quả đoán'],
    '天同': ['Ôn hòa', 'Hưởng phúc', 'Tùy duyên'],
    '廉贞': ['Tài nghệ', 'Đào hoa', 'Hay thay đổi'],
    '天府': ['Kho tiền', 'Chín chắn', 'Bảo thủ'],
    '太阴': ['Dịu dàng', 'Giàu có', 'Tinh tế'],
    '贪狼': ['Dục vọng', 'Đào hoa', 'Đa tài'],
    '巨门': ['Giỏi biện luận', 'Hay suy nghĩ', 'Tài ăn nói'],
    '天相': ['Phò tá', 'Hành chính', 'Vững vàng'],
    '天梁': ['Che chở', 'Y dược', 'Bề trên'],
    '七杀': ['Tướng tinh', 'Quyết đoán', 'Cô khắc'],
    '破军': ['Khai sáng', 'Biến động', 'Phá cũ'],
  };

  const natureMap: Record<string, string> = {
    '紫微': 'Sao đế vương', '天机': 'Sao trí tuệ', '太阳': 'Sao quý nhân',
    '武曲': 'Sao tài bạch', '天同': 'Sao phúc đức', '廉贞': 'Sao đào hoa',
    '天府': 'Sao kho tiền', '太阴': 'Sao tài phú', '贪狼': 'Sao đào hoa',
    '巨门': 'Sao thị phi', '天相': 'Sao ấn thụ', '天梁': 'Sao che chở',
    '七杀': 'Sao tướng soái', '破军': 'Sao biến động',
  };

  const keywords = starNames.flatMap(n => keywordMap[n] ?? []).slice(0, 5);
  const nature = starNames.length > 0 ? (natureMap[starNames[0]] ?? '') : 'Vô chính diệu';

  return { stars: starNames, keywords, nature };
}
