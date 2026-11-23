/**
 * Nguồn: Renhuai123/ziwei-doushu, tệp `lib/nihai/diji.ts` (bản 39c0abd, 21/11/2026)
 * https://github.com/Renhuai123/ziwei-doushu/blob/39c0abd/lib/nihai/diji.ts
 * Tác giả nội dung: Nghê Hải Hạ (倪海厦) và người biên soạn repo gốc.
 * Bản dịch tiếng Việt, CC BY-NC-SA 4.0, không dùng thương mại.
 * Khóa dữ liệu (id, category, slug, status, icon) giữ nguyên.
 *
 * Địa Kỷ — cơ sở dữ liệu hệ thống địa lý phong thủy của Nghê Hải Hạ
 *
 * “Dưới biết địa lý” — Địa Kỷ (地纪) là nghiên cứu có hệ thống về địa lý chí.
 * Nghê Hải Hạ dự định sau 60 tuổi mới trước tác, dùng kiến thức thiên văn địa lý và hiểu biết y học
 * để viết lại địa lý chí của các nước, nghiên cứu mối quan hệ giữa tính người, sản vật của một quốc gia với phong thủy địa lý.
 *
 * Thầy Nghê qua đời năm 2012, Địa Kỷ chưa hoàn thành, là “sự nghiệp dang dở của thầy Nghê”.
 * Nội dung hiện có lấy từ phần kham dư học trong khóa Thiên Kỷ và di cảo do người sau chỉnh lý.
 */

import type { NiModule } from './types';

