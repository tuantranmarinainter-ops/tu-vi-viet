import type { ZiweiChart } from './types';
import { viLabel } from '@/lib/i18n/vi';
import { getDetailedVietnameseReading, type DetailedReading } from './detailed-readings-vi';

export const READING_TOPICS = [
  { key: 'overview', label: 'Tổng quan', palace: '命宫', focus: 'cách biểu đạt bản thân và định hướng chung' },
  { key: 'personality', label: 'Tính cách', palace: '命宫', focus: 'thói quen, động lực và cách ứng xử' },
  { key: 'love', label: 'Tình cảm', palace: '夫妻', focus: 'cách xây dựng và trao đổi trong quan hệ đôi lứa' },
  { key: 'career', label: 'Sự nghiệp', palace: '官禄', focus: 'cách tổ chức công việc và phát triển năng lực' },
  { key: 'wealth', label: 'Tài chính', palace: '财帛', focus: 'thái độ đối với thu nhập, tích lũy và phân bổ nguồn lực' },
  { key: 'health', label: 'Sức khỏe', palace: '疾厄', focus: 'biểu tượng truyền thống của cung Tật Ách' },
  { key: 'family', label: 'Anh chị em', palace: '兄弟', focus: 'sự hỗ trợ và cách giữ quan hệ với anh chị em' },
  { key: 'children', label: 'Con cái', palace: '子女', focus: 'cách quan tâm và tương tác giữa các thế hệ' },
  { key: 'move', label: 'Thiên di', palace: '迁移', focus: 'cách thích nghi khi thay đổi môi trường' },
  { key: 'friends', label: 'Bạn bè', palace: '仆役', focus: 'cách cộng tác và lựa chọn quan hệ xã hội' },
  { key: 'home', label: 'Điền trạch', palace: '田宅', focus: 'cảm nhận về nơi ở, gia đình và sự ổn định' },
  { key: 'spirit', label: 'Phúc đức', palace: '福德', focus: 'đời sống tinh thần và cách tìm sự cân bằng' },
  { key: 'parents', label: 'Cha mẹ', palace: '父母', focus: 'cách giao tiếp và gắn kết với thế hệ trước' },
] as const;
export type ReadingTopic = typeof READING_TOPICS[number]['key'];

const STAR_SYMBOLS: Record<string, string> = {
  '紫微': 'Tử Vi tượng trưng cho khả năng tổ chức, trách nhiệm và nhu cầu tự chủ. Mặt cần cân bằng là xu hướng muốn kiểm soát mọi việc.',
  '天机': 'Thiên Cơ gợi khả năng phân tích, linh hoạt và tìm phương án. Cần cân bằng giữa suy tính với hành động nhất quán.',
  '太阳': 'Thái Dương gợi sự chủ động, chia sẻ và nhu cầu đóng góp. Cần tránh nhận quá nhiều trách nhiệm rồi bỏ quên giới hạn của mình.',
  '武曲': 'Vũ Khúc gợi tính thực tế, kỷ luật và chú trọng kết quả. Cách diễn đạt mềm mại giúp cân bằng sự thẳng thắn.',
  '天同': 'Thiên Đồng gợi sự hòa nhã, đồng cảm và coi trọng cảm giác an toàn. Điểm cần rèn là chủ động khi hoàn cảnh đòi hỏi thay đổi.',
  '廉贞': 'Liêm Trinh gợi cá tính, nguyên tắc và nhu cầu xác định ranh giới. Cần giữ khoảng cách giữa cảm xúc nhất thời và quyết định dài hạn.',
  '天府': 'Thiên Phủ gợi năng lực gìn giữ nguồn lực, tính ổn định và tinh thần quản lý. Cần cân bằng sự thận trọng với khả năng thử điều mới.',
  '太阴': 'Thái Âm gợi tính quan sát, sự tinh tế và đời sống nội tâm. Cần diễn đạt nhu cầu rõ ràng thay vì chỉ mong người khác tự hiểu.',
  '贪狼': 'Tham Lang gợi nhu cầu trải nghiệm, giao tiếp và khám phá nhiều mối quan tâm. Cần chọn ưu tiên để giữ sự tập trung.',
  '巨门': 'Cự Môn gợi khả năng đặt câu hỏi, phản biện và diễn đạt. Cách chọn thời điểm, bằng chứng và lời nói ảnh hưởng tới hiệu quả trao đổi.',
  '天相': 'Thiên Tướng gợi tinh thần hỗ trợ, tính công bằng và khả năng phối hợp. Cần cân bằng việc giúp người khác với quyền quyết định của mình.',
  '天梁': 'Thiên Lương gợi tinh thần bảo trợ, nguyên tắc và coi trọng kinh nghiệm. Cần tránh áp chuẩn riêng lên hoàn cảnh của người khác.',
  '七杀': 'Thất Sát gợi sự quyết đoán, độc lập và sẵn sàng xử lý thay đổi. Cần bổ sung thời gian đánh giá hệ quả trước quyết định lớn.',
  '破军': 'Phá Quân gợi khuynh hướng cải tổ, thử cách mới và rời bỏ cấu trúc cũ. Kế hoạch dự phòng giúp thay đổi diễn ra có kiểm soát.',
};

