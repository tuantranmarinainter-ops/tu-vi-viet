import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const [major, minor] = process.versions.node.split('.').map(Number);
const checks = [
  {
    name: `Node ${process.versions.node}; yêu cầu ${manifest.engines.node}`,
    pass: (major === 22 && minor >= 15) || major >= 24,
    help: 'Cập nhật bản Node 22.x mới (tối thiểu 22.15), hoặc Node >=24. Không cần hạ phiên bản mới hơn.',
  },
  {
    name: 'package-lock.json hiện diện',
    pass: existsSync(path.join(root, 'package-lock.json')),
    help: 'Khôi phục lockfile trước khi cài thư viện.',
  },
  {
    name: 'Thư viện TypeScript và tsx đã cài',
    pass: ['typescript', 'tsx'].every(name => existsSync(path.join(root, 'node_modules', name, 'package.json'))),
    help: 'Chạy npm.cmd ci trong thư mục project sau khi Node phù hợp.',
  },
  {
    name: 'Có hướng dẫn và cấu hình project',
    pass: ['AGENTS.md', '.codex/config.toml', '.codex/agents/vi-worker.toml'].every(name => existsSync(path.join(root, name))),
    help: 'Kiểm tra các tệp thiết lập trong repo. Sự hiện diện không chứng minh Codex đã nạp cấu hình.',
  },
];

for (const check of checks) {
  console.log(`${check.pass ? 'PASS' : 'FAIL'} ${check.name}`);
  if (!check.pass) console.log(`  ${check.help}`);
}
console.log('Doctor chỉ kiểm tra cục bộ; không cài đặt, gọi AI hay thay đổi hệ thống.');
if (checks.some(check => !check.pass)) process.exitCode = 1;
