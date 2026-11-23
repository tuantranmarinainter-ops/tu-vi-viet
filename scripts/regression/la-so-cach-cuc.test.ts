/**
 * Bản tiếng Việt lib/la-so/cach-cuc/ phải nhận diện y như bản gốc (docs/dich/nguon/lib/ziwei/).
 * - So trên 500 lá số giả lập: số cách cục, thứ tự mức `level`, số nhãn điều kiện; các bảng Định … cục; Định tạp cục.
 * - Chuỗi hiển thị bản Việt không còn chữ Hán.
 * Bản gốc được chép tạm ra thư mục hệ thống (bỏ `server-only`, trỏ `./types` về lib/ziwei/types) để chạy được.
 */
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { laSoNgauNhien } from './helpers/la-so-ngau-nhien';
import * as vi from '../../lib/la-so/cach-cuc/patterns';
import * as viGui from '../../lib/la-so/cach-cuc/patterns-dinggui';
import * as viFu from '../../lib/la-so/cach-cuc/patterns-dingfu';
import * as viPin from '../../lib/la-so/cach-cuc/patterns-dingpin';
import * as viZa from '../../lib/la-so/cach-cuc/patterns-dingza';
import * as viHe from '../../lib/la-so/cach-cuc/heming-knowledge';

const HAN = /[㐀-鿿]/;
const root = process.cwd();
const nguon = path.join(root, 'docs/dich/nguon/lib/ziwei');
const tam = mkdtempSync(path.join(tmpdir(), 'cach-cuc-goc-'));
const typesPath = path.join(root, 'lib/ziwei/types').replace(/\\/g, '/');
for (const f of readdirSync(nguon).filter(n => n.endsWith('.ts'))) {
  const s = readFileSync(path.join(nguon, f), 'utf8')
    .replace("import 'server-only';\n", '')
    .replace("from './types'", `from '${typesPath}'`);
  writeFileSync(path.join(tam, f), s);
}
const nap = (f: string) => import(pathToFileURL(path.join(tam, f)).href);

async function main() {
  const goc = await nap('patterns.ts');
  const gocGui = await nap('patterns-dinggui.ts');
  const gocFu = await nap('patterns-dingfu.ts');
  const gocPin = await nap('patterns-dingpin.ts');
  const gocZa = await nap('patterns-dingza.ts');
  const gocHe = await nap('heming-knowledge.ts');

  const coHan = (s: unknown, noi: string) => assert.ok(typeof s !== 'string' || !HAN.test(s), `${noi} còn chữ Hán: ${s}`);

  // Bảng tĩnh: cùng số điều, cùng trạng thái; chuỗi hiển thị không còn chữ Hán.
  for (const [ten, a, b] of [['DING_GUI_GE', viGui.DING_GUI_GE, gocGui.DING_GUI_GE], ['DING_FU_GE', viFu.DING_FU_GE, gocFu.DING_FU_GE],
    ['DING_PIN_GE', viPin.DING_PIN_GE, gocPin.DING_PIN_GE], ['DING_ZA_GE', viZa.DING_ZA_GE, gocZa.DING_ZA_GE]] as const) {
    assert.equal(a.length, b.length, ten);
    a.forEach((g: { no: number; status: string; name: string; note: string; why?: string }, i: number) => {
      assert.equal(g.no, b[i].no); assert.equal(g.status, b[i].status);
      for (const k of ['name', 'note', 'why'] as const) coHan(g[k], `${ten}[${i}].${k}`);
    });
  }
  assert.equal(viGui.DING_GUI_JUDGEABLE, gocGui.DING_GUI_JUDGEABLE);
  assert.equal(viZa.DING_ZA_JUDGEABLE, gocZa.DING_ZA_JUDGEABLE);

  // Kho kiến thức hợp hôn: cùng khóa, giá trị đã dịch.
  for (const ten of ['STAR_IN_FUQI_GU', 'SIHUA_IN_FUQI_GU', 'MARRIAGE_STARS_BRIEF', 'HEMING_SCORE_CRITERIA'] as const) {
    const a = viHe[ten] as Record<string, unknown>, b = gocHe[ten] as Record<string, unknown>;
    assert.deepEqual(Object.keys(a), Object.keys(b), ten);
    for (const [k, v] of Object.entries(a)) {
      if (typeof v === 'string') coHan(v, `${ten}.${k}`);
      else {
        assert.deepEqual(Object.keys(v as object), Object.keys(b[k] as object), `${ten}.${k}`);
        for (const [kk, vv] of Object.entries(v as object)) coHan(vv, `${ten}.${k}.${kk}`);
      }
    }
  }
  coHan(viHe.HEMING_METHODOLOGY, 'HEMING_METHODOLOGY');

  let tong = 0;
  for (const chart of laSoNgauNhien(500)) {
    const a = vi.detectPatterns(chart), b = goc.detectPatterns(chart);
    assert.deepEqual(a.map(p => p.level), b.map((p: { level: string }) => p.level));
    assert.deepEqual(a.map(p => p.palaces), b.map((p: { palaces: string[] }) => p.palaces));
    assert.deepEqual(
      a.map(p => [p.conditions?.required.length, p.conditions?.bonus?.length, p.conditions?.breaking?.length]),
      b.map((p: vi.Pattern) => [p.conditions?.required.length, p.conditions?.bonus?.length, p.conditions?.breaking?.length]));
    for (const p of a) {
      for (const s of [p.name, p.description, p.source, ...(p.conditions?.required ?? []), ...(p.conditions?.bonus ?? []), ...(p.conditions?.breaking ?? [])]) coHan(s, p.name);
    }
    tong += a.length;

    for (const [x, y] of [[viGui.detectDingGui, gocGui.detectDingGui], [viFu.detectDingFu, gocFu.detectDingFu], [viPin.detectDingPin, gocPin.detectDingPin]] as const) {
      assert.deepEqual(x(chart).map(h => h.no), y(chart).map((h: { no: number }) => h.no));
    }
    const za = viZa.detectDingZa(chart), zaGoc = gocZa.detectDingZa(chart);
    assert.deepEqual(za.map(h => [h.no, h.unit, h.startAge, h.endAge, h.palaceBranch]),
      zaGoc.map((h: viZa.DingZaHit) => [h.no, h.unit, h.startAge, h.endAge, h.palaceBranch]));
    for (const h of za) for (const s of [h.name, h.note, h.why, h.detail]) coHan(s, `Định tạp cục ${h.no}`);
    assert.equal(viZa.getCurrentDingZa(chart).length, gocZa.getCurrentDingZa(chart).length);

    const m = vi.getMingGongSummary(chart), mGoc = goc.getMingGongSummary(chart);
    assert.deepEqual(m.stars, mGoc.stars);
    assert.equal(m.keywords.length, mGoc.keywords.length);
    for (const s of [...m.keywords, m.nature]) coHan(s, 'getMingGongSummary');
  }
  assert.ok(tong > 500, `quá ít cách cục được nhận diện (${tong}), mẫu kiểm thử không đủ đại diện`);
  console.log(`la-so-cach-cuc: 500 lá số, ${tong} cách cục khớp bản gốc; chuỗi hiển thị không còn chữ Hán.`);
}

main().catch(e => { console.error(e); process.exit(1); });
