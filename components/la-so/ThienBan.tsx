import type { ThienBan as DuLieu } from '@/lib/la-so/thien-ban';

export default function ThienBan({ t }: { t: DuLieu }) {
  return (
    <div className="laso-thienban">
      <table>
        <tbody>
          <tr><td className="k">Họ tên:</td><td colSpan={3}>{t.hoTen}</td></tr>
          {t.dong.map(d => (
            <tr key={d.nhan}><td className="k">{d.nhan}:</td><td>{d.duong ?? ''}</td><td>{d.am ?? ''}</td><td>{d.canChi}</td></tr>
          ))}
          <tr className="cach"><td className="k">Năm xem:</td><td>{t.namXem}</td><td></td><td>{t.namXemCanChi}<br />{t.tuoi}</td></tr>
          <tr className="cach"><td className="k">Âm Dương:</td><td colSpan={3}>{t.amDuong} · {t.thuanNghich}</td></tr>
          <tr><td className="k">Mệnh:</td><td colSpan={3}>{t.menh}</td></tr>
          <tr><td className="k">Cục:</td><td colSpan={3}>{t.cuc} · {t.quanHe}<br />{t.thanCu}</td></tr>
          <tr className="cach"><td className="k">Mệnh chủ:</td><td colSpan={3}>{t.menhChu}</td></tr>
          <tr><td className="k">Thân chủ:</td><td colSpan={3}>{t.thanChu}</td></tr>
        </tbody>
      </table>
      <div className="laso-trien" aria-hidden="true">Tuấn<br />Châu<br />Lý Số</div>
      <div className="laso-dhhientai">{t.daiHan}</div>
    </div>
  );
}
