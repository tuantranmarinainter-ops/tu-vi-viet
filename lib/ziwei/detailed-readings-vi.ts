import type { Palace, SiHua, Star, ZiweiChart } from './types';
import { branchNamesVi, viLabel } from '@/lib/i18n/vi';
import { STAR_TOPIC_CONTENT, TOPIC_GUIDES, type DetailedTopic } from './reading-content-vi';

export const READING_VERSION = 'vi-natal-v2';
export const READING_SOURCES = {
  palace: { title: 'iztro: ý nghĩa cung, vị trí Thân và tam phương tứ chính', url: 'https://docs.iztro.com/learn/palace', scope: 'Tham khảo khái niệm và quan hệ cung; không chứng nhận toàn bộ lời luận của ứng dụng.' },
  brightness: { title: 'iztro: phân loại sao và độ sáng', url: 'https://docs.iztro.com/learn/star', scope: 'Giữ mức độ sáng do engine trả về; bảng giữa các trường phái có thể khác nhau.' },
  mutagen: { title: 'iztro: tứ hóa', url: 'https://docs.iztro.com/learn/mutagen', scope: 'Tham khảo biểu tượng Lộc, Quyền, Khoa, Kỵ; bài này chỉ đọc tứ hóa bản mệnh.' },
  auxiliary: { title: 'iztro: phụ tinh', url: 'https://docs.iztro.com/learn/minor-star', scope: 'Tham khảo tính chất phụ tinh; không dùng số lượng cát/sát để chấm điểm cuộc đời.' },
  editorial: { title: 'Nội dung tiếng Việt do ứng dụng biên soạn', scope: 'Mở rộng từ bộ mô tả 14 chính tinh của project. Các liên hệ theo chủ đề và câu hỏi là cách diễn giải của ứng dụng, chưa được chuyên gia thẩm định; không phải trích dịch cổ thư hoặc v4.' },
} as const;
type SourceId = keyof typeof READING_SOURCES;
export interface ReadingItem {
  id: string;
  title: string;
  text: string;
  evidence: string[];
  sourceIds: SourceId[];
}
export interface ReadingSection { id: string; title: string; items: ReadingItem[] }
export interface DetailedReading {
  version: string;
  intro: string;
  sections: ReadingSection[];
  questions: string[];
  boundary: string;
  gaps: string[];
}

const TOPIC_PALACES: Record<DetailedTopic, string> = { overview: '命', career: '官禄', wealth: '财帛', love: '夫妻' };
const clean = (name: string) => name.replace(/宫$/, '').replace('交友', '仆役');
const majors = (palace: Palace) => palace.stars.filter(star => star.type === 'major');
const palaceName = (palace: Palace) => `${viLabel(palace.name)} tại ${branchNamesVi[palace.branch]}`;
const starFact = (palace: Palace, star: Star) => `${viLabel(star.name)}${star.brightnessRaw ? ` (${viLabel(star.brightnessRaw)})` : ''}${star.siHua ? `, Hóa ${viLabel(star.siHua)}` : ''} ở cung ${palaceName(palace)}.`;
const palaceFact = (palace: Palace) => `Cung ${palaceName(palace)}: ${majors(palace).length ? majors(palace).map(star => viLabel(star.name)).join(', ') : 'vô chính diệu'}.`;
const findPalace = (chart: ZiweiChart, name: string) => chart.palaces.find(palace => clean(palace.name) === clean(name));

/** Relationships use branch IDs, never array position or translated labels. */
export function getReadingContext(chart: ZiweiChart, target: Palace) {
  return [0, 4, 8, 6].map(offset => ({
    offset,
    palace: chart.palaces.find(palace => palace.branch === (target.branch + offset) % 12),
    relation: offset === 0 ? 'Bản cung' : offset === 6 ? 'Đối cung' : 'Tam hợp',
  }));
}

