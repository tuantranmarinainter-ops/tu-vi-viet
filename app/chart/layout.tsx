import { phongNoiDung, phongTieuDe } from './fonts';

export default function ChartLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${phongNoiDung.variable} ${phongTieuDe.variable}`}>{children}</div>;
}
