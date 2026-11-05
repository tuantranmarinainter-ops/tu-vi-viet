'use client';
import { useEffect, useMemo, useState } from 'react';
import type { BirthInfo } from '@/lib/ziwei/types';
import { formToBirthInfo, normalizeBirthForm } from '@/lib/ziwei/share';
import { VIETNAM_PLACES } from '@/lib/ziwei/profiles';
import { formatTrueSolarClock } from '@/lib/ziwei/true-solar-time';
import { branchNamesVi } from '@/lib/i18n/vi';
import { historicalHint, type BirthRegion } from '@/lib/ziwei/historical-time';

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
}

interface BirthFormProps {
  onSubmit: (info: BirthInfo) => void; loading?: boolean;
  initialData?: Partial<BirthFormState>; onFormSave?: (data: BirthFormState) => void;
  hideSubmit?: boolean;
}

export default function BirthForm({ onSubmit, loading, initialData, onFormSave, hideSubmit }: BirthFormProps) {
  const [form, setForm] = useState<BirthFormState>(() => ({
    name: '', year: '', month: '', day: '', clockHour: '8', clockMinute: '0', unknownTime: false,
    province: '', city: '', longitude: 105, gender: 'male',
    calendarSystem: initialData ? 'chinese' : 'vietnam', inputCalendar: 'solar',
    utcOffsetMinutes: initialData ? 480 : 420,
    timeConvention: initialData ? 'legacy-longitude' : 'clock', lateZishi: 'next-day', leapMonthPolicy: 'split', engineVersion: 'current',
    ...initialData,
  }));
  const [error, setError] = useState('');
  useEffect(() => { onFormSave?.(form); }, [form, onFormSave]);
  const preview = useMemo(() => { try { return normalizeBirthForm(form); } catch { return null; } }, [form]);
  const hint = historicalHint({ year: Number(form.year), month: Number(form.month), day: Number(form.day) }, form.birthRegion ?? 'unknown');
  const update = <K extends keyof BirthFormState>(key: K, value: BirthFormState[K]) => { setError(''); setForm(previous => ({ ...previous, [key]: value })); };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try { onFormSave?.(form); onSubmit(formToBirthInfo(form)); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Không thể lập lá số. Kiểm tra thông tin sinh.'); }
  };
  const field = (key: 'day' | 'month' | 'year' | 'clockHour' | 'clockMinute', label: string, min: number, max: number) => (
    <label>{label}<input name={key} type="number" inputMode="numeric" required min={min} max={max} value={form[key]} onChange={event => update(key, event.target.value)} /></label>
  );

  return (
    <form onSubmit={handleSubmit} className="vi-form" noValidate>
      <div className="vi-form-heading"><h2>Thông tin sinh</h2><span>Thông tin được xử lý trên máy bạn</span></div>
      <label>Họ tên <span className="vi-muted">(không bắt buộc)</span><input name="name" autoComplete="off" maxLength={100} value={form.name} onChange={event => update('name', event.target.value)} placeholder="Tên hiển thị trên lá số" /></label>
      <div className="vi-fields">
        <label>Hệ lịch<select name="calendarSystem" value={form.calendarSystem} onChange={event => update('calendarSystem', event.target.value as BirthFormState['calendarSystem'])}>
          <option value="vietnam">Lịch Việt Nam</option><option value="chinese">Lịch Trung Quốc / đối chiếu repo gốc</option>
        </select></label>
        <label>Ngày nhập theo<select name="inputCalendar" value={form.inputCalendar} onChange={event => update('inputCalendar', event.target.value as BirthFormState['inputCalendar'])}>
          <option value="solar">Dương lịch</option><option value="lunar">Âm lịch</option>
        </select></label>
      </div>
      <div className="vi-fields vi-fields-three">{field('day', 'Ngày', 1, 31)}{field('month', 'Tháng', 1, 12)}{field('year', 'Năm', 1900, new Date().getFullYear())}</div>
      {form.inputCalendar === 'lunar' && <label className="vi-check"><input type="checkbox" name="lunarLeap" checked={!!form.lunarLeap} onChange={event => update('lunarLeap', event.target.checked)} />Tháng nhuận</label>}
      <div className="vi-fields">
        <label>Nơi sinh<select name="city" value={form.city} onChange={event => {
          const place = VIETNAM_PLACES.find(item => item.name === event.target.value);
          setForm(previous => ({ ...previous, city: event.target.value, province: place ? 'Việt Nam' : '', longitude: place?.longitude ?? previous.longitude, locationConfirmed: !!place }));
        }}><option value="">Tự nhập kinh độ / chưa chọn</option>{VIETNAM_PLACES.map(place => <option key={place.name}>{place.name}</option>)}{form.city && !VIETNAM_PLACES.some(place => place.name === form.city) && <option>{form.city}</option>}</select></label>
        <label>Múi giờ đồng hồ lúc sinh<select name="utcOffsetMinutes" value={form.utcOffsetMinutes} onChange={event => update('utcOffsetMinutes', Number(event.target.value))}>
          <option value={420}>UTC+7 — Việt Nam hiện nay</option><option value={480}>UTC+8</option><option value={540}>UTC+9</option><option value={0}>UTC</option>
          {![0, 420, 480, 540].includes(form.utcOffsetMinutes ?? 480) && <option value={form.utcOffsetMinutes}>UTC {form.utcOffsetMinutes} phút</option>}
        </select></label>
      </div>
      <details className="vi-details"><summary>Nơi sinh khác hoặc múi giờ lịch sử</summary>
        <div className="vi-fields"><label>Kinh độ (độ Đông; Tây dùng số âm)<input name="longitude" type="number" min={-180} max={180} step="0.0001" value={form.longitude} onChange={event => setForm(previous => ({ ...previous, longitude: Number(event.target.value), locationConfirmed: true }))} /></label>
        <label>Độ lệch UTC theo phút<input name="customUtcOffset" type="number" min={-720} max={840} step={1} value={form.utcOffsetMinutes} onChange={event => update('utcOffsetMinutes', Number(event.target.value))} /></label></div>
        <p>Lịch âm và múi giờ đồng hồ là hai lựa chọn riêng. Với ngày sinh trước 1976, hãy đối chiếu lịch địa phương và múi giờ đương thời; ứng dụng không tự khẳng định mọi vùng đều dùng lịch UTC+7.</p>
        <label>Khu vực ghi nhận lịch sinh<select name="birthRegion" value={form.birthRegion ?? 'unknown'} onChange={event => update('birthRegion', event.target.value as BirthRegion)}><option value="unknown">Chưa chọn / nơi khác</option><option value="north">Miền Bắc Việt Nam</option><option value="south">Miền Nam Việt Nam</option></select></label>
        {hint ? <><p>{hint.explanation} Đây là gợi ý theo nguồn lịch sử, không xác minh được tờ khai sinh cụ thể.</p><button type="button" className="vi-secondary" onClick={() => setForm(previous => ({ ...previous, utcOffsetMinutes: hint.utcOffsetMinutes, calendarSystem: hint.calendarSystem, engineVersion: 'current' }))}>Áp dụng gợi ý lịch và múi giờ</button></> : <p>Chưa có gợi ý đủ chắc cho khu vực/thời kỳ này. Giữ lựa chọn thủ công và đối chiếu tài liệu gốc.</p>}
        <p><a href="https://www.xemamlich.uhm.vn/histcal.html" target="_blank" rel="noreferrer">Nguồn lịch sử lịch Việt</a>; <a href="https://github.com/eggert/tz/blob/main/asia" target="_blank" rel="noreferrer">nguồn múi giờ IANA</a>.</p>
      </details>
      {Number(form.year) > 0 && Number(form.year) < 1976 && <p className="vi-notice">Ngày sinh lịch sử: lịch Việt được tính theo bảng lịch Việt của thư viện; nếu ngày âm được ghi theo lịch miền Nam hoặc Trung Quốc, hãy chọn hệ lịch tương ứng. Kiểm tra múi giờ trên giấy khai sinh.</p>}
      <div className="vi-fields">{field('clockHour', 'Giờ (0–23)', 0, 23)}{field('clockMinute', 'Phút (0–59)', 0, 59)}</div>
      <label className="vi-check"><input type="checkbox" checked={form.unknownTime} onChange={event => update('unknownTime', event.target.checked)} />Tôi chưa biết giờ sinh</label>
      {form.unknownTime && <p className="vi-notice">Chưa thể xác định một lá số. Bạn có thể bỏ chọn mục này và thử từng giờ giả định; hãy giữ rõ đó là giả định.</p>}
      <div className="vi-fields">
        <label>Quy ước giờ<select name="timeConvention" value={form.timeConvention} onChange={event => update('timeConvention', event.target.value as BirthFormState['timeConvention'])}>
          <option value="clock">Giữ giờ đồng hồ</option><option value="solar">Giờ mặt trời thực (kinh độ và phương trình thời gian)</option><option value="legacy-longitude">Tương thích form cũ: kinh độ từ 120°E</option>
        </select></label>
        <label>Giới tính dùng để an hạn<select name="gender" value={form.gender} onChange={event => update('gender', event.target.value as 'male' | 'female')}><option value="male">Nam</option><option value="female">Nữ</option></select></label>
      </div>
      <details className="vi-details"><summary>Quy tắc lập lá số</summary>
        <label>Phiên bản engine<select name="engineVersion" value={form.engineVersion ?? 'current'} onChange={event => setForm(previous => ({ ...previous, engineVersion: event.target.value as 'current' | 'v4', calendarSystem: event.target.value === 'v4' ? 'chinese' : previous.calendarSystem }))}><option value="current">Engine hiện tại, hỗ trợ lịch Việt</option><option value="v4">Engine tại tag v4.0-13d, dùng lịch gốc</option></select></label>
        <div className="vi-fields">
        <label>Giờ Tý từ 23:00<select name="lateZishi" value={form.lateZishi} onChange={event => update('lateZishi', event.target.value as BirthFormState['lateZishi'])}><option value="next-day">Tính sang ngày kế tiếp</option><option value="current-day">Giữ ngày hiện tại</option></select></label>
        <label>Tháng nhuận<select name="leapMonthPolicy" value={form.leapMonthPolicy} onChange={event => update('leapMonthPolicy', event.target.value as BirthFormState['leapMonthPolicy'])}><option value="split">Ngày 1–15 giữ tháng; từ ngày 16 sang tháng sau</option><option value="prev-month">Giữ tháng thường cùng số</option><option value="next-month">Tính toàn bộ sang tháng sau</option><option value="origin-month">Giữ thông tin tháng nhuận</option></select></label>
      </div><p>Đây là các lựa chọn trường phái, không phải một quy tắc chung cho mọi hệ Tử Vi Việt Nam.</p></details>
      {preview && <output className="vi-preview">Giờ dùng: {formatTrueSolarClock(preview.solar)} — {branchNamesVi[preview.solar.branch]}. Ngày lập lá số: {preview.date.day}/{preview.date.month}/{preview.date.year}{preview.offset ? ` (đổi ${preview.offset > 0 ? '+' : ''}${preview.offset} ngày)` : ''}.</output>}
      {error && <p role="alert" className="vi-error">{error}</p>}
      {!hideSubmit && <button className="vi-primary" disabled={loading || form.unknownTime} type="submit">{loading ? 'Đang lập lá số…' : 'Lập lá số'}</button>}
    </form>
  );
}