const cleanPalace = (value: string) => value.replace(/宫$/, '').replace('交友', '仆役');

export interface VietnameseReading { title: string; evidence: string[]; paragraphs: string[]; detailed?: DetailedReading }

export function getVietnameseReading(chart: ZiweiChart, topic: ReadingTopic): VietnameseReading {
  const definition = READING_TOPICS.find(item => item.key === topic) ?? READING_TOPICS[0];
  const detailed = topic === 'overview' || topic === 'career' || topic === 'wealth' || topic === 'love' ? getDetailedVietnameseReading(chart, topic) : undefined;
  const palace = chart.palaces.find(item => cleanPalace(item.name) === cleanPalace(definition.palace));
  if (!palace) return { title: definition.label, evidence: [], paragraphs: ['Chưa xác định được cung tương ứng trong lá số.'], detailed };
  const majors = palace.stars.filter(star => star.type === 'major');
  const evidence = [
    `Cung ${viLabel(palace.name)} ở ${viLabel(['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][palace.branch])}.`,
    majors.length ? `Chính tinh: ${majors.map(star => `${viLabel(star.name)}${star.brightnessRaw ? ` (${viLabel(star.brightnessRaw)})` : ''}`).join(', ')}.` : 'Cung vô chính diệu.',
    ...palace.stars.filter(star => star.siHua).map(star => `${viLabel(star.name)} có Hóa ${viLabel(star.siHua!)} tại cung này.`),
  ];
  const paragraphs = [`Chủ đề này nhìn vào ${definition.focus}. Những dòng dưới là diễn giải biểu tượng từ các sao thực sự hiện trên cung, không phải bài luận chuyên gia hay dự đoán một sự kiện.`];
  if (majors.length) paragraphs.push(...majors.map(star => STAR_SYMBOLS[star.name]).filter(Boolean));
  else paragraphs.push(`Vô chính diệu không có nghĩa là “không có” hay “xấu”. Có thể tham khảo chính tinh ở cung đối diện${palace.borrowedStars?.length ? `: ${palace.borrowedStars.map(viLabel).join(', ')}` : ''}; cần đọc cùng toàn bộ lá số.`);
  const support = palace.stars.filter(star => star.type === 'lucky').map(star => viLabel(star.name));
  const challenges = palace.stars.filter(star => star.type === 'sha').map(star => viLabel(star.name));
  if (support.length) paragraphs.push(`Nhóm sao hỗ trợ hiện diện: ${support.join(', ')}. Không suy ra kết quả tốt chỉ từ một sao; cần xét tổ hợp và hoàn cảnh.`);
  if (challenges.length) paragraphs.push(`Nhóm sao thường được đọc như yếu tố thử thách: ${challenges.join(', ')}. Đây không phải bằng chứng cho tai họa hoặc một biến cố chắc chắn.`);
  if (topic === 'health') paragraphs.push('Lá số không dùng để xác định bệnh, cơ quan tổn thương, tuổi thọ hay cách điều trị. Khi có triệu chứng, hãy dựa vào khám và tư vấn chuyên môn.');
  if (topic === 'wealth') paragraphs.push('Không suy ra mức giàu nghèo hoặc quyết định đầu tư từ cấu hình này. Dòng tiền, chi phí và mức chịu rủi ro cần được đánh giá bằng dữ liệu thực tế.');
  if (['family', 'children', 'parents', 'love'].includes(topic)) paragraphs.push('Không dùng một cung để kết luận số con, tình trạng của người thân hoặc tương lai một mối quan hệ. Đối thoại và hoàn cảnh thực tế cần được đặt trước cách diễn giải biểu tượng.');
  return { title: definition.label, evidence, paragraphs, detailed };
}
