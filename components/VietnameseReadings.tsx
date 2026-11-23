'use client';
import { useEffect, useRef, useState } from 'react';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import { getVietnameseReading, READING_TOPICS, type ReadingTopic } from '@/lib/ziwei/readings-vi';
import { GLOSSARY_VERSION, translationCacheKey, validateTranslation } from '@/lib/ziwei/v4-translation';
import DetailedReading from './DetailedReading';
import type { TimeView } from './TimeNav';

export default function VietnameseReadings({ chart, selectedPalace, view = 'mingpan', year }: { chart: ZiweiChart; selectedPalace?: Palace | null; view?: TimeView; year?: number }) {
  const [topic, setTopic] = useState<ReadingTopic>('overview');
  const [v4, setV4] = useState<{ text?: string; sourceHash?: string; message?: string; attribution?: string; key?: string } | null>(null);
  const [translation, setTranslation] = useState('');
  const [translationNotice, setTranslationNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const requestVersion = useRef(0);
  useEffect(() => { requestVersion.current++; setV4(null); setLoading(false); setTranslation(''); setTranslationNotice(''); }, [chart, topic]);
  useEffect(() => {
    if (!selectedPalace) return;
    const key = selectedPalace.name.replace(/宫$/, '').replace('交友', '仆役');
    const match = READING_TOPICS.find(item => item.palace.replace(/宫$/, '') === key);
    if (match) setTopic(match.key);
  }, [selectedPalace]);
  const reading = getVietnameseReading(chart, topic);
  async function loadV4() {
    const request = ++requestVersion.current;
    setLoading(true); setV4(null);
    try {
      const response = await fetch('/api/v4', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ birth: chart.birthInfo, topic }) });
      const data = await response.json();
      if (request === requestVersion.current) {
        setV4(data);
        try { setTranslation(data.sourceHash ? localStorage.getItem(translationCacheKey(data.sourceHash)) ?? '' : ''); } catch { setTranslation(''); }
      }
    } catch { if (request === requestVersion.current) setV4({ message: 'Chưa đọc được dữ liệu. Kiểm tra kết nối và thử lại.' }); }
    finally { if (request === requestVersion.current) setLoading(false); }
  }
  function exportTranslationTemplate() {
    if (!v4?.text || !v4.sourceHash) return;
    const template = { format: 'tuvi-v4-translation-v1', language: 'vi', sourceKey: v4.key, topic, sourceHash: v4.sourceHash, glossaryVersion: GLOSSARY_VERSION, sourceText: v4.text, translation: '', attribution: v4.attribution };
    const url = URL.createObjectURL(new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = `v4-${topic}-ban-dich.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function importTranslation(file?: File) {
    if (!file || !v4?.sourceHash) return;
    const hash = v4.sourceHash;
    const request = requestVersion.current;
    try {
      if (file.size > 512_000) throw new Error('Tệp bản dịch phải nhỏ hơn 512 KB.');
      const data = JSON.parse(await file.text());
      const text = validateTranslation(data, { hash, key: v4.key!, topic });
      if (request !== requestVersion.current) return;
      setTranslation(text);
      try { localStorage.setItem(translationCacheKey(hash), text); setTranslationNotice('Đã nạp và lưu bản dịch trên trình duyệt này. Bản dịch do bạn cung cấp, chưa được ứng dụng thẩm định.'); }
      catch { setTranslationNotice('Đã nạp bản dịch, nhưng bộ nhớ trình duyệt chưa lưu được.'); }
    } catch (error) { if (request === requestVersion.current) setTranslationNotice(error instanceof Error ? error.message : 'Không đọc được bản dịch.'); }
  }
  return <section className={`vi-reading${reading.detailed ? ' vi-reading-detailed' : ''}`} aria-label="Diễn giải lá số">
    <h2>Luận giải theo chủ đề</h2>
    <p className="vi-muted">Bản mệnh · Tiếng Việt · Không mất phí API. Bốn mục Tổng quan, Sự nghiệp, Tài chính và Tình cảm có bài đọc mở rộng.</p>
    {view !== 'mingpan' && <p className="vi-notice" role="note">Lá số đang hiển thị {view === 'liunian' ? `lưu niên ${year ?? ''}` : 'đại hạn'}. Bài dưới vẫn đọc cấu trúc bản mệnh; chưa luận riêng sự kiện hoặc thời điểm của giai đoạn này.</p>}
    <div className="vi-topic-tabs" role="group" aria-label="Chủ đề">{READING_TOPICS.map(item => <button key={item.key} type="button" aria-pressed={topic === item.key} onClick={() => setTopic(item.key)}>{item.label}</button>)}</div>
    <h3>{reading.title}</h3>
    {reading.detailed ? <DetailedReading key={topic} reading={reading.detailed} /> : <>
      <ul className="vi-evidence">{reading.evidence.map(line => <li key={line}>{line}</li>)}</ul>
      {reading.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    </>}
    {process.env.NEXT_PUBLIC_STATIC !== '1' && <details className="vi-details"><summary>Đối chiếu luận giải v4 gốc</summary>
      <p>Dữ liệu của tác giả bằng tiếng Trung. Chỉ hiển thị khi cấu trúc lá số khớp engine tại tag v4.0-13d; không tự dịch bằng AI hoặc trừ usage của bạn.</p>
      <button type="button" className="vi-secondary" disabled={loading} onClick={loadV4}>{loading ? 'Đang đối chiếu và đọc tệp nén…' : 'Đọc bản v4 tương ứng'}</button>
      {v4?.message && <p role="status">{v4.message}</p>}
      {v4?.text && <><p className="vi-muted">Khóa dữ liệu: {v4.key}</p>
        <div className="vi-toolbar"><button type="button" className="vi-secondary" onClick={exportTranslationTemplate}>Xuất tệp để dịch</button><label className="vi-secondary">Nạp bản dịch tiếng Việt<input type="file" accept=".json,application/json" onChange={event => { void importTranslation(event.target.files?.[0]); event.target.value = ''; }} /></label></div>
        <p className="vi-muted">Có thể dịch tệp bằng công cụ bạn chọn rồi nạp lại. Ứng dụng kiểm tra mã nội dung để không gắn nhầm bản dịch và không tự gọi AI.</p>
        {translationNotice && <p role="status">{translationNotice}</p>}
        {translation && <><h3>Bản dịch đã nạp</h3><pre className="vi-original" lang="vi">{translation}</pre><p className="vi-muted">Bản dịch trên trình duyệt; chưa được thẩm định nội dung.</p><button type="button" className="vi-secondary" onClick={() => { if (v4.sourceHash) { try { localStorage.removeItem(translationCacheKey(v4.sourceHash)); } catch { /* Still clear the current view. */ } } setTranslation(''); setTranslationNotice('Đã xóa bản dịch đã nạp trên trình duyệt này.'); }}>Xóa bản dịch đã nạp</button></>}
        <details><summary>Nguyên văn tiếng Trung</summary><pre className="vi-original" lang="zh-CN">{v4.text}</pre></details><p className="vi-muted">{v4.attribution}</p></>}
    </details>}
    <div className="vi-in-du-chu-de">{READING_TOPICS.map(item => { const r = getVietnameseReading(chart, item.key); return <article key={item.key} className="vi-in-chu-de">
      <h3>{r.title}</h3>
      {r.detailed ? <DetailedReading reading={r.detailed} /> : <><ul className="vi-evidence">{r.evidence.map(line => <li key={line}>{line}</li>)}</ul>{r.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</>}
    </article>; })}</div>
    <p className="vi-muted vi-source">Nguồn quy tắc nền: engine Zi Wei Dou Shu và iztro; phần tiếng Việt là diễn giải giới hạn của ứng dụng, không phải bản dịch toàn bộ v4.</p>
  </section>;
}
