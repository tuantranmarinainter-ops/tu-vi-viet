import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const directory = path.join(process.cwd(), 'scripts/regression');
const tests = readdirSync(directory).filter(name => name.endsWith('.test.ts')).sort();
let failures = 0;
for (const test of tests) {
  const result = spawnSync(process.execPath, ['node_modules/tsx/dist/cli.mjs', path.join(directory, test)], { encoding: 'utf8', timeout: 180_000, maxBuffer: 4 * 1024 * 1024 });
  const passed = result.status === 0;
  console.log(`${passed ? 'PASS' : 'FAIL'} ${test}`);
  if (!passed) { failures++; console.error(result.error?.message ?? result.stderr ?? ''); console.error(result.stdout); }
}
console.log(`${tests.length - failures}/${tests.length} chương trình kiểm thử đạt; Node ${process.versions.node}.`);
if (failures) process.exitCode = 1;
