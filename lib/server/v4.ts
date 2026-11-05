import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Transform } from 'node:stream';
import * as zlib from 'node:zlib';
import type { BirthInfo, ZiweiChart } from '@/lib/ziwei/types';
import { generateChart } from '@/lib/ziwei/algorithm';
import { generateChart as generateReference } from '@/lib/ziwei/v4-reference/algorithm';

const RELEASE = 'https://github.com/Renhuai123/ziwei-doushu/releases/download/v4.0-13d/';
const cacheDir = path.join(process.cwd(), 'data', 'v4');
const downloads = new Map<number, Promise<string>>();
const records = new Map<string, V4Record>();
interface V4Record { k: string; y: number; m: number; d: number; h: number; g: 'male' | 'female'; ms: string | null; c: Record<string, string> }

export function chartFingerprint(chart: ZiweiChart): string {
  return JSON.stringify({
    lunar: [chart.lunarInfo.lunarYear, chart.lunarInfo.lunarMonth, chart.lunarInfo.lunarDay, chart.lunarInfo.yearStem, chart.lunarInfo.yearBranch],
    ming: chart.mingGongBranch, shen: chart.shenGongBranch, ju: chart.wuxingJu,
    palaces: [...chart.palaces].sort((a, b) => a.branch - b.branch).map(palace => ({
      branch: palace.branch, stem: palace.stem, name: palace.name,
      stars: palace.stars.map(star => [star.name, star.type, star.siHua ?? '', star.brightnessRaw ?? '']).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
    })),
  });
}

export function checkV4Compatibility(birth: BirthInfo) {
  const reference = generateReference({ year: birth.year, month: birth.month, day: birth.day, hour: birth.hour, gender: birth.gender });
  const actual = generateChart(birth);
  return { matches: chartFingerprint(reference as ZiweiChart) === chartFingerprint(actual), reference };
}

async function download(filename: string, maxBytes: number): Promise<Buffer> {
  const response = await fetch(RELEASE + filename, { signal: AbortSignal.timeout(45_000), cache: 'no-store' });
  if (!response.ok || !response.body) throw new Error(`Không tải được dữ liệu v4 (HTTP ${response.status}).`);
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) throw new Error('Tệp dữ liệu vượt giới hạn cho phép.');
      chunks.push(value);
    }
  } finally { await reader.cancel().catch(() => undefined); }
  return Buffer.concat(chunks);
}

async function ensureYearInner(year: number): Promise<string> {
  await mkdir(cacheDir, { recursive: true });
  const sumsFile = path.join(cacheDir, 'SHA256SUMS.txt');
  let sums: string;
  try { sums = await readFile(sumsFile, 'utf8'); }
  catch { sums = (await download('SHA256SUMS.txt', 256_000)).toString('utf8'); await writeFile(sumsFile, sums, 'utf8'); }
  const filename = `year-${year}.jsonl.zst`;
  const expected = sums.split(/\r?\n/).find(line => line.trim().endsWith(`  ${filename}`))?.split(/\s+/)[0];
  if (!expected || !/^[a-f0-9]{64}$/i.test(expected)) throw new Error('Thiếu checksum hợp lệ cho năm đã chọn.');
  const location = path.join(cacheDir, filename);
  const hash = (buffer: Buffer) => createHash('sha256').update(buffer).digest('hex');
  try { if (hash(await readFile(location)) === expected.toLowerCase()) return location; } catch { /* Download only this year. */ }
  const compressed = await download(filename, 8 * 1024 * 1024);
  if (hash(compressed) !== expected.toLowerCase()) throw new Error('Checksum dữ liệu không khớp; đã từ chối tệp.');
  await writeFile(location, compressed);
  return location;
}

export async function ensureV4Year(year: number): Promise<string> {
  if (!Number.isInteger(year) || year < 1950 || year > 2026) throw new RangeError('V4 chỉ có dữ liệu năm 1950–2026.');
  if (!downloads.has(year)) downloads.set(year, ensureYearInner(year).finally(() => downloads.delete(year)));
  return downloads.get(year)!;
}

export async function findV4Record(location: string, birth: BirthInfo): Promise<V4Record | null> {
  const native = zlib as unknown as { createZstdDecompress?: (options?: { params: Record<number, number> }) => Transform };
  if (!native.createZstdDecompress) throw new Error('Bộ đọc v4 cần Node có Zstandard; hãy chạy app bằng runtime portable.');
  const input = createReadStream(location);
  const decoder = native.createZstdDecompress({ params: { 100: 27 } }); // ZSTD_d_windowLogMax
  input.on('error', error => decoder.destroy(error));
  decoder.setEncoding('utf8');
  input.pipe(decoder);
  let pending = '';
  const match = (line: string) => {
    if (line.length > 2_000_000) throw new Error('Một record v4 vượt giới hạn.');
    const record = JSON.parse(line) as V4Record;
    return record.y === birth.year && record.m === birth.month && record.d === birth.day && record.h === birth.hour && record.g === birth.gender ? record : null;
  };
  try {
    for await (const chunk of decoder) {
      pending += String(chunk);
      let newline: number;
      while ((newline = pending.indexOf('\n')) !== -1) {
        const line = pending.slice(0, newline).trim();
        pending = pending.slice(newline + 1);
        if (line) { const record = match(line); if (record) return record; }
      }
      if (pending.length > 2_000_000) throw new Error('Một record v4 vượt giới hạn.');
    }
    return pending.trim() ? match(pending.trim()) : null;
  } finally { input.destroy(); decoder.destroy(); }
}

export async function getV4Reading(birth: BirthInfo, topic: string) {
  const compatibility = checkV4Compatibility(birth);
  if (!compatibility.matches) return { message: 'Lá số hiện tại khác engine tại tag v4.0-13d. Chưa gắn bài luận để tránh đọc nhầm. Muốn đối chiếu dữ liệu gốc, chọn engine v4 và hệ lịch gốc trong biểu mẫu.' };
  const key = `${birth.year}-${String(birth.month).padStart(2, '0')}-${String(birth.day).padStart(2, '0')}-${birth.hour}-${birth.gender}`;
  let record = records.get(key);
  if (!record) {
    record = await findV4Record(await ensureV4Year(birth.year), birth) ?? undefined;
    if (record) { if (records.size >= 24) records.delete(records.keys().next().value!); records.set(key, record); }
  }
  if (!record) return { message: 'Không tìm thấy record chính xác trong tệp dữ liệu.' };
  const firstMajor = compatibility.reference.palaces.find(palace => palace.isMingGong)?.stars.find(star => star.type === 'major')?.name ?? null;
  if (record.k !== key || record.ms !== firstMajor || typeof record.c?.[topic] !== 'string') return { message: 'Thông tin record chưa khớp bằng chứng engine; đã từ chối hiển thị.' };
  const sourceHash = createHash('sha256').update(`v4.0-13d:${topic}:${record.c[topic]}`).digest('hex');
  return { key, sourceHash, text: record.c[topic], attribution: 'Dữ liệu Ziwei Doushu v4.0-13d — 王多鱼AI / Renhuai123, CC BY 4.0. Trích dẫn Tian Ji có điều kiện riêng trong DATASET-LICENSE. Đối chiếu tag phát hành không xác minh được toàn bộ thư viện luận giải đóng.' };
}
