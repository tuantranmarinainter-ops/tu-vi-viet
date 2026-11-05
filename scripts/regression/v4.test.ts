import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import * as zlib from 'node:zlib';
import { findV4Record, checkV4Compatibility, chartFingerprint, ensureV4Year } from '../../lib/server/v4';
import { generateChart } from '../../lib/ziwei/algorithm';
import { validateTranslation, translationCacheKey } from '../../lib/ziwei/v4-translation';

test('V4 reference profile matches, while a changed chart is not silently accepted', () => {
  const birth = { year: 1990, month: 1, day: 1, hour: 0, gender: 'male' as const, calendarSystem: 'chinese' as const, engineVersion: 'v4' as const };
  assert.equal(checkV4Compatibility(birth).matches, true);
  const chart = generateChart(birth);
  const modified = structuredClone(chart);
  modified.palaces[0].stars[0].siHua = '忌';
  assert.notEqual(chartFingerprint(chart), chartFingerprint(modified));
  assert.equal(checkV4Compatibility({ year: 1985, month: 1, day: 21, hour: 6, gender: 'male', calendarSystem: 'vietnam' }).matches, false);
});

test('V4 stream reads the exact date, branch and gender without a JSONL file on disk', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'tuvi-v4-'));
  try {
    const rows = [
      { k: '1990-01-01-0-male', y: 1990, m: 1, d: 1, h: 0, g: 'male', ms: '天府', c: { overview: 'original' } },
      { k: '1990-01-01-1-female', y: 1990, m: 1, d: 1, h: 1, g: 'female', ms: null, c: { overview: 'target 天府 tiếng Việt' } },
    ];
    const native = zlib as unknown as { zstdCompressSync: (data: Buffer) => Buffer };
    const location = path.join(directory, 'sample.zst');
    await writeFile(location, native.zstdCompressSync(Buffer.from(rows.map(row => JSON.stringify(row)).join('\n') + '\n')));
    const record = await findV4Record(location, { year: 1990, month: 1, day: 1, hour: 1, gender: 'female' });
    assert.equal(record?.c.overview, 'target 天府 tiếng Việt');
    assert.equal(await findV4Record(location, { year: 1990, month: 1, day: 1, hour: 2, gender: 'female' }), null);
    const corrupt = path.join(directory, 'corrupt.zst');
    await writeFile(corrupt, 'not zstandard');
    await assert.rejects(() => findV4Record(corrupt, { year: 1990, month: 1, day: 1, hour: 0, gender: 'male' }));
  } finally {
    if (path.dirname(path.resolve(directory)) !== path.resolve(tmpdir()) || !path.basename(directory).startsWith('tuvi-v4-')) throw new Error('Unexpected temporary directory');
    await rm(directory, { recursive: true, force: true });
  }
});

test('V4 rejects unsupported years before any download', async () => {
  await assert.rejects(() => ensureV4Year(1949), /1950/);
  await assert.rejects(() => ensureV4Year(2027), /2026/);
});

test('Vietnamese translation imports are bound to source content, topic and glossary version', () => {
  const expected = { hash: 'sample-hash', key: '1990-01-01-0-male', topic: 'overview' };
  const data = { format: 'tuvi-v4-translation-v1', language: 'vi', glossaryVersion: 'vi-v1', sourceHash: expected.hash, sourceKey: expected.key, topic: expected.topic, translation: 'Bản dịch kiểm thử.' };
  assert.equal(validateTranslation(data, expected), data.translation);
  for (const invalid of [{ ...data, sourceHash: 'other' }, { ...data, topic: 'love' }, { ...data, glossaryVersion: 'old' }, { ...data, translation: '' }]) assert.throws(() => validateTranslation(invalid, expected));
  assert.notEqual(translationCacheKey('first'), translationCacheKey('second'));
});
