'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import BirthForm, { type BirthFormState } from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import TimeNav, { type TimeView } from '@/components/TimeNav';
import StarDetailPanel from '@/components/StarDetailPanel';
import VietnameseReadings from '@/components/VietnameseReadings';
import { generateChart } from '@/lib/ziwei/algorithm';
import { formToBirthInfo, formToSearchParams, searchParamsToForm } from '@/lib/ziwei/share';
import { useHistory } from '@/lib/ziwei/history';
import { PROFILE_NOTICE, PROFILE_SOURCES } from '@/lib/ziwei/profiles';
import { viLabel } from '@/lib/i18n/vi';
import { useTheme } from '@/components/ThemeProvider';
import type { BirthInfo, ZiweiChart, Palace, Star } from '@/lib/ziwei/types';

export default function ChartPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [view, setView] = useState<TimeView>('mingpan');
  const [year, setYear] = useState(new Date().getFullYear());
  const [initial, setInitial] = useState<Partial<BirthFormState> | undefined>();
  const [formKey, setFormKey] = useState(0);
  const [notice, setNotice] = useState('');
  const formRef = useRef<BirthFormState | null>(null);
  const { history, save, remove } = useHistory();
  const { theme, toggle } = useTheme();
  const saveForm = useCallback((form: BirthFormState) => { formRef.current = form; }, []);

  useEffect(() => {
    const restored = searchParamsToForm(new URLSearchParams(window.location.search));
    if (restored) {
      setInitial(restored); setFormKey(key => key + 1);
      try { formRef.current = restored as BirthFormState; setChart(generateChart(formToBirthInfo(restored as BirthFormState))); }
      catch (error) { setNotice(error instanceof Error ? error.message : 'Liên kết chưa đủ thông tin để lập lá số.'); }
    }
  }, []);

  function createChart(birth: BirthInfo) {
    const result = generateChart(birth);
    setChart(result); setSelectedPalace(null); setSelectedStar(null); setView('mingpan'); setNotice('');
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (formRef.current) save(formRef.current);
  }
  function edit() { setInitial(formRef.current ?? undefined); setFormKey(key => key + 1); setChart(null); setNotice(''); window.scrollTo({ top: 0, behavior: 'auto' }); }
  async function share() {
    if (!formRef.current) return;
    const link = new URL('/chart', window.location.origin);
    link.search = formToSearchParams(formRef.current).toString();
    try { await navigator.clipboard.writeText(link.toString()); setNotice('Đã sao chép liên kết. Liên kết chứa thông tin sinh đã nhập.'); }
    catch { setNotice(`Sao chép liên kết này: ${link.toString()}`); }
  }
  function exportChart() {
    if (!chart) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify({ format: 'tuvi-viet-v1', chart, originalForm: formRef.current }, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'la-so-tu-vi.json'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <main className="vi-app">
    <header className="vi-header"><a href="/chart" className="vi-brand">Tử Vi Việt</a><button type="button" className="vi-secondary" onClick={toggle}>{theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}</button></header>
    {notice && <p className="vi-notice" role="status">{notice}</p>}
    {!chart ? <div className="vi-entry">
      <section className="vi-intro"><h1>Một lá số.<br />Những lựa chọn rõ ràng.</h1><p>Lập lá số theo lịch Việt, đọc tên sao và cung bằng tiếng Việt, đối chiếu cách tính ngay từ thông tin sinh.</p><ul><li>Chọn lịch âm hoặc dương</li><li>Giữ giờ đồng hồ hoặc hiệu chỉnh giờ mặt trời</li><li>Lưu lá số trên máy để xem lại</li></ul><p className="vi-muted">Không cần tài khoản hay API key. Luận giải cơ bản có giới hạn, dành cho tìm hiểu văn hóa và tự chiêm nghiệm.</p></section>
      <div><BirthForm key={formKey} onSubmit={createChart} initialData={initial} onFormSave={saveForm} />
      {!!history.length && <section className="vi-history"><h2>Lá số đã lưu trên máy</h2>{history.map(entry => <div key={entry.id}><button type="button" onClick={() => { setInitial(entry.form); formRef.current = entry.form; setFormKey(key => key + 1); setNotice('Đã nạp thông tin. Kiểm tra và chọn Lập lá số.'); }}>{entry.label}</button><button type="button" aria-label={`Xóa ${entry.label}`} onClick={() => remove(entry.id)}>Xóa</button></div>)}</section>}</div>
    </div> : <>
      <div className="vi-toolbar"><button type="button" className="vi-secondary" onClick={edit}>Sửa thông tin sinh</button><button type="button" className="vi-secondary" onClick={share}>Sao chép liên kết</button><button type="button" className="vi-secondary" onClick={exportChart}>Lưu tệp JSON</button><button type="button" className="vi-secondary" onClick={() => window.print()}>In / lưu PDF</button></div>
      <section className="vi-profile" aria-label="Quy tắc lá số"><h1>{chart.birthInfo.name ? `Lá số của ${chart.birthInfo.name}` : 'Lá số Tử Vi'}</h1>
        <p>{chart.birthInfo.calendarSystem === 'vietnam' ? 'Lịch Việt Nam' : 'Lịch gốc Trung Quốc'}; engine {chart.birthInfo.engineVersion === 'v4' ? 'v4.0-13d' : 'hiện tại'}; {chart.birthInfo.timeConvention === 'clock' ? 'giữ giờ đồng hồ' : chart.birthInfo.timeConvention === 'solar' ? 'giờ mặt trời thực' : 'hiệu chỉnh tương thích form cũ'}; UTC{(chart.birthInfo.utcOffsetMinutes ?? 480) >= 0 ? '+' : ''}{(chart.birthInfo.utcOffsetMinutes ?? 480) / 60}.</p>
        <p>Ngày lập lá số: {chart.birthInfo.day}/{chart.birthInfo.month}/{chart.birthInfo.year}. Âm lịch: {chart.lunarInfo.lunarDay}/{Math.abs(chart.lunarInfo.lunarMonth)}/{chart.lunarInfo.lunarYear}{chart.lunarInfo.isLeapMonth ? ' (nhuận)' : ''}. Tuổi mụ: {chart.currentAge}.</p>
        <p className="vi-muted">Giờ Tý từ 23:00: {chart.birthInfo.lateZishi === 'current-day' ? 'giữ ngày' : 'sang ngày sau'}. Tháng nhuận: {({ split: 'chia tại ngày 16', 'prev-month': 'giữ tháng cùng số', 'next-month': 'sang tháng sau', 'origin-month': 'giữ thông tin nhuận' })[chart.birthInfo.leapMonthPolicy ?? 'split']}. Quy tắc an sao kế thừa repo; chưa khẳng định đại diện mọi trường phái Việt Nam.</p>
      </section>
      <div className="vi-result-grid"><section className="vi-chart-section"><TimeNav chart={chart} view={view} liunianYear={year} onViewChange={setView} onYearChange={setYear} /><div className="vi-board-scroll"><ChartBoard chart={chart} view={view} year={year} onViewChange={setView} onYearChange={setYear} onPalaceSelect={setSelectedPalace} onStarSelect={star => setSelectedStar(star)} /></div><p className="vi-muted vi-scroll-hint">Vuốt ngang để xem toàn bộ lá số.</p><p className="vi-muted">Chọn cung để đọc chủ đề tương ứng; chọn sao để xem giải nghĩa. Các lớp vận hạn là thông tin cấu trúc, không phải luận giải v4 theo tuổi.</p>{selectedPalace && <p>Đang xem cung {viLabel(selectedPalace.name)}.</p>}</section>
      <VietnameseReadings chart={chart} selectedPalace={selectedPalace} view={view} year={year} /></div>
      <StarDetailPanel star={selectedStar} onClose={() => setSelectedStar(null)} />
    </>}
    <footer className="vi-footer"><p>{PROFILE_NOTICE}</p><details><summary>Nguồn và giấy phép</summary><p>Phát triển từ Renhuai123/ziwei-doushu (MIT), iztro và @nghiavuive/lunar_date_vi (ISC). V4: CC BY 4.0 với điều kiện riêng cho trích dẫn Tian Ji. Không gửi thông tin sinh tới dịch vụ AI.</p><ul>{PROFILE_SOURCES.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ul></details></footer>
  </main>;
}
