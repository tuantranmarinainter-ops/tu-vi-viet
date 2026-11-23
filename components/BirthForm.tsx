'use client';
import { useEffect, useMemo, useState } from 'react';
import type { BirthInfo } from '@/lib/ziwei/types';
import { formToBirthInfo, normalizeBirthForm } from '@/lib/ziwei/share';
import { VIETNAM_PLACES } from '@/lib/ziwei/profiles';
import { formatTrueSolarClock } from '@/lib/ziwei/true-solar-time';
import { branchNamesVi } from '@/lib/i18n/vi';
import { historicalHint, type BirthRegion } from '@/lib/ziwei/historical-time';
import { canChi } from '@/lib/la-so/ten-viet';
import './la-so/form.css';

export interface BirthFormState {
  name: string; year: string; month: string; day: string;
  clockHour: string; clockMinute: string; unknownTime: boolean;
  province: string; city: string; longitude: number; gender: 'male' | 'female';
  calendarSystem?: 'vietnam' | 'chinese';
  inputCalendar?: 'solar' | 'lunar'; lunarLeap?: boolean;
  utcOffsetMinutes?: number;
  timeConvention?: 'clock' | 'solar' | 'legacy-longitude';
  lateZishi?: 'next-day' | 'current-day';
  leapMonthPolicy?: 'split' | 'prev-month' | 'next-month' | 'origin-month';
  engineVersion?: 'current' | 'v4';
  locationConfirmed?: boolean;
  birthRegion?: BirthRegion;
  /** Năm xem mặc định cho lá số (dương lịch). */
  namXem?: string;
  anHoTen?: boolean;
  anNgaySinh?: boolean;
  /** Mô tả bản thân — chỉ lưu trên máy và in kèm PDF, không đưa vào liên kết. */
  moTa?: string;
  /** Giờ sinh theo chi (0=Tý … 11=Hợi), chỉ dùng khi nhập âm lịch. */
  gioChi?: number;
}

interface BirthFormProps {
  onSubmit: (info: BirthInfo) => void; loading?: boolean;
  /** Xem trước: lập lá số nhưng không lưu vào lịch sử. */
  onPreview?: (info: BirthInfo) => void;
  initialData?: Partial<BirthFormState>; onFormSave?: (data: BirthFormState) => void;
  hideSubmit?: boolean;
}

const THANG_AM = ['Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Một', 'Chạp'];
const CHI_GIO = ['Tý (23–01)', 'Sửu (01–03)', 'Dần (03–05)', 'Mão (05–07)', 'Thìn (07–09)', 'Tị (09–11)', 'Ngọ (11–13)', 'Mùi (13–15)', 'Thân (15–17)', 'Dậu (17–19)', 'Tuất (19–21)', 'Hợi (21–23)'];
const so = (n: number) => String(n).padStart(2, '0');
const khoang = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const canChiNam = (y: number) => (y > 1800 ? canChi(((y - 4) % 10 + 10) % 10, ((y - 4) % 12 + 12) % 12) : '');