const ROLE_TOPICS: Record<string, DetailedTopic> = { '命': 'overview', '官禄': 'career', '财帛': 'wealth', '夫妻': 'love' };
const PALACE_ROLES: Record<string, string> = {
  '命': 'động lực cá nhân', '官禄': 'cách làm việc', '财帛': 'cách sử dụng nguồn lực',
  '迁移': 'ứng xử với môi trường bên ngoài', '夫妻': 'kỳ vọng trong quan hệ đôi lứa',
  '福德': 'nhu cầu tinh thần', '仆役': 'cách cộng tác và giao tiếp',
};
const HUA_TEXT: Record<SiHua, Record<DetailedTopic, string>> = {
  '禄': { overview: 'Gợi phần dễ thu hút sự quan tâm hoặc muốn dành thêm nguồn lực.', career: 'Gợi động lực mở rộng sự tham gia và nhận thêm công việc.', wealth: 'Gợi nhu cầu mở rộng nguồn lực; cần phân biệt phần thu về với phần tiêu dùng.', love: 'Gợi mong muốn dành thêm sự quan tâm và chia sẻ.' },
  '权': { overview: 'Gợi nhu cầu chủ động, trách nhiệm và quyền quyết định.', career: 'Gợi cách nhận trách nhiệm và kiểm soát tiến độ.', wealth: 'Gợi nhu cầu chủ động quản lý việc sử dụng nguồn lực.', love: 'Gợi nhu cầu có tiếng nói trong quyết định chung.' },
  '科': { overview: 'Gợi sự chú ý tới cách thể hiện và sự ghi nhận.', career: 'Gợi sự chú ý tới uy tín và cách trình bày năng lực.', wealth: 'Gợi sự chú ý tới tính rõ ràng và cách trình bày chuyện tiền bạc.', love: 'Gợi sự chú ý tới cách trao đổi và hình ảnh của mối quan hệ.' },
  '忌': { overview: 'Gợi điểm dễ bận tâm và dành nhiều công sức để hoàn thiện.', career: 'Gợi phần công việc dễ đặt kỳ vọng cao hoặc kiểm tra nhiều lần.', wealth: 'Gợi điểm dễ lo về sự thiếu hụt và cần kiểm tra bằng số liệu thực tế.', love: 'Gợi chủ đề dễ nhạy cảm hoặc cần được nói rõ kỳ vọng.' },
};
const PAIRS = [
  { id: 'ta-huu', names: ['左辅', '右弼'], theme: 'phối hợp và tiếp nhận hỗ trợ' },
  { id: 'xuong-khuc', names: ['文昌', '文曲'], theme: 'học hỏi và diễn đạt' },
  { id: 'khoi-viet', names: ['天魁', '天钺'], theme: 'hướng dẫn và kết nối hỗ trợ' },
] as const;
const PAIR_BALANCE: Record<DetailedTopic, string> = {
  overview: 'Đối chiếu xem bạn đang tự làm mọi việc hay có thể chia sẻ trách nhiệm và phản hồi với người khác.',
  career: 'Có thể dùng như câu hỏi về cách phối hợp, ghi nhận đóng góp và làm rõ vai trò trong công việc.',
  wealth: 'Đối chiếu cách bạn trao đổi thông tin và trách nhiệm khi cùng sử dụng nguồn lực; không suy ra thu nhập từ cặp sao.',
  love: 'Đối chiếu cách hai bên lắng nghe và nhờ hỗ trợ; cặp sao không cho biết tính cách hoặc lòng chung thủy của người kia.',
};

