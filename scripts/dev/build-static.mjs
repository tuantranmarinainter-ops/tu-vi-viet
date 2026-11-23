// Đóng gói bản web tĩnh: tạm cất các route cần máy chủ, build với STATIC_EXPORT=1, rồi trả lại.
import { existsSync, mkdirSync, renameSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Các thư mục chỉ chạy được trên máy chủ: API v4 và trang tìm kiếm cổ thư (đọc tham số phía máy chủ). */
export const CHI_MAY_CHU = ['app/api', 'app/library/search'];

export async function tamCatThuMuc(goc, danhSach, viec) {
  const kho = path.join(goc, 'work', 'tam-build-static');
  const daCat = [];
  try {
    for (const rel of danhSach) {
      const nguon = path.join(goc, rel);
      if (!existsSync(nguon)) continue;
      const dich = path.join(kho, rel);
      mkdirSync(path.dirname(dich), { recursive: true });
      renameSync(nguon, dich);
      daCat.push([dich, nguon]);
    }
    return await viec();
  } finally {
    for (const [dich, nguon] of daCat.reverse()) renameSync(dich, nguon);
  }
}

async function chay() {
  const goc = fileURLToPath(new URL('../../', import.meta.url));
  const ma = await tamCatThuMuc(goc, CHI_MAY_CHU, async () =>
    spawnSync(process.execPath, [path.join(goc, 'scripts/dev/run.mjs'), 'build'], { cwd: goc, stdio: 'inherit', env: { ...process.env, STATIC_EXPORT: '1' } }).status ?? 1);
  if (ma === 0) console.log(`Bản web tĩnh nằm trong: ${path.join(goc, 'out')}`);
  process.exitCode = ma;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) void chay();
