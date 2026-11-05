import dictionary from './iztro-vi.generated.json';
/** Display-only Vietnamese labels. Computational names and IDs stay unchanged. */
const labels: Record<string, string> = {
  ...dictionary,
  '副截': 'Triệt phụ', '副旬': 'Tuần phụ',
  // Palaces
  '命宫': 'Mệnh', '兄弟宫': 'Huynh Đệ', '兄弟': 'Huynh Đệ',
  '夫妻宫': 'Phu Thê', '夫妻': 'Phu Thê', '子女宫': 'Tử Tức', '子女': 'Tử Tức',
  '财帛宫': 'Tài Bạch', '财帛': 'Tài Bạch', '疾厄宫': 'Tật Ách', '疾厄': 'Tật Ách',
  '迁移宫': 'Thiên Di', '迁移': 'Thiên Di', '交友宫': 'Nô Bộc', '交友': 'Nô Bộc', '仆役': 'Nô Bộc',
  '官禄宫': 'Quan Lộc', '官禄': 'Quan Lộc', '田宅宫': 'Điền Trạch', '田宅': 'Điền Trạch',
  '福德宫': 'Phúc Đức', '福德': 'Phúc Đức', '父母宫': 'Phụ Mẫu', '父母': 'Phụ Mẫu', '身宫': 'Thân',
  // Principal and common auxiliary stars (names are display-only).
  '紫微': 'Tử Vi', '天机': 'Thiên Cơ', '太阳': 'Thái Dương', '武曲': 'Vũ Khúc', '天同': 'Thiên Đồng',
  '廉贞': 'Liêm Trinh', '天府': 'Thiên Phủ', '太阴': 'Thái Âm', '贪狼': 'Tham Lang', '巨门': 'Cự Môn',
  '天相': 'Thiên Tướng', '天梁': 'Thiên Lương', '七杀': 'Thất Sát', '破军': 'Phá Quân',
  '左辅': 'Tả Phù', '右弼': 'Hữu Bật', '文昌': 'Văn Xương', '文曲': 'Văn Khúc', '禄存': 'Lộc Tồn', '天马': 'Thiên Mã',
  '擎羊': 'Kình Dương', '陀罗': 'Đà La', '火星': 'Hỏa Tinh', '铃星': 'Linh Tinh', '天魁': 'Thiên Khôi', '天钺': 'Thiên Việt',
  '地空': 'Địa Không', '地劫': 'Địa Kiếp', '天刑': 'Thiên Hình', '天姚': 'Thiên Diêu', '天喜': 'Thiên Hỷ',
  '天哭': 'Thiên Khốc', '天虚': 'Thiên Hư', '红鸾': 'Hồng Loan', '孤辰': 'Cô Thần', '寡宿': 'Quả Tú',
  '龙池': 'Long Trì', '凤阁': 'Phượng Các', '天福': 'Thiên Phúc', '天官': 'Thiên Quan', '天寿': 'Thiên Thọ',
  '天才': 'Thiên Tài', '天厨': 'Thiên Trù', '天伤': 'Thiên Thương', '天使': 'Thiên Sứ', '解神': 'Giải Thần',
  '阴煞': 'Âm Sát', '天巫': 'Thiên Vu', '天月': 'Thiên Nguyệt', '三台': 'Tam Thai', '八座': 'Bát Tọa',
  '恩光': 'Ân Quang', '天贵': 'Thiên Quý', '台辅': 'Đài Phụ', '封诰': 'Phong Cáo', '破碎': 'Phá Toái',
  '劫煞': 'Kiếp Sát', '天德': 'Thiên Đức', '月德': 'Nguyệt Đức', '咸池': 'Hàm Trì',
  '大耗': 'Đại Hao', '小耗': 'Tiểu Hao', '青龙': 'Thanh Long', '将军': 'Tướng Quân', '博士': 'Bác Sỹ',
  '力士': 'Lực Sỹ', '奏书': 'Tấu Thư', '喜神': 'Hỷ Thần', '病符': 'Bệnh Phù', '岁破': 'Tuế Phá', '伏兵': 'Phục Binh',
  '官符': 'Quan Phù', '丧门': 'Tang Môn', '白虎': 'Bạch Hổ', '吊客': 'Điếu Khách',
  // Stems, branches, elemental classes, and brightness.
  '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu', '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý',
  '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn', '巳': 'Tỵ', '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu', '戌': 'Tuất', '亥': 'Hợi',
  '庙': 'Miếu', '旺': 'Vượng', '得': 'Đắc', '利': 'Lợi', '平': 'Bình', '陷': 'Hãm', '不': 'Bất', '闲': 'Nhàn', '地': 'Địa',
  '空宫': 'Vô chính diệu', '庙旺': 'Miếu Vượng', '落陷': 'Lạc Hãm', '平和': 'Bình hòa',
  '水二局': 'Thủy Nhị Cục', '木三局': 'Mộc Tam Cục', '金四局': 'Kim Tứ Cục', '土五局': 'Thổ Ngũ Cục', '火六局': 'Hỏa Lục Cục',
  '五行': 'Ngũ hành', '水': 'Thủy', '木': 'Mộc', '金': 'Kim', '土': 'Thổ', '火': 'Hỏa',
  '禄': 'Lộc', '权': 'Quyền', '科': 'Khoa', '忌': 'Kỵ', '化禄': 'Hóa Lộc', '化权': 'Hóa Quyền', '化科': 'Hóa Khoa', '化忌': 'Hóa Kỵ',
  // Common UI and time labels.
  '紫微斗数命盘': 'Lá số Tử Vi', '紫微斗数': 'Tử Vi Đẩu Số', '命宫主星': 'Chính tinh cung Mệnh',
  '命格总览': 'Tổng quan mệnh cách', '当前大限': 'Đại hạn hiện tại',
  '大限运程': 'Vận trình đại hạn', '大限': 'Đại hạn', '流年': 'Lưu niên', '本命': 'Bản mệnh',
  '本命四化': 'Tứ hóa bản mệnh', '格局识别': 'Nhận diện cách cục', '格局识别（严格古书条件）': 'Cách cục (theo điều kiện cổ thư)',
  '星曜特质': 'Đặc tính sao', '古书原文': 'Nguyên văn cổ thư', '倪海厦老师解读': 'Luận giải của thầy Nghê Hải Hạ',
  '最佳宫位': 'Cung phù hợp', '注意宫位': 'Cung cần lưu ý', '事业方向': 'Hướng sự nghiệp', '感情特质': 'Đặc điểm tình cảm',
  '财运分析': 'Tài vận', '健康提示': 'Lưu ý sức khỏe', '主星': 'Chính tinh', '吉星': 'Cát tinh', '煞星': 'Sát tinh', '杂星': 'Tạp diệu',
  '必须': 'Điều kiện cần', '加分': 'Điểm cộng', '破格': 'Phá cách', '出处': 'Nguồn', '点击宫位看三方四正': 'Chọn cung để xem tam phương tứ chính',
  '凶星': 'Hung tinh', '中性偏吉': 'Trung tính, thiên cát', '中性': 'Trung tính', '凶中带吉': 'Hung nhưng có cát',
  '帝王': 'Đế vương', '尊贵': 'Tôn quý', '独立': 'Độc lập', '智慧': 'Trí tuệ', '机变': 'Ứng biến', '谋略': 'Mưu lược',
  '阳刚': 'Cương dương', '官贵': 'Quan quý', '慷慨': 'Hào sảng', '财富': 'Tài lộc', '刚毅': 'Cương nghị', '果断': 'Quyết đoán',
  '温和': 'Ôn hòa', '享福': 'Hưởng phúc', '随缘': 'Tùy duyên', '才艺': 'Tài nghệ', '刑囚': 'Hình tù', '桃花': 'Đào hoa',
  '财库': 'Kho tài', '稳重': 'Điềm đạm', '保守': 'Thận trọng', '柔美': 'Dịu dàng', '阴柔': 'Nhu hòa', '欲望': 'Ham muốn',
  '多才': 'Đa tài', '口舌': 'Khẩu thiệt', '是非': 'Thị phi', '善辩': 'Giỏi biện luận', '辅佐': 'Phò tá', '行政': 'Hành chính',
  '印绶': 'Ấn tín', '荫护': 'Che chở', '医药': 'Y dược', '长辈': 'Bậc trưởng thượng', '将星': 'Tướng tinh', '开创': 'Khai sáng',
  '变动': 'Biến động', '破坏': 'Phá cách', '果决': 'Quyết đoán', '孤克': 'Cô độc, khắc kỵ',
  '君臣庆会': 'Vua tôi hội tụ', '紫府同宫': 'Tử Vi đồng cung Thiên Phủ', '府相朝垣': 'Thiên Phủ, Thiên Tướng chầu Mệnh',
  '阳梁昌禄': 'Thái Dương, Thiên Lương, Văn Xương, Lộc Tồn', '武贪格': 'Cách Vũ Tham', '杀破狼': 'Sát Phá Tham',
  '机月同梁': 'Cơ Nguyệt Đồng Lương', '廉贞天相格': 'Cách Liêm Trinh, Thiên Tướng', '武曲七杀': 'Vũ Khúc, Thất Sát',
  '天同天梁格': 'Cách Thiên Đồng, Thiên Lương', '日月同宫': 'Nhật Nguyệt đồng cung', '日月夹命': 'Nhật Nguyệt giáp Mệnh',
  '巨日同宫': 'Cự Nhật đồng cung', '石中隐玉': 'Ngọc ẩn trong đá', '明珠出海': 'Minh châu xuất hải', '紫微入命': 'Tử Vi nhập Mệnh',
  '辅弼夹命': 'Tả Hữu giáp Mệnh', '昌曲夹命': 'Xương Khúc giáp Mệnh', '魁钺夹命': 'Khôi Việt giáp Mệnh',
  '双禄朝垣': 'Song Lộc chầu cung', '三奇加会': 'Tam Kỳ hội chiếu', '羊陀夹忌': 'Kình Đà giáp Kỵ', '火铃夹命': 'Hỏa Linh giáp Mệnh',
  '空劫夹命': 'Không Kiếp giáp Mệnh', '廉杀羊': 'Liêm Sát Dương', '巨火羊': 'Cự Hỏa Dương', '铃昌陀武': 'Linh Xương Đà Vũ',
  '马头带箭': 'Mã đầu đới tiễn', '化禄入财': 'Hóa Lộc nhập Tài', '化权入官': 'Hóa Quyền nhập Quan', '机月同梁三星会': 'Cơ Nguyệt Đồng Lương tam tinh hội',
  '辅弼同会': 'Tả Hữu đồng hội', '魁钺同会': 'Khôi Việt đồng hội', '科权双会': 'Khoa Quyền song hội',
  '个': ' mục', '岁': 'tuổi', '年': 'năm', '月': 'tháng', '日': 'ngày', '时': 'giờ', '闰': 'nhuận',
  '公历': 'Dương lịch', '农历': 'Âm lịch', '性格特质': 'Đặc điểm tính cách',
};

const tokenPattern = new RegExp(Object.keys(labels).sort((a, b) => b.length - a.length).join('|'), 'g');

/** Translate known computational labels while passing unknown text through unchanged. */
export function viLabel(text: string): string {
  return text.replace(tokenPattern, token => labels[token]);
}

export const branchNamesVi = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'] as const;
export const stemNamesVi = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'] as const;
