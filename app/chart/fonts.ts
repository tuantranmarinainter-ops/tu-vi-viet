import { Be_Vietnam_Pro, Noto_Serif } from 'next/font/google';

export const phongNoiDung = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-noi-dung', display: 'swap',
});

export const phongTieuDe = Noto_Serif({
  subsets: ['vietnamese', 'latin'], weight: ['600', '700'], variable: '--font-tieu-de', display: 'swap',
});
