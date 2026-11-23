import type { CungHienThi, DongSao } from '@/lib/la-so/cung';

function Sao({ s }: { s: DongSao }) {
  return <div className={`laso-sao${s.hanh ? ` hanh-${s.hanh}` : ''}${s.dam ? ' dam' : ''}`}>{s.ten}</div>;
}

export default function CungViet({ c, onChon }: { c: CungHienThi; onChon?: (branch: number) => void }) {
  const lop = ['laso-cung', c.dangChayDaiHan && 'dai-han', c.laMenh && 'menh'].filter(Boolean).join(' ');
  return (
    <div
      className={lop}
      style={{ gridRow: c.hang, gridColumn: c.cot }}
      role={onChon ? 'button' : undefined}
      tabIndex={onChon ? 0 : undefined}
      aria-label={`Cung ${c.ten}`}
      onClick={onChon ? () => onChon(c.branch) : undefined}
      onKeyDown={onChon ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChon(c.branch); } } : undefined}
    >
      <div className="laso-dau">
        <span className="laso-canchi">{c.can} <span className={`hanh-${c.hanhChi}`}>{c.chi}</span></span>
        <span className="laso-tencung">{c.ten}{c.than && <span className="hanh-hoa"> THÂN</span>}</span>
        <span className="laso-daihan">{c.daiHan ?? ''}</span>
      </div>
      <div className="laso-chinh">
        {c.chinhTinh.length
          ? c.chinhTinh.map(s => <div key={s.ten} className={`hanh-${s.hanh ?? 'thuy'}`}>{s.ten}</div>)
          : <div className="laso-vcd">Vô chính diệu</div>}
      </div>
      <div className="laso-cot">
        <div>{c.trai.map(s => <Sao key={s.ten} s={s} />)}</div>
        <div>{c.phai.map(s => <Sao key={s.ten} s={s} />)}</div>
      </div>
      <div className="laso-chan">
        <span>năm {c.namTieuHan}</span><b>{c.trangSinh}</b><span>tháng {c.thang}</span>
      </div>
    </div>
  );
}