// ─── Các mô-đun Địa Kỷ ───────────────────────────────────
export const DIJI_MODULES: NiModule[] = [
  {
    id: 'dj-guojiadili',
    category: 'diji',
    name: 'Địa lý chí các quốc gia',
    nameEn: 'National Geography',
    subtitle: 'Sự nghiệp dang dở của thầy Nghê · Đọc di cảo',
    description: 'Thầy Nghê dự định dùng kiến thức phong thủy địa lý để giải thích ảnh hưởng của môi trường địa lý các nước tới tính cách người dân, tài nguyên sản vật và sự thịnh suy của vận nước. Đây là tâm nguyện lớn thầy Nghê chưa hoàn thành.',
    details: [
      'Địa Kỷ là phần được dự định hoàn thành sau cùng trong ba bộ trước tác của Nghê Hải Hạ, ban đầu định bắt đầu viết sau 60 tuổi.',
      'Ý tưởng cốt lõi là dùng kiến thức phong thủy địa lý viết lại địa lý chí các nước, áp dụng kham dư học truyền thống ở tầm vĩ mô quốc gia.',
      'Hướng nghiên cứu gồm: vị trí địa lý, núi sông của một nước định hình tính cách người dân ra sao, quan hệ giữa tài nguyên sản vật với cục thế phong thủy, liên hệ giữa thịnh suy lịch sử và biến đổi địa lý.',
      'Thầy Nghê qua đời năm 2012, Địa Kỷ chỉ để lại ý tưởng ban đầu và nền tảng lý thuyết kham dư trong khóa Thiên Kỷ. Những tia lửa tư tưởng quý giá này đáng để người sau chỉnh lý và truyền lại.',
    ],
    references: [
      'Phần kham dư học trong 《Thiên Kỷ》 của Nghê Hải Hạ',
      'Ý tưởng địa lý chí trong các bài giảng của Nghê Hải Hạ',
    ],
    keywords: ['Địa Kỷ', 'địa lý quốc gia', 'phong thủy', 'địa lý chí', 'vận nước', 'sản vật', 'tính người', 'kham dư'],
    icon: '⊞',
    status: 'preview',
    order: 1,
    slug: 'geography',
    chapters: [
      {
        id: 'dj-dl-01',
        title: 'Ý tưởng Địa Kỷ',
        subtitle: 'Tâm nguyện và bản phác thảo của thầy Nghê',
        description: 'Ý tưởng tổng thể của thầy Nghê về Địa Kỷ — dùng kiến thức phong thủy địa lý để giải thích vận mệnh quốc gia.',
        keyPoints: [
          'Dự định trước tác sau 60 tuổi (thầy Nghê sinh năm 1954)',
          'Kết hợp kiến thức thiên văn địa lý với hiểu biết y học',
          'Viết lại địa lý chí các nước',
          'Nghiên cứu quan hệ giữa tính người, sản vật với phong thủy địa lý',
        ],
        quotes: ['Tôi muốn sau sáu mươi tuổi sẽ dùng kiến thức thiên văn địa lý và hiểu biết y học của mình để viết lại địa lý chí'],
        order: 1,
      },
      {
        id: 'dj-dl-02',
        title: 'Địa lý và tính người',
        subtitle: 'Đất nào người nấy',
        description: 'Các môi trường địa lý khác nhau định hình tính cách dân tộc và đặc trưng văn hóa khác nhau như thế nào.',
        keyPoints: [
          'Khác biệt tính cách giữa dân tộc vùng núi và dân tộc vùng đồng bằng',
          'Ảnh hưởng của sự phân bố sông ngòi tới văn minh nông nghiệp',
          'Quan hệ giữa đới khí hậu với thể chất, tính cách con người',
          'Nơi phong thủy tốt ắt có người hiền xuất hiện',
        ],
        order: 2,
      },
    ],
  },
  {
    id: 'dj-kanyu-theory',
    category: 'diji',
    name: 'Nền tảng lý thuyết kham dư',
    nameEn: 'Feng Shui Theory',
    subtitle: 'Kham dư học trong Thiên Kỷ · Chỉnh lý lý thuyết',
    description: 'Chỉnh lý từ phần lý thuyết kham dư trong khóa Thiên Kỷ, làm nền tảng lý thuyết cho Địa Kỷ. Gồm các lý thuyết cốt lõi như loan đầu học, lý khí học, dương trạch học.',
    details: [
      'Tuy Địa Kỷ chưa thành sách riêng, khóa Thiên Kỷ đã chứa nhiều nội dung lý thuyết kham dư phong phú.',
      'Các lý thuyết này là khung nền của Địa Kỷ, bao quát phương pháp phân tích phong thủy từ vi mô (nhà ở) đến vĩ mô (thành phố, quốc gia).',
      'Thầy Nghê theo phái Cửu Tinh (dòng Dương Cứu Bần), coi trọng ngang nhau loan đầu và lý khí.',
      'Phần nội dung này có thể xem là “lớp dự bị lý thuyết” của Địa Kỷ, cung cấp phương pháp luận cho việc nghiên cứu địa lý chí quốc gia về sau.',
    ],
    school: 'Phái Cửu Tinh (dòng Dương Cứu Bần)',
    references: [
      '《Thiên Kỷ · Địa Mạch Đạo》 của Nghê Hải Hạ',
      'Điển tịch phong thủy của Dương Cứu Bần',
    ],
    keywords: ['kham dư', 'lý thuyết phong thủy', 'loan đầu', 'lý khí', 'phái Cửu Tinh', 'Dương Cứu Bần', 'dương trạch', 'âm trạch'],
    icon: '◫',
    status: 'active',
    order: 2,
    slug: 'kanyu-theory',
    chapters: [
      {
        id: 'dj-kt-01',
        title: 'Loan đầu học',
        subtitle: 'Xét hình núi thế nước',
        description: 'Quan sát hình dạng, hướng chạy của núi, hướng chảy của nước và các địa mạo tự nhiên khác để đoán cát hung phong thủy.',
        keyPoints: [
          'Long mạch: thế chạy và khí mạch của dãy núi',
          'Huyệt vị: vị trí tốt nhất tàng phong tụ khí',
          'Sa thủ: thế núi ôm quanh hai bên trái phải huyệt',
          'Thủy khẩu: phương vị nước chảy vào và ra',
        ],
        order: 1,
      },
      {
        id: 'dj-kt-02',
        title: 'Lý khí học',
        subtitle: 'Suy tính cát hung theo phương vị',
        description: 'Dùng la bàn đo phương vị, kết hợp các lý thuyết Cửu tinh phi bố, Bát sát Hoàng tuyền để suy cát hung.',
        keyPoints: [
          'Cách dùng la bàn',
          'Nguyên lý Cửu tinh phi bố',
          'Các phương vị cấm kỵ Bát sát Hoàng tuyền',
          'Các phương vị tốt Tam cát Lục tú',
        ],
        order: 2,
      },
      {
        id: 'dj-kt-03',
        title: 'Ứng dụng dương trạch',
        subtitle: 'Thực hành phong thủy cho môi trường sống',
        description: 'Cách áp dụng thực tế lý thuyết kham dư vào việc chọn và bố trí nhà ở.',
        keyPoints: [
          'Nguyên tắc chọn tọa hướng nhà',
          'Sắp xếp phương vị các khu chức năng trong nhà',
          'Đoán cát hung của môi trường xung quanh',
          'Cách hóa giải phong thủy xấu',
        ],
        order: 3,
      },
    ],
  },
  {
    id: 'dj-yigao',
    category: 'diji',
    name: 'Di cảo và người học sau',
    nameEn: 'Legacy & Continuation',
    subtitle: 'Người sau bổ chú · Truyền lửa',
    description: 'Chỉnh lý những lời giảng rời rạc của thầy Nghê về Địa Kỷ, các bổ chú nghiên cứu của học trò đời sau, và phần mở rộng hiện đại của tư tưởng Địa Kỷ.',
    details: [
      'Tuy thầy Nghê chưa hoàn thành chuyên khảo Địa Kỷ, trong khóa Thiên Kỷ và các dịp khác thầy nhiều lần nhắc tới ý tưởng và điểm chính của Địa Kỷ.',
      'Học trò và nhà nghiên cứu đời sau, dựa trên lời giảng và di cảo của thầy Nghê, đã chỉnh lý và bổ chú ở một mức độ nhất định.',
      'Tư tưởng Địa Kỷ có giá trị tham khảo quan trọng trong các lĩnh vực như nghiên cứu phong thủy hiện đại, quy hoạch đô thị, khoa học môi trường.',
      'Mô-đun này nhằm thu thập, chỉnh lý mọi tư liệu rải rác liên quan tới Địa Kỷ, làm nền cho nghiên cứu về sau.',
    ],
    references: [
      'Ghi chép thực tế bài giảng của Nghê Hải Hạ',
      'Ghi chép và nghiên cứu của học trò đời sau',
    ],
    keywords: ['di cảo', 'người học sau', 'bổ chú', 'truyền thừa', 'ứng dụng hiện đại'],
    icon: '⊟',
    status: 'coming',
    order: 3,
    slug: 'legacy',
    chapters: [
      {
        id: 'dj-yg-01',
        title: 'Ngữ lục Địa Kỷ của thầy Nghê',
        subtitle: 'Tư tưởng Địa Kỷ rải rác trong các khóa học',
        description: 'Trích các luận thuật quan trọng của thầy Nghê về Địa Kỷ từ các khóa Thiên Kỷ, Nhân Kỷ.',
        keyPoints: [
          'Động cơ sáng tác và kế hoạch của Địa Kỷ',
          'Quan sát về môi trường địa lý các nước',
          'Luận thuật về quan hệ giữa phong thủy và vận nước',
          'Liên hệ giữa Địa Kỷ với Thiên Kỷ, Nhân Kỷ',
        ],
        quotes: [
          'Nỗ lực nhân sự cộng với điều chỉnh về địa lý nhất định có thể lớn hơn vận mệnh tiên thiên',
          '2/3 lớn hơn 1/3 — nhân sự + địa lý = 2/3, vận mệnh tiên thiên = 1/3',
        ],
        order: 1,
      },
    ],
  },
];

// ─── Thống kê ────────────────────────────────────────────
export const DIJI_STATS = {
  totalModules: DIJI_MODULES.length,
  totalChapters: DIJI_MODULES.reduce((sum, m) => sum + m.chapters.length, 0),
  status: 'Sự nghiệp dang dở của thầy Nghê · Người sau tiếp tục chỉnh lý',
  note: 'Nghê Hải Hạ dự định sau 60 tuổi mới viết Địa Kỷ, qua đời năm 2012, Địa Kỷ chỉ để lại ý tưởng và nền tảng lý thuyết',
};
