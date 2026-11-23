'use client';
import './la-so.css';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { cungHienThi } from '@/lib/la-so/cung';
import { thienBan, type TuyChonHienThi } from '@/lib/la-so/thien-ban';
import { nhanTuanTriet, duongTamPhuong } from '@/lib/la-so/luoi';
import CungViet from './CungViet';
import ThienBan from './ThienBan';

const BAT_QUAI = [0, 45, 90, 135, 180, 225, 270, 315];

interface Props {
  chart: ZiweiChart;
  namXem: number;
  tuyChon?: Omit<TuyChonHienThi, 'namXem'>;
  onChonCung?: (branch: number) => void;
}

export default function LaSoViet({ chart, namXem, tuyChon, onChonCung }: Props) {
  const cung = cungHienThi(chart, namXem);
  const tb = thienBan(chart, { ...tuyChon, namXem });
  return (
    <section className="laso-khung" aria-label="Lá số Tử Vi">
      <div className="laso-tieude"><div className="phu">TUANCHAU.IO.VN</div><div className="chinh">LÁ SỐ TỬ VI</div></div>
      <div className="laso-giay">
        <svg className="laso-batquai" viewBox="-50 -50 100 100" aria-hidden="true">
          <circle r="46" fill="none" strokeWidth="1.2" /><circle r="30" fill="none" strokeWidth=".8" /><circle r="14" fill="none" strokeWidth=".8" />
          <path d="M0-14A7 7 0 0 1 0 0A7 7 0 0 0 0 14A14 14 0 0 1 0-14Z" />
          {BAT_QUAI.map(g => <path key={g} d="M-6-40H6M-6-36H6M-6-32H6" strokeWidth="2.2" transform={`rotate(${g})`} />)}
        </svg>
        <svg className="laso-tamphuong" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {duongTamPhuong(chart.mingGongBranch).map((d, i) => <line key={i} x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} />)}
        </svg>
        <div className="laso-luoi">
          {cung.map(c => <CungViet key={c.branch} c={c} onChon={onChonCung} />)}
          <ThienBan t={tb} />
        </div>
        {nhanTuanTriet(chart).map(n => <span key={n.nhan} className="laso-tuantriet" style={{ left: `${n.x}%`, top: `${n.y}%` }}>{n.nhan}</span>)}
      </div>
      <div className="laso-chuthich">
        <span data-mau="hoa">Hỏa</span><span data-mau="moc">Mộc</span><span data-mau="tho">Thổ</span>
        <span data-mau="kim">Kim</span><span data-mau="thuy">Thủy</span><span data-mau="dh">Đại hạn đang chạy</span>
      </div>
    </section>
  );
}
