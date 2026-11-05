import { READING_SOURCES, type DetailedReading as Reading } from '@/lib/ziwei/detailed-readings-vi';

export default function DetailedReading({ reading }: { reading: Reading }) {
  return <div className="vi-detailed-content">
    <p className="vi-reading-intro">{reading.intro}</p>
    <nav className="vi-reading-index" aria-label="Mục lục bài luận giải">
      {reading.sections.map(section => <a key={section.id} href={`#reading-${section.id}`}>{section.title}</a>)}
      <a href="#reading-questions">Đối chiếu thực tế</a>
    </nav>
    {reading.sections.map(section => <section key={section.id} id={`reading-${section.id}`} className="vi-reading-section" aria-labelledby={`reading-title-${section.id}`}>
      <h4 id={`reading-title-${section.id}`}>{section.title}</h4>
      {section.items.map(item => <article className="vi-reading-item" key={item.id}>
        <h5>{item.title}</h5><p>{item.text}</p>
        <details className="vi-reading-evidence"><summary>Căn cứ và cách đọc: {item.title}</summary>
          <ul>{item.evidence.map((line, index) => <li key={index}>{line}</li>)}</ul>
          <p className="vi-muted">Căn cứ là dữ kiện trên lá số. Phần giải nghĩa là diễn giải biểu tượng.</p>
          <ul className="vi-reading-sources">{item.sourceIds.map(id => {
            const source = READING_SOURCES[id];
            return <li key={id}>{'url' in source ? <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> : source.title}<span> — {source.scope}</span></li>;
          })}</ul>
        </details>
      </article>)}
    </section>)}
    <section id="reading-questions" className="vi-reading-section" aria-labelledby="reading-title-questions">
      <h4 id="reading-title-questions">Đối chiếu với trải nghiệm thực tế</h4>
      <ol className="vi-reflection-list">{reading.questions.map(question => <li key={question}>{question}</li>)}</ol>
    </section>
    <p className="vi-muted">{reading.boundary}</p>
    <details className="vi-details vi-reading-limits"><summary>Phạm vi và những phần chưa phân tích</summary>
      <ul>{reading.gaps.map(gap => <li key={gap}>{gap}</li>)}</ul>
      <p>Nội dung tiếng Việt do ứng dụng biên soạn, chưa được chuyên gia thẩm định. Nguồn khái niệm được ghi trong từng phần căn cứ. Phiên bản bài: {reading.version}.</p>
    </details>
  </div>;
}
