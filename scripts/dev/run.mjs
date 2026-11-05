import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = fileURLToPath(new URL('../../', import.meta.url));
const [command = 'dev', ...args] = process.argv.slice(2);
const runtimeDir = path.join(root, 'work/runtime');
const portable = existsSync(runtimeDir) ? readdirSync(runtimeDir)
  .filter(name => /^node-v22\./.test(name))
  .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
  .map(name => path.join(runtimeDir, name, 'node.exe'))
  .find(candidate => existsSync(candidate)) : undefined;
const [major, minor] = process.versions.node.split('.').map(Number);
const supported = (major === 22 && minor >= 15) || major >= 24;
const runtime = supported ? process.execPath : portable;
if (!runtime) {
  console.error('Cần Node 22.15+ hoặc >=24. Có thể đặt bản portable đã xác minh trong work/runtime.');
  process.exit(1);
}
const entries = {
  dev: ['node_modules/next/dist/bin/next', 'dev', '--webpack', '--hostname', '127.0.0.1'],
  build: ['node_modules/next/dist/bin/next', 'build', '--webpack'],
  start: ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1'],
  test: ['node_modules/tsx/dist/cli.mjs', 'scripts/regression/run-all.ts'],
  'test-vietnam': ['node_modules/tsx/dist/cli.mjs', 'scripts/regression/vietnam-time.test.ts'],
  'test-calendar': ['node_modules/tsx/dist/cli.mjs', 'scripts/regression/vietnam-calendar.test.ts'],
  'test-v4': ['node_modules/tsx/dist/cli.mjs', 'scripts/regression/v4.test.ts'],
  'test-readings': ['node_modules/tsx/dist/cli.mjs', 'scripts/regression/vietnam-readings.test.ts'],
  doctor: ['scripts/dev/doctor.mjs'],
};
if (!Object.hasOwn(entries, command)) {
  console.error(`Lệnh không hỗ trợ: ${command}`);
  process.exit(1);
}
const child = spawn(runtime, [...entries[command], ...args], {
  cwd: root, stdio: 'inherit', env: { ...process.env, PATH: `${path.dirname(runtime)}${path.delimiter}${process.env.PATH ?? ''}` },
});
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
