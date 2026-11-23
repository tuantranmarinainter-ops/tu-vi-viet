/**
 * Nguồn: Renhuai123/ziwei-doushu, tệp `lib/nihai/index.ts` (bản 39c0abd, 21/11/2026)
 * https://github.com/Renhuai123/ziwei-doushu/blob/39c0abd/lib/nihai/index.ts
 * Tác giả nội dung: Nghê Hải Hạ (倪海厦) và người biên soạn repo gốc.
 * Bản dịch tiếng Việt, CC BY-NC-SA 4.0, không dùng thương mại.
 * Khóa dữ liệu giữ nguyên, kể cả các khóa tiếng Trung trong `personality`
 * (算命风格 = phong cách xem số, 音乐爱好 = sở thích âm nhạc, 生活技能 = kỹ năng sống,
 *  工作态度 = thái độ làm việc, 睡眠 = giấc ngủ, 患者评价 = bệnh nhân đánh giá).
 *
 * Nghê Hải Hạ — Thiên Kỷ / Địa Kỷ / Nhân Kỷ — xuất chung
 *
 * Nghê Hải Hạ (1954-2012), người sáng lập Học viện Trung y Hán Đường (Hoa Kỳ),
 * bậc kỳ nhân hiếm thấy thời nay tinh thông đủ ngũ thuật “Mệnh, Tướng, Bốc, Sơn, Y”.
 *
 * Hệ thống Tam Kỷ:
 *   Thiên Kỷ —— trên biết thiên văn (Tử Vi Đẩu Số, Kinh Dịch, kham dư, thôi mệnh, diện tướng, chiết tự)
 *   Địa Kỷ —— dưới biết địa lý (địa lý chí quốc gia, phong thủy và vận nước)
 *   Nhân Kỷ —— giữa biết nhân sự (châm cứu, Hoàng Đế Nội Kinh, Thần Nông Bản Thảo Kinh, Thương Hàn Luận, Kim Quỹ Yếu Lược)
 */

export * from './types';
export { TIANJI_MODULES, HEXAGRAMS, FENGSHUI_ENTRIES, TIANJI_EPISODES, TIANJI_QUOTES, TIANJI_STATS } from './tianji';
export { RENJI_MODULES, ACU_EXPERIENCES, TRANS_NEEDLING, HANTANG_FORMULAS, CLASSIC_FORMULAS, RENJI_STATS } from './renji';
export { DIJI_MODULES, DIJI_STATS } from './diji';

