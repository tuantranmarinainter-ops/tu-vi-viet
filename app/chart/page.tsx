'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import BirthForm, { type BirthFormState } from '@/components/BirthForm';
import LaSoViet from '@/components/la-so/LaSoViet';
import VietnameseReadings from '@/components/VietnameseReadings';
import '@/components/la-so/in-an.css';
import { generateChart } from '@/lib/ziwei/algorithm';
import { formToBirthInfo, formToSearchParams, searchParamsToForm } from '@/lib/ziwei/share';
import { useHistory } from '@/lib/ziwei/history';
import { PROFILE_NOTICE, PROFILE_SOURCES } from '@/lib/ziwei/profiles';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const NAM_NAY = new Date().getFullYear();

export default function ChartPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [namXem, setNamXem] = useState(NAM_NAY);
  const [tuyChon, setTuyChon] = useState<{ anHoTen?: boolean; anNgaySinh?: boolean; moTa?: string }>({});
  const [initial, setInitial] = useState<Partial<BirthFormState> | undefined>();
  const [formKey, setFormKey] = useState(0);
  const [notice, setNotice] = useState('');
  const formRef = useRef<BirthFormState | null>(null);
  const inRef = useRef<HTMLDivElement | null>(null);
  const { history, save, remove } = useHistory();
  const saveForm = useCallback((form: BirthFormState) => { formRef.current = form; }, []);

  function napTuyChon(form: Partial<BirthFormState>) {
    setTuyChon({ anHoTen: form.anHoTen, anNgaySinh: form.anNgaySinh, moTa: form.moTa });
    const nx = Number(form.namXem);
    setNamXem(Number.isInteger(nx) && nx >= 1900 && nx <= 2100 ? nx : NAM_NAY);
  }

  useEffect(() => {
    const restored = searchParamsToForm(new URLSearchParams(window.location.search));
    if (restored) {
      setInitial(restored); setFormKey(key => key + 1);
      try { formRef.current = restored as BirthFormState; napTuyChon(restored); setChart(generateChart(formToBirthInfo(restored as BirthFormState))); }
      catch (error) { setNotice(error instanceof Error ? error.message : 'Liên kết chưa đủ thông tin để lập lá số.'); }
    }
  }, []);

  // Co lá số vừa một trang A4 khi in (ô cung nhiều sao làm lá số cao hơn bình thường).
  useEffect(() => {
    const truoc = () => {
      const el = inRef.current; if (!el) return;
      el.style.removeProperty('zoom');
      el.style.setProperty('width', '718px'); // bề rộng vùng in A4 (190mm) ở 96dpi
      const tiLe = Math.min(1, 1030 / el.getBoundingClientRect().height);
      if (tiLe < 1) el.style.setProperty('zoom', String(Math.floor(tiLe * 100) / 100));
    };
    const sau = () => { inRef.current?.style.removeProperty('zoom'); inRef.current?.style.removeProperty('width'); };
    window.addEventListener('beforeprint', truoc); window.addEventListener('afterprint', sau);
    return () => { window.removeEventListener('beforeprint', truoc); window.removeEventListener('afterprint', sau); };
  }, []);

  function lapLaSo(birth: BirthInfo, luu: boolean) {
    const result = generateChart(birth);
    setChart(result); setSelectedPalace(null); setNotice('');
    if (formRef.current) { napTuyChon(formRef.current); if (luu) save(formRef.current); }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
  function doiNamXem(nam: number) {
    if (!Number.isInteger(nam) || nam < 1900 || nam > 2100) return;
    setNamXem(nam);
    if (formRef.current) formRef.current = { ...formRef.current, namXem: String(nam) };
  }
  function edit() { setInitial(formRef.current ?? undefined); setFormKey(key => key + 1); setChart(null); setNotice(''); window.scrollTo({ top: 0, behavior: 'auto' }); }
  async function share() {
    if (!formRef.current) return;
    const link = new URL(`${BASE}/chart/`, window.location.origin);
    link.search = formToSearchParams({ ...formRef.current, namXem: String(namXem) }).toString();
    try { await navigator.clipboard.writeText(link.toString()); setNotice('Đã sao chép liên kết. Liên kết chứa thông tin sinh đã nhập (không chứa phần mô tả bản thân).'); }
    catch { setNotice(`Sao chép liên kết này: ${link.toString()}`); }
  }
  function exportChart() {
    if (!chart) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify({ format: 'tuvi-viet-v1', chart, originalForm: formRef.current }, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'la-so-tu-vi.json'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const tieuDe = chart && chart.birthInfo.name && !tuyChon.anHoTen ? `Lá số của ${chart.birthInfo.name}` : 'Lá số Tử Vi';

  return <main className="vi-app tc-trang">
    <header className="vi-header tc-dau"><a href={`${BASE}/chart/`} className="vi-brand">Tử Vi Việt · tuanchau.io.vn</a></header>
    {notice && <p className="vi-notice" role="status">{notice}</p>}
    {!chart ? <div className="tc-nhap">
      <BirthForm key={formKey} onSubmit={birth => lapLaSo(birth, true)} onPreview={birth => lapLaSo(birth, false)} initialData={initial} onFormSave={saveForm} />
      {!!history.length && <section className="vi-history"><h2>Lá số đã lưu trên máy</h2>{history.map(entry => <div key={entry.id}><button type="button" onClick={() => { setInitial(entry.form); formRef.current = entry.form; setFormKey(key => key + 1); setNotice('Đã nạp thông tin. Kiểm tra và chọn Lập lá số.'); }}>{entry.label}</button><button type="button" aria-label={`Xóa ${entry.label}`} onClick={() => remove(entry.id)}>Xóa</button></div>)}</section>}
    </div> : <>
      <div className="vi-toolbar tc-congcu">
        <button type="button" className="vi-secondary" onClick={edit}>Sửa thông tin sinh</button>
        <span className="tc-namxem" role="group" aria-label="Năm xem">
          <button type="button" className="vi-secondary" aria-label="Năm trước" onClick={() => doiNamXem(namXem - 1)}>−</button>
          <label>Năm xem <input type="number" value={namXem} min={1900} max={2100} onChange={e => doiNamXem(Number(e.target.value))} /></label>
          <button type="button" className="vi-secondary" aria-label="Năm sau" onClick={() => doiNamXem(namXem + 1)}>+</button>
        </span>
        <button type="button" className="vi-secondary" onClick={share}>Sao chép liên kết</button>
        <button type="button" className="vi-secondary" onClick={exportChart}>Lưu tệp JSON</button>
        <button type="button" className="vi-secondary" onClick={() => window.print()}>In / lưu PDF</button>
      </div>
      <section className="vi-profile tc-hoso" aria-label="Quy tắc lá số"><h1>{tieuDe}</h1>
        <p>{chart.birthInfo.calendarSystem === 'vietnam' ? 'Lịch Việt Nam' : 'Lịch gốc Trung Quốc'}; {chart.birthInfo.timeConvention === 'clock' ? 'giữ giờ đồng hồ' : chart.birthInfo.timeConvention === 'solar' ? 'giờ mặt trời thực' : 'hiệu chỉnh tương thích form cũ'}; UTC{(chart.birthInfo.utcOffsetMinutes ?? 480) >= 0 ? '+' : ''}{(chart.birthInfo.utcOffsetMinutes ?? 480) / 60}. Quy tắc an sao kế thừa engine gốc; chưa đối chiếu đủ hệ Tử Vi Việt Nam.</p>
      </section>
      <div className="tc-laso-in" ref={inRef}>
        <div className="vi-board-scroll"><LaSoViet chart={chart} namXem={namXem} tuyChon={tuyChon} onChonCung={b => setSelectedPalace(chart.palaces.find(p => p.branch === b) ?? null)} /></div>
        <p className="vi-muted vi-scroll-hint">Vuốt ngang để xem toàn bộ lá số. Chọn một cung để đọc chủ đề tương ứng.</p>
      </div>
      <VietnameseReadings chart={chart} selectedPalace={selectedPalace} view="mingpan" year={namXem} />
      {tuyChon.moTa?.trim() && <section className="tc-mota" aria-label="Mô tả bản thân"><h2>Mô tả bản thân</h2><p>{tuyChon.moTa}</p></section>}
    </>}
    <footer className="vi-footer tc-chan"><p>{PROFILE_NOTICE}</p><details><summary>Nguồn và giấy phép</summary><p>Phát triển từ Renhuai123/ziwei-doushu (MIT), MDuke235/tu-vi-viet, iztro và @nghiavuive/lunar_date_vi (ISC). V4: CC BY 4.0 với điều kiện riêng cho trích dẫn Tian Ji. Không gửi thông tin sinh tới dịch vụ AI.</p><ul>{PROFILE_SOURCES.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ul></details></footer>
  </main>;
}
