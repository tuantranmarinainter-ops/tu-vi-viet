import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { tamCatThuMuc } from '../dev/build-static.mjs';

function docCauHinh(env: Record<string, string>) {
  const out = execFileSync(process.execPath, ['-e', 'console.log(JSON.stringify(require("./next.config.js")))'], { env: { ...process.env, ...env }, encoding: 'utf8' });
  return JSON.parse(out);
}

test('Bản tĩnh: output export, basePath và cờ NEXT_PUBLIC_STATIC', () => {
  const c = docCauHinh({ STATIC_EXPORT: '1', TUVI_BASE_PATH: '/tuvi' });
  assert.equal(c.output, 'export');
  assert.equal(c.trailingSlash, true);
  assert.equal(c.images.unoptimized, true);
  assert.equal(c.basePath, '/tuvi');
  assert.equal(c.env.NEXT_PUBLIC_STATIC, '1');
  assert.equal(c.env.NEXT_PUBLIC_BASE_PATH, '/tuvi');
});

test('Bản Node giữ nguyên cấu hình cũ', () => {
  const c = docCauHinh({ STATIC_EXPORT: '', TUVI_BASE_PATH: '' });
  assert.equal(c.output, undefined);
  assert.equal(c.basePath, undefined);
  assert.deepEqual(c.transpilePackages, ['lunar-javascript']);
});

test('Tạm cất thư mục rồi trả lại, kể cả khi build lỗi', async () => {
  const goc = mkdtempSync(path.join(tmpdir(), 'tuvi-'));
  mkdirSync(path.join(goc, 'app/api/v4'), { recursive: true });
  writeFileSync(path.join(goc, 'app/api/v4/route.ts'), 'x');
  await assert.rejects(tamCatThuMuc(goc, ['app/api'], async () => {
    assert.ok(!existsSync(path.join(goc, 'app/api')));
    throw new Error('build lỗi');
  }), /build lỗi/);
  assert.ok(existsSync(path.join(goc, 'app/api/v4/route.ts')));
});