/** Tiểu sử đầy đủ của Nghê Hải Hạ */
export const NI_HAIXIA_BIO = {
  name: 'Nghê Hải Hạ',
  nameVariant: 'Nghê Hải Hạ (倪海夏, biến thể tự dạng)',
  alias: 'Phạn Vũ Long',
  birth: '01/01/1954',
  death: '31/01/2012',
  birthPlace: 'Thành phố Đài Bắc',
  ancestry: 'Thụy An, Chiết Giang',
  family: 'Bảy anh chị em, thứ năm',
  education: 'Khoa Chính trị, Đại học Đông Ngô',
  title: 'Người sáng lập Học viện Trung y Hán Đường (Hoa Kỳ)',
  titles: [
    'Bậc kỳ nhân tinh thông đủ ngũ thuật Mệnh, Tướng, Bốc, Sơn, Y',
    'Viện trưởng Học viện Trung y Hán Đường (Hoa Kỳ)',
    'Giáo sư hướng dẫn tiến sĩ, Đại học Trung y dược California (Hoa Kỳ)',
    'Ủy viên cao nhất Ủy ban Trung y thuộc Sở Y tế bang Florida (2000-2003)',
    'Ủy viên kiêm Phó chủ tịch Ủy ban Châm cứu bang Florida',
    'Người kế thừa hiện đại của phái Kinh phương',
    'Người sáng lập hệ thống giảng dạy Thiên Kỷ, Nhân Kỷ',
    'Người nhận giải Hoa kiều ưu tú ở hải ngoại',
  ],
  /** Quan hệ thầy trò */
  teachers: [
    { name: 'Chu Tả Vũ', background: 'Danh y bốn đời gia truyền ở Bắc Kinh, sau năm 1949 sang Đài Loan', subject: 'Châm cứu', period: '1977-1981' },
    { name: 'Từ Tế Dân', background: 'Danh y Thượng Hải, quê Giang Tô', subject: 'Châm cứu', period: '1970s' },
    { name: 'Truyền thừa Khương Tá Cảnh', background: 'Nhà kinh phương học theo Tào Dĩnh Phủ', subject: 'Kinh phương', period: 'Thời làm học việc ở hiệu thuốc Bắc tại Cơ Long' },
  ],
  /** Lý niệm cốt lõi */
  corePhilosophy: [
    'Đại đạo chí giản — phi tinh bay tới bay lui quá phức tạp, không làm cái đó',
    'Cung Mệnh là gốc, tam phương là dụng',
    'Nỗ lực nhân sự + điều chỉnh địa lý > vận mệnh tiên thiên (2/3 > 1/3)',
    'Trung y là y học vật lý, phân tích cơ thể người từ góc độ vật lý',
    'Biện chứng chứ không biện bệnh — Trung y xem thể chứng chứ không xem tên bệnh',
    'Kinh phương một thang biết, hai thang khỏi',
    'Không muốn văn hóa Trung Hoa thất truyền nên đã dạy nhiều học trò',
    'Xem số chính là một môn triết học bàn về quả',
    'Chữ nghĩa chỉ là con thuyền, chân lý mới là bờ bên kia',
  ],
  /** Các mốc lớn trong đời */
  timeline: [
    { year: '1954', event: 'Sinh tại thành phố Đài Bắc, quê gốc Thụy An, Chiết Giang' },
    { year: '1970s', event: 'Thời trung học dùng 《Y Tông Kim Giám》 chữa khỏi chứng đau bụng kinh cho chị hai, quyết chí học y' },
    { year: '1977-1981', event: 'Học châm cứu với thầy thuốc Chu Tả Vũ' },
    { year: '1978', event: 'Phục vụ quân ngũ tại Ban quân y Mã Tổ, được gọi là “thần y Mã Tổ”, khi ấy 24 tuổi' },
    { year: '1979', event: 'Sau khi xuất ngũ, lấy biệt danh “Phạn Vũ Long” bắt đầu nghề xem số xem tướng' },
    { year: '1980', event: 'Di cư sang Hoa Kỳ' },
    { year: '1988', event: 'Mở “lớp Thiên văn Địa lý” ở đường Kim Sơn Nam, Đài Bắc, dạy Tử Vi Đẩu Số và phong thủy dương trạch' },
    { year: '1991', event: 'Trở thành châm cứu sư đăng ký tại bang Florida, Hoa Kỳ' },
    { year: '1993', event: 'Chọn khu đất cho Học viện Trung y Hán Đường tại Merritt Island, Florida' },
    { year: '1994', event: 'Hoàn thành ghi hình bộ 《Thiên Kỷ》, tổng cộng 24 tập' },
    { year: '1995', event: 'Sáng lập Học viện Trung y Hán Đường' },
    { year: '2000-2003', event: 'Giữ chức ủy viên cao nhất Ủy ban Trung y thuộc Sở Y tế bang Florida' },
    { year: '2004', event: 'Mở lớp giảng dạy Trung y 《Nhân Kỷ》 tại Đài Bắc' },
    { year: '2005', event: 'Phát hành bộ DVD giảng dạy 《Nhân Kỷ》' },
    { year: '2007', event: 'Bắt đầu viết 《Địa Kỷ》' },
    { year: '2010', event: 'Lập phòng khám Trung y kinh phương Hán Đường Đài Bắc; được mời diễn giảng trọn ngày tại Diễn đàn Phù Dương lần thứ ba' },
    { year: '2011', event: 'Lập Trung y quán kinh phương Hán Đường Thâm Quyến' },
    { year: '2012', event: 'Ngày 31 tháng 1 qua đời tại Đài Bắc do suy tim phổi, hưởng thọ 59 tuổi' },
  ],
  /** Hệ thống trước tác */
  publications: {
    originalBooks8: ['Hoàng Đế Nội Kinh Tố Vấn', 'Hoàng Đế Nội Kinh', 'Thần Nông Bản Thảo Kinh', 'Châm cứu', 'Thương Hàn Luận', 'Kim Quỹ', 'Nhân Gian Đạo', 'Thiên Cơ Đạo · Địa Mạch Đạo'],
    totalBooks: '26-44 cuốn (gồm giáo trình bản chú giải, toàn tập y án, tinh giải huyệt vị…)',
    hantangFormulas: '100 phương Hán Đường',
    classicFormulas: '259 phương thuốc kinh điển',
    medicalCases: 'Toàn tập y án 7 cuốn',
    totalVideoHours: '200+ giờ',
  },
  /** Hệ thống Tam Kỷ */
  sanJi: {
    tianji: {
      name: 'Thiên Kỷ',
      meaning: 'Trên biết thiên văn',
      content: 'Tử Vi Đẩu Số, 64 quẻ Kinh Dịch, kham dư học, thôi mệnh học, diện tướng học, thuật chiết tự',
      recordYear: 1994,
      episodes: 24,
      hdEpisodes: 83,
      hoursPerEpisode: 2,
      totalHours: 48,
      books: ['Thiên Cơ Đạo', 'Nhân Gian Đạo', 'Địa Mạch Đạo', 'Dịch đồ 64 quẻ'],
      schools: ['Phái Tam Hợp (Tử Vi Đẩu Số)', 'Phái Tượng Số (Kinh Dịch)', 'Phái Cửu Tinh (kham dư)', 'Phái Hà Lạc lý số (thôi mệnh)'],
      structure: 'Giờ đầu giảng mệnh học, giờ sau giảng Kinh Dịch',
    },
    renji: {
      name: 'Nhân Kỷ',
      meaning: 'Giữa biết nhân sự',
      content: 'Châm Cứu Đại Thành (44 tập), Hoàng Đế Nội Kinh (20 tập), Thần Nông Bản Thảo Kinh (46 tập), Thương Hàn Luận, Kim Quỹ Yếu Lược (20 tập)',
      completionYear: '2004-2005',
      totalLessons: '150+ tập',
      learningOrder: 'Châm cứu → Hoàng Đế Nội Kinh → Thần Nông Bản Thảo Kinh → Thương Hàn Luận → Kim Quỹ Yếu Lược',
      acuExperience: 215,
      transNeedling: 31,
      hantangFormulas: 100,
    },
    diji: {
      name: 'Địa Kỷ',
      meaning: 'Dưới biết địa lý',
      content: 'Địa lý chí các quốc gia (chưa hoàn thành)',
      status: 'Sự nghiệp dang dở của thầy Nghê',
      note: 'Dự định trước tác sau 60 tuổi, qua đời năm 2012',
      startYear: 2007,
      existingContent: 'Phần kham dư học trong khóa Thiên Kỷ + di cảo do người sau chỉnh lý',
    },
  },
  /** Đặc điểm nhân cách */
  personality: {
    算命风格: 'Đoán thẳng như đinh đóng cột, không chừa đường lui',
    音乐爱好: 'Thích nhất bài 《Hotel California》 của ban nhạc Eagles',
    生活技能: 'Nấu ăn giặt giũ việc gì cũng thạo, tay nghề làm bánh bột ai cũng khen',
    工作态度: 'Đầu giường quanh năm để sẵn giấy bút, gặp bệnh khó thì khấn nguyện các bậc tiên sư',
    睡眠: 'Nhiều năm ngủ đêm không quá ba tiếng',
    患者评价: 'Thường được bệnh nhân Mỹ gọi là “hy vọng cuối cùng (The last hope)”',
  },
  /** Tiêu chuẩn chọn người truyền nghề */
  discipleStandards: [
    'Tâm tính tốt',
    'Cá tính mạnh',
    'Chính kiến mạnh',
    'Óc quan sát nhạy bén',
    'Dám phê phán lý thuyết sai',
  ],
};

/** Điều hướng Tam Kỷ */
export const SANJI_CATEGORIES = [
  { key: 'tianji' as const, name: 'Thiên Kỷ', nameEn: 'Tian Ji', icon: '⊙', meaning: 'Trên biết thiên văn', color: '#d4a843', href: '/tianji' },
  { key: 'diji' as const, name: 'Địa Kỷ', nameEn: 'Di Ji', icon: '⊞', meaning: 'Dưới biết địa lý', color: '#6b8a5e', href: '/diji' },
  { key: 'renji' as const, name: 'Nhân Kỷ', nameEn: 'Ren Ji', icon: '⊕', meaning: 'Giữa biết nhân sự', color: '#8b6b9e', href: '/renji' },
] as const;
