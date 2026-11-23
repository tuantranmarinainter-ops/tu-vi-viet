/**
 * Nguồn: Renhuai123/ziwei-doushu, tệp `lib/nihai/types.ts` (bản 39c0abd, 21/11/2026)
 * https://github.com/Renhuai123/ziwei-doushu/blob/39c0abd/lib/nihai/types.ts
 * Tác giả nội dung: Nghê Hải Hạ (倪海厦) và người biên soạn repo gốc.
 * Bản dịch tiếng Việt, CC BY-NC-SA 4.0, không dùng thương mại.
 * Chỉ dịch chú thích; tên kiểu, tên trường và giá trị literal giữ nguyên.
 *
 * Nghê Hải Hạ — Thiên Kỷ / Địa Kỷ / Nhân Kỷ — định nghĩa kiểu dùng chung
 */

/** Phân loại Tam Kỷ */
export type SanJiCategory = 'tianji' | 'diji' | 'renji';

/** Khóa học / mô-đun */
export interface NiModule {
  id: string;
  category: SanJiCategory;
  /** Tên (bản gốc: tên tiếng Trung; bản dịch: tên tiếng Việt) */
  name: string;
  /** Tên tiếng Anh */
  nameEn: string;
  /** Phụ đề ngắn */
  subtitle: string;
  /** Mô tả tóm tắt */
  description: string;
  /** Giới thiệu chi tiết (nhiều đoạn) */
  details: string[];
  /** Thuộc trường phái */
  school?: string;
  /** Thông tin số buổi học */
  lessons?: string;
  /** Sách tham khảo */
  references: string[];
  /** Khái niệm cốt lõi / từ khóa */
  keywords: string[];
  /** Ký tự biểu tượng */
  icon: string;
  /** Trạng thái */
  status: 'active' | 'preview' | 'coming';
  /** Trọng số sắp xếp */
  order: number;
  /** Slug định tuyến */
  slug: string;
  /** Các chương con */
  chapters: NiChapter[];
}

/** Chương */
export interface NiChapter {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  /** Ý chính cốt lõi */
  keyPoints: string[];
  /** Lời thầy Nghê */
  quotes?: string[];
  /** Thứ tự */
  order: number;
}

/** Sáu mươi tư quẻ Kinh Dịch */
export interface Hexagram {
  number: number;
  name: string;
  /** Mô tả tượng quẻ, ví dụ “Thiên Trạch Lý” */
  composition: string;
  /** Quẻ thượng */
  upper: string;
  /** Quẻ hạ */
  lower: string;
  /** Ý chính lời quẻ */
  meaning: string;
  /** Ý chính lời giảng của thầy Nghê */
  niInterpretation: string;
  /** Yếu quyết đoán sự */
  divination: string;
}

/** Mục kham dư */
export interface FengShuiEntry {
  id: string;
  title: string;
  category: 'yangzhai' | 'yinzhai' | 'theory';
  description: string;
  keyPoints: string[];
}

/** Mục Trung y trong Nhân Kỷ */
export interface MedicalEntry {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  keyPoints: string[];
  relatedHerbs?: string[];
  relatedAcupoints?: string[];
}

/** Kinh nghiệm huyệt châm cứu */
export interface AcuExperience {
  id: number;
  /** Chứng thích ứng / bệnh */
  condition: string;
  /** Tổ hợp huyệt */
  acupoints: string;
  /** Phân loại */
  category: string;
  /** Ghi chú bổ sung */
  note?: string;
}

/** Phép thấu châm thấu huyệt */
export interface TransNeedling {
  id: number;
  /** Tổ hợp thấu huyệt: A thấu B */
  combo: string;
  /** Triệu chứng điều trị */
  indication: string;
  /** Huyệt phối */
  supporting?: string;
  /** Nguồn */
  source: string;
}

/** Bài thuốc Hán Đường */
export interface HantangFormula {
  id: number;
  /** Tên bài (ví dụ “Bạch đới hoàn”, “Đại Vũ hoàn”) */
  name: string;
  /** Bệnh chủ trị */
  indication: string;
  /** Lý luận cốt lõi (một câu) */
  theory?: string;
  /** Thành phần chính (phần công khai) */
  ingredients?: string;
}

/** Kinh phương kinh điển */
export interface ClassicFormula {
  id: string;
  /** Tên bài */
  name: string;
  /** Xuất xứ */
  source: string;
  /** Thành phần vị thuốc */
  composition: string;
  /** Chủ trị */
  indication: string;
  /** Ý chính cách dùng của thầy Nghê */
  niUsage?: string;
}

/** Cấu trúc các tập của khóa Thiên Kỷ */
export interface TianjiEpisode {
  /** Số DVD 1-24 */
  dvd: number;
  /** Chủ đề nửa đầu */
  firstHalf: string;
  /** Chủ đề nửa sau */
  secondHalf: string;
  /** Nội dung then chốt */
  highlights: string[];
}