/** A deterministic reading of natal facts. Does not mutate charts or apply time overlays. */
export function getDetailedVietnameseReading(chart: ZiweiChart, topic: DetailedTopic): DetailedReading {
  const guide = TOPIC_GUIDES[topic];
  const gaps = ['Chưa phân tích giáp cung, Tuần/Triệt, toàn bộ cách cục hoặc phi hóa. Không tự suy kết luận cho tổ hợp chưa có quy tắc.'];
  const sections: ReadingSection[] = [];
  const target = findPalace(chart, TOPIC_PALACES[topic]);
  if (!target) return { version: READING_VERSION, intro: guide.intro, sections, questions: guide.questions, boundary: guide.boundary, gaps: ['Thiếu cung chính của chủ đề; chưa có đủ dữ liệu để diễn giải.'] };
  const context = getReadingContext(chart, target);
  for (const item of context) if (!item.palace) gaps.push(`Thiếu cung ở địa chi ${branchNamesVi[(target.branch + item.offset) % 12]}; không suy nội dung cho vị trí này.`);
  const palaces = context.flatMap(item => item.palace ? [item.palace] : []);
  const opposite = context.find(item => item.offset === 6)?.palace;
  const ownMajors = majors(target);
  const central: ReadingItem[] = [];
  // Borrow only actual opposite-palace principals; never trust stale borrowedStars metadata.
  const principalPalace = ownMajors.length ? target : opposite;
  const principals = principalPalace ? majors(principalPalace) : [];
  if (!ownMajors.length) central.push({
    id: 'empty-palace', title: 'Bản cung vô chính diệu',
    text: principals.length ? `Tham khảo ${principals.map(star => viLabel(star.name)).join(', ')} ở đối cung khi đọc chủ đề này. Các sao vẫn nằm ở đối cung; độ sáng và tứ hóa của chúng được ghi tại đó.` : 'Chưa có chính tinh để tham khảo ở bản cung hoặc đối cung. Phần phụ tinh và các cung liên hệ vẫn được liệt kê, nhưng chưa đủ cơ sở để mô tả trọng tâm chính tinh.',
    evidence: [palaceFact(target), ...(opposite ? [palaceFact(opposite)] : [])], sourceIds: ['palace', 'editorial'],
  });
  for (const star of principals) {
    const content = STAR_TOPIC_CONTENT[star.name]?.[topic];
    if (!content) { gaps.push(`Chưa có nội dung được biên soạn cho ${viLabel(star.name)} ở chủ đề này.`); continue; }
    central.push({ id: `principal-${star.name}`, title: `${viLabel(star.name)}${ownMajors.length ? ' tại bản cung' : ' ở đối cung để tham khảo'}`, text: `${content.meaning} ${content.balance}`, evidence: [starFact(principalPalace!, star)], sourceIds: ['editorial'] });
  }
  if (principals.length > 1) central.push({ id: 'co-principals', title: 'Đọc hai chính tinh cùng nhau', text: 'Hai hướng biểu đạt trên cùng xuất hiện trong một cung. Hãy đối chiếu tình huống nào làm nổi bật từng hướng; bộ đọc này chưa gán tên cách cục hoặc cho rằng hai sao tự động tăng hay triệt tiêu nhau.', evidence: principals.map(star => starFact(principalPalace!, star)), sourceIds: ['editorial'] });
  sections.push({ id: 'focus', title: 'Trọng tâm của chủ đề', items: central });

  const relations: ReadingItem[] = context.filter(item => item.offset !== 0 && item.palace).map(item => {
    const related = item.palace!;
    const role = PALACE_ROLES[clean(related.name)] ?? `chủ đề ${viLabel(related.name)}`;
    const relatedTopic = ROLE_TOPICS[clean(related.name)];
    const contextual = relatedTopic ? majors(related).map(star => STAR_TOPIC_CONTENT[star.name]?.[relatedTopic]?.meaning).filter(Boolean).join(' ') : '';
    const names = majors(related).map(star => viLabel(star.name));
    return { id: `relation-${item.offset}`, title: `${item.relation}: ${viLabel(related.name)}`, text: `Cung này đưa thêm góc nhìn về ${role}. ${contextual || (names.length ? `Chính tinh ở đây là ${names.join(', ')}; bộ nội dung hiện chưa có diễn giải riêng cho tổ hợp tại cung này.` : 'Cung này vô chính diệu; không tự gán chính tinh từ cung khác vào đây.')} Đọc như bối cảnh liên hệ với ${viLabel(target.name)}, giữ riêng vai trò của hai cung.`, evidence: [palaceFact(target), ...majors(related).map(star => starFact(related, star)), ...(names.length ? [] : [palaceFact(related)])], sourceIds: ['palace', 'editorial'] };
  });
  const ming = chart.palaces.find(palace => palace.branch === chart.mingGongBranch);
  const shen = chart.palaces.find(palace => palace.branch === chart.shenGongBranch);
  if (ming && shen) relations.push({
    id: 'ming-shen', title: 'Mệnh và vị trí Thân',
    text: ming.branch === shen.branch ? 'Mệnh và Thân cùng vị trí. Khi tự đối chiếu, có thể xem động lực cá nhân và cách duy trì hành động có đang nhất quán hay trở nên khó điều chỉnh.' : `Mệnh và Thân ở hai vị trí khác nhau. Có thể đặt động lực cá nhân cạnh chủ đề ${viLabel(shen.name)} để suy ngẫm cách ưu tiên được thể hiện qua hành động.`,
    evidence: [`Mệnh: ${palaceFact(ming)}`, `Thân cư ${palaceName(shen)}.`], sourceIds: ['palace', 'editorial'],
  });
  else gaps.push('Thiếu vị trí Mệnh hoặc Thân; bỏ qua liên hệ Mệnh–Thân.');
  sections.push({ id: 'relations', title: 'Các cung cần đọc cùng nhau', items: relations });

  const modifiers: ReadingItem[] = [];
  for (const palace of palaces) for (const star of palace.stars.filter(star => star.siHua)) {
    const huaTopic = palace.branch === target.branch ? topic : ROLE_TOPICS[clean(palace.name)] ?? 'overview';
    modifiers.push({ id: `hua-${palace.branch}-${star.name}`, title: `${viLabel(star.name)} Hóa ${viLabel(star.siHua!)} tại ${viLabel(palace.name)}`, text: `${HUA_TEXT[star.siHua!][huaTopic]} ${palace.branch === target.branch ? 'Dấu hóa nằm ngay tại bản cung của chủ đề.' : `Dấu hóa thuộc cung ${viLabel(palace.name)}; dùng làm bối cảnh liên hệ, không chuyển thành hóa tại ${viLabel(target.name)}.`} Đây là lớp bản mệnh và phải đọc theo tính chất của sao mang hóa tại cung được ghi.`, evidence: [starFact(palace, star)], sourceIds: ['mutagen', 'editorial'] });
  }
  if (!modifiers.length) modifiers.push({ id: 'no-hua', title: 'Không thấy tứ hóa trong bốn cung đang xét', text: 'Không có dấu tứ hóa bản mệnh trong vùng này theo dữ liệu nhận được. Điều đó không đồng nghĩa toàn lá số không có tứ hóa hoặc chủ đề không có biến chuyển.', evidence: palaces.map(palaceFact), sourceIds: ['mutagen', 'editorial'] });
  for (const pair of PAIRS) {
    const found = pair.names.map(name => palaces.flatMap(palace => palace.stars.filter(star => star.name === name).map(star => ({ palace, star })))[0]);
    if (found.every(Boolean)) modifiers.push({ id: `pair-${pair.id}`, title: `${pair.names.map(viLabel).join(' – ')} ${found[0].palace.branch === found[1].palace.branch ? 'đồng cung' : 'cùng trong tam phương tứ chính'}`, text: `Cả hai sao đều hiện diện trong vùng đang xét, gợi thêm câu hỏi về ${pair.theme}. ${PAIR_BALANCE[topic]} Vị trí thực của từng sao được giữ riêng; đây không phải kết luận đắc cách.`, evidence: found.map(item => starFact(item.palace, item.star)), sourceIds: ['auxiliary', 'editorial'] });
  }
  const pressure = palaces.flatMap(palace => palace.stars.filter(star => ['擎羊', '陀罗', '火星', '铃星', '地空', '地劫'].includes(star.name)).map(star => ({ palace, star })));
  if (pressure.length) modifiers.push({ id: 'pressure', title: 'Các yếu tố cần đọc thận trọng', text: 'Các sao dưới thuộc nhóm sát tinh trong cách phân loại truyền thống. Ứng dụng ghi nhận vị trí để đọc cùng chính tinh và tứ hóa; chưa có quy tắc duyệt cho mọi tổ hợp nên không suy tai họa, mất tiền hoặc đổ vỡ từ danh sách này.', evidence: pressure.map(item => starFact(item.palace, item.star)), sourceIds: ['auxiliary', 'editorial'] });
  sections.push({ id: 'modifiers', title: 'Tứ hóa và yếu tố phối hợp', items: modifiers });

  const balances: ReadingItem[] = [];
  const locatedPrincipals = principalPalace ? principals.map(star => ({ palace: principalPalace, star })) : [];
  const bright = locatedPrincipals.filter(item => ['庙', '旺'].includes(item.star.brightnessRaw ?? ''));
  const dim = locatedPrincipals.filter(item => item.star.brightnessRaw === '陷');
  if (bright.length || dim.length) balances.push({ id: 'brightness', title: 'Độ sáng điều chỉnh cách đọc', text: `${bright.length ? 'Có chính tinh ở mức Miếu/Vượng theo bảng engine. ' : ''}${dim.length ? 'Có chính tinh ở mức Hãm theo bảng engine. ' : ''}Dùng độ sáng để đặt câu hỏi về mức dễ biểu đạt của tính chất sao, không xếp hạng con người. Những mức khác được giữ nguyên nhãn trong căn cứ, không gộp thành tốt/xấu.`, evidence: locatedPrincipals.map(item => starFact(item.palace, item.star)), sourceIds: ['brightness', 'editorial'] });
  const hua = palaces.flatMap(palace => palace.stars.filter(star => star.siHua).map(star => ({ palace, star })));
  const gain = hua.filter(item => item.star.siHua === '禄');
  const concern = hua.filter(item => item.star.siHua === '忌');
  if (gain.length && concern.length) balances.push({ id: 'loc-ky', title: 'Lộc và Kỵ cùng hiện diện trong vùng đang xét', text: `${gain.some(a => concern.some(b => a.palace.branch === b.palace.branch)) ? 'Có Lộc và Kỵ đồng cung.' : 'Lộc và Kỵ nằm ở các cung khác nhau; không gọi là đồng cung.'} Đọc song song nơi muốn mở rộng và nơi dễ bận tâm. Không cộng trừ hai dấu thành một điểm số hoặc coi chúng tự hóa giải nhau.`, evidence: [...gain, ...concern].map(item => starFact(item.palace, item.star)), sourceIds: ['mutagen', 'editorial'] });
  if (!balances.length) balances.push({ id: 'limited-synthesis', title: 'Giữ riêng những điều chưa đủ căn cứ', text: 'Chưa có tổ hợp tương phản thuộc bộ quy tắc đang hỗ trợ để tổng hợp thêm. Các dữ kiện ở trên vẫn có ý nghĩa mô tả, nhưng không đủ để chốt một kết luận thuận/nghịch cho toàn chủ đề.', evidence: [palaceFact(target)], sourceIds: ['editorial'] });
  sections.push({ id: 'balance', title: 'Điểm cần cân nhắc khi tổng hợp', items: balances });
  return { version: READING_VERSION, intro: guide.intro, sections, questions: guide.questions, boundary: guide.boundary, gaps };
}