export default function BirthForm({ onSubmit, onPreview, loading, initialData, onFormSave, hideSubmit }: BirthFormProps) {
  const [form, setForm] = useState<BirthFormState>(() => ({
    name: '', year: '', month: '1', day: '1', clockHour: '8', clockMinute: '0', unknownTime: false,
    province: '', city: '', longitude: 105, gender: 'male',
    calendarSystem: initialData ? 'chinese' : 'vietnam', inputCalendar: 'solar',
    utcOffsetMinutes: initialData ? 480 : 420,
    timeConvention: initialData ? 'legacy-longitude' : 'clock', lateZishi: 'next-day', leapMonthPolicy: 'split', engineVersion: 'current',
    namXem: String(new Date().getFullYear()),
    ...initialData,
  }));
  const [error, setError] = useState('');
  useEffect(() => { onFormSave?.(form); }, [form, onFormSave]);
  const preview = useMemo(() => { try { return normalizeBirthForm(form); } catch { return null; } }, [form]);
  const hint = historicalHint({ year: Number(form.year), month: Number(form.month), day: Number(form.day) }, form.birthRegion ?? 'unknown');
  const update = <K extends keyof BirthFormState>(key: K, value: BirthFormState[K]) => { setError(''); setForm(previous => ({ ...previous, [key]: value })); };
  const am = form.inputCalendar === 'lunar';

  function guiDi(ham: (info: BirthInfo) => void) {
    const nx = Number(form.namXem);
    if (!form.year || Number(form.year) < 1900) { setError('Nhập năm sinh từ 1900 trở đi.'); return; }
    if (form.namXem && (!Number.isInteger(nx) || nx < Number(form.year) || nx > 2100)) { setError('Năm xem phải từ năm sinh đến 2100.'); return; }
    try { onFormSave?.(form); ham(formToBirthInfo(form)); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể lập lá số. Kiểm tra thông tin sinh.'); }
  }
  const handleSubmit = (event: React.FormEvent) => { event.preventDefault(); guiDi(onSubmit); };
  function doiLoaiLich(loai: 'solar' | 'lunar') {
    setError('');
    setForm(p => ({ ...p, inputCalendar: loai, lunarLeap: loai === 'lunar' ? p.lunarLeap : false,
      gioChi: loai === 'lunar' ? Math.floor(((Number(p.clockHour) || 0) + 1) % 24 / 2) : undefined }));
  }
  const chon = (key: 'day' | 'month' | 'clockHour' | 'clockMinute', nhan: string, gia: number[], ten?: (n: number) => string) => (
    <label className="ls-o">{nhan}<select name={key} value={Number(form[key])} onChange={e => update(key, e.target.value)}>
      {gia.map(n => <option key={n} value={n}>{ten ? ten(n) : so(n)}</option>)}
    </select></label>
  );

  return (
    <form onSubmit={handleSubmit} className="ls-form" noValidate>
      <div className="ls-tieude"><div className="phu">TUANCHAU.IO.VN</div><div className="chinh">LẬP LÁ SỐ TỬ VI</div></div>
      <div className="ls-giay">
        <p className="ls-gioithieu">Nhập đầy đủ thông tin rồi bấm <b>Lập lá số</b>. Sau đó có thể in hoặc lưu lá số kèm bài luận ra PDF. Thông tin chỉ được xử lý trên máy bạn.</p>

        <div className="ls-dong"><div className="ls-nhan">Họ tên</div><div className="ls-nd">
          <input name="name" autoComplete="off" maxLength={100} value={form.name} onChange={e => update('name', e.target.value)} placeholder="Nguyễn Văn An" className="ls-rong" />
          <span className="ls-ghichu">(không bắt buộc, có thể ẩn)</span></div></div>

        <div className="ls-dong"><div className="ls-nhan">Giới tính</div><div className="ls-nd">
          <label><input type="radio" name="gender" checked={form.gender === 'male'} onChange={() => update('gender', 'male')} /> Nam</label>
          <label><input type="radio" name="gender" checked={form.gender === 'female'} onChange={() => update('gender', 'female')} /> Nữ</label></div></div>

        <div className="ls-dong"><div className="ls-nhan">Loại lịch</div><div className="ls-nd">
          <label><input type="radio" name="inputCalendar" checked={!am} onChange={() => doiLoaiLich('solar')} /> Dương lịch</label>
          <label><input type="radio" name="inputCalendar" checked={am} onChange={() => doiLoaiLich('lunar')} /> Âm lịch</label>
          <label className={am ? '' : 'ls-mo'}><input type="checkbox" name="lunarLeap" disabled={!am} checked={!!form.lunarLeap} onChange={e => update('lunarLeap', e.target.checked)} /> Tháng nhuận</label></div></div>

        <div className="ls-dong"><div className="ls-nhan">Ngày giờ sinh</div><div className="ls-nd ls-ngaygio">
          {am
            ? <label className="ls-o">Giờ<select name="gioChi" value={form.gioChi ?? 0} onChange={e => update('gioChi', Number(e.target.value))}>{CHI_GIO.map((t, i) => <option key={t} value={i}>{t}</option>)}</select></label>
            : <>{chon('clockHour', 'Giờ', khoang(0, 23))}{chon('clockMinute', 'Phút', khoang(0, 59))}</>}
          {chon('day', 'Ngày', khoang(1, am ? 30 : 31))}
          {am ? chon('month', 'Tháng', khoang(1, 12), n => THANG_AM[n - 1]) : chon('month', 'Tháng', khoang(1, 12))}
          <label className="ls-o">Năm<input name="year" type="number" inputMode="numeric" min={1900} max={new Date().getFullYear()} value={form.year} onChange={e => update('year', e.target.value)} className="ls-nam" /></label>
          <span className="ls-ghichu ls-canchi">{canChiNam(Number(form.year))}</span>
          <label className="ls-chon-rieng"><input type="checkbox" checked={form.unknownTime} onChange={e => update('unknownTime', e.target.checked)} /> Tôi chưa biết giờ sinh</label>
          {form.unknownTime && <p className="ls-canhbao">Chưa thể xác định một lá số. Bỏ chọn mục này và thử từng giờ giả định; hãy giữ rõ đó là giả định.</p>}
        </div></div>

        <div className="ls-dong"><div className="ls-nhan">Nơi sinh</div><div className="ls-nd">
          <select name="city" value={form.city} onChange={e => {
            const place = VIETNAM_PLACES.find(item => item.name === e.target.value);
            setForm(p => ({ ...p, city: e.target.value, province: place ? 'Việt Nam' : '', longitude: place?.longitude ?? p.longitude, locationConfirmed: !!place }));
          }}><option value="">Chưa chọn</option>{VIETNAM_PLACES.map(place => <option key={place.name}>{place.name}</option>)}{form.city && !VIETNAM_PLACES.some(place => place.name === form.city) && <option>{form.city}</option>}</select>
          <span className="ls-ghichu">(để tính giờ mặt trời thực, nếu bật)</span></div></div>

        <div className="ls-dong"><div className="ls-nhan">Năm xem</div><div className="ls-nd">
          <input name="namXem" type="number" inputMode="numeric" value={form.namXem ?? ''} onChange={e => update('namXem', e.target.value)} className="ls-nam" />
          <span className="ls-ghichu">{canChiNam(Number(form.namXem))}</span></div></div>

        <div className="ls-dong"><div className="ls-nhan">Tùy chọn</div><div className="ls-nd">
          <label><input type="checkbox" checked={!!form.anHoTen} onChange={e => update('anHoTen', e.target.checked)} /> Ẩn họ tên</label>
          <label><input type="checkbox" checked={!!form.anNgaySinh} onChange={e => update('anNgaySinh', e.target.checked)} /> Ẩn ngày sinh</label>
          <label><input type="checkbox" checked={form.calendarSystem === 'chinese'} onChange={e => update('calendarSystem', e.target.checked ? 'chinese' : 'vietnam')} /> Theo âm lịch Trung Quốc (GMT+8)</label></div></div>

        <div className="ls-dong"><div className="ls-nhan">Mô tả bản thân<small>Hình dáng, tính tình, gia cảnh, các vận hạn đã trải qua. Nêu câu hỏi cần giải đáp.</small></div><div className="ls-nd ls-cot">
          <textarea name="moTa" maxLength={4000} value={form.moTa ?? ''} onChange={e => update('moTa', e.target.value)} placeholder="Ví dụ: năm 2019 đổi việc, 2022 lập gia đình. Muốn hỏi về sự nghiệp trong đại hạn hiện tại." />
          <span className="ls-ghichu">Phần này được in kèm ở trang cuối của PDF, không đưa vào liên kết chia sẻ.</span></div></div>

        <details className="ls-nangcao"><summary>Tùy chọn nâng cao</summary>
          <div className="ls-dong"><div className="ls-nhan">Quy ước giờ</div><div className="ls-nd">
            <select name="timeConvention" value={form.timeConvention} disabled={am} onChange={e => update('timeConvention', e.target.value as BirthFormState['timeConvention'])}>
              <option value="clock">Giữ giờ đồng hồ</option><option value="solar">Giờ mặt trời thực (theo kinh độ)</option><option value="legacy-longitude">Tương thích form cũ: kinh độ từ 120°E</option>
            </select>{am && <span className="ls-ghichu">(giờ theo chi luôn giữ nguyên)</span>}</div></div>
          <div className="ls-dong"><div className="ls-nhan">Giờ Tý từ 23:00</div><div className="ls-nd">
            <select name="lateZishi" value={form.lateZishi} onChange={e => update('lateZishi', e.target.value as BirthFormState['lateZishi'])}><option value="next-day">Tính sang ngày kế tiếp</option><option value="current-day">Giữ ngày hiện tại</option></select></div></div>
          <div className="ls-dong"><div className="ls-nhan">Tháng nhuận</div><div className="ls-nd">
            <select name="leapMonthPolicy" value={form.leapMonthPolicy} onChange={e => update('leapMonthPolicy', e.target.value as BirthFormState['leapMonthPolicy'])}><option value="split">Ngày 1–15 giữ tháng, từ 16 sang tháng sau</option><option value="prev-month">Giữ tháng thường cùng số</option><option value="next-month">Tính toàn bộ sang tháng sau</option><option value="origin-month">Giữ thông tin tháng nhuận</option></select></div></div>
          <div className="ls-dong"><div className="ls-nhan">Múi giờ lúc sinh</div><div className="ls-nd">
            <select name="utcOffsetMinutes" value={form.utcOffsetMinutes} onChange={e => update('utcOffsetMinutes', Number(e.target.value))}>
              <option value={420}>UTC+7 (Việt Nam hiện nay)</option><option value={480}>UTC+8</option><option value={540}>UTC+9</option><option value={0}>UTC</option>
              {![0, 420, 480, 540].includes(form.utcOffsetMinutes ?? 480) && <option value={form.utcOffsetMinutes}>UTC {form.utcOffsetMinutes} phút</option>}
            </select></div></div>
          <div className="ls-dong"><div className="ls-nhan">Kinh độ, độ lệch</div><div className="ls-nd">
            <label className="ls-o">Kinh độ (Đông)<input name="longitude" type="number" min={-180} max={180} step="0.0001" value={form.longitude} onChange={e => setForm(p => ({ ...p, longitude: Number(e.target.value), locationConfirmed: true }))} /></label>
            <label className="ls-o">Lệch UTC (phút)<input name="customUtcOffset" type="number" min={-720} max={840} step={1} value={form.utcOffsetMinutes} onChange={e => update('utcOffsetMinutes', Number(e.target.value))} /></label></div></div>
          <div className="ls-dong"><div className="ls-nhan">Khu vực lịch sinh</div><div className="ls-nd ls-cot">
            <select name="birthRegion" value={form.birthRegion ?? 'unknown'} onChange={e => update('birthRegion', e.target.value as BirthRegion)}><option value="unknown">Chưa chọn / nơi khác</option><option value="north">Miền Bắc Việt Nam</option><option value="south">Miền Nam Việt Nam</option></select>
            {hint ? <><span className="ls-ghichu">{hint.explanation} Đây là gợi ý theo nguồn lịch sử.</span><button type="button" className="ls-nut-phu" onClick={() => setForm(p => ({ ...p, utcOffsetMinutes: hint.utcOffsetMinutes, calendarSystem: hint.calendarSystem, engineVersion: 'current' }))}>Áp dụng gợi ý lịch và múi giờ</button></>
              : <span className="ls-ghichu">Chưa có gợi ý đủ chắc cho khu vực/thời kỳ này.</span>}</div></div>
          <div className="ls-dong"><div className="ls-nhan">Phiên bản engine</div><div className="ls-nd">
            <select name="engineVersion" value={form.engineVersion ?? 'current'} onChange={e => setForm(p => ({ ...p, engineVersion: e.target.value as 'current' | 'v4', calendarSystem: e.target.value === 'v4' ? 'chinese' : p.calendarSystem }))}><option value="current">Engine hiện tại, hỗ trợ lịch Việt</option><option value="v4">Engine tại tag v4.0-13d, dùng lịch gốc</option></select></div></div>
        </details>

        {Number(form.year) > 0 && Number(form.year) < 1976 && <p className="ls-canhbao">Ngày sinh trước 1976: kiểm tra hệ lịch và múi giờ trên giấy khai sinh, có thể chỉnh trong Tùy chọn nâng cao.</p>}
        {preview && <output className="ls-xemgio">Giờ dùng: {formatTrueSolarClock(preview.solar)}, giờ {branchNamesVi[preview.solar.branch]}. Ngày lập lá số: {preview.date.day}/{preview.date.month}/{preview.date.year}{preview.offset ? ` (đổi ${preview.offset > 0 ? '+' : ''}${preview.offset} ngày)` : ''}.</output>}
        <p role="alert" className="ls-loi">{error}</p>
        {!hideSubmit && <div className="ls-nut">
          {onPreview && <button type="button" className="ls-nut-phu" disabled={loading || form.unknownTime} onClick={() => guiDi(onPreview)}>Xem trước</button>}
          <button className="ls-nut-chinh" disabled={loading || form.unknownTime} type="submit">{loading ? 'Đang lập lá số…' : 'Lập lá số'}</button>
        </div>}
      </div>
    </form>
  );
}
