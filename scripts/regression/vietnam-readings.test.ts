import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateChart } from '../../lib/ziwei/algorithm';
import type { ZiweiChart } from '../../lib/ziwei/types';
import { getDetailedVietnameseReading, getReadingContext, READING_SOURCES } from '../../lib/ziwei/detailed-readings-vi';
import { getVietnameseReading } from '../../lib/ziwei/readings-vi';
import { STAR_TOPIC_CONTENT, type DetailedTopic } from '../../lib/ziwei/reading-content-vi';

const topics: DetailedTopic[] = ['overview', 'career', 'wealth', 'love'];
const names = ['命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄', '迁移', '仆役', '官禄', '田宅', '福德', '父母'];
const reference = generateChart({ year: 1990, month: 1, day: 1, hour: 0, gender: 'male', calendarSystem: 'vietnam' });
function fixture(rotation = 0): ZiweiChart {
  return { ...reference, mingGongBranch: rotation, shenGongBranch: (rotation + 8) % 12,
    palaces: names.map((name, index) => ({ name, branch: (index + rotation) % 12, stem: index % 10, stars: [] })) };
}
const allItems = (chart: ZiweiChart, topic: DetailedTopic = 'overview') => getDetailedVietnameseReading(chart, topic).sections.flatMap(section => section.items);

test('Reading relationships follow branches at all rotations, including unordered palace arrays', () => {
  for (let rotation = 0; rotation < 12; rotation++) {
    const chart = fixture(rotation);
    chart.palaces.reverse();
    for (const name of ['命宫', '官禄', '财帛', '夫妻']) {
      const target = chart.palaces.find(palace => palace.name === name)!;
      // Deliberately wrong legacy metadata must not override actual branch geometry.
      target.oppositeBranch = target.branch;
      assert.deepEqual(getReadingContext(chart, target).map(item => item.palace?.branch), [0, 4, 8, 6].map(offset => (target.branch + offset) % 12));
    }
  }
});

test('A support pair requires both stars within this topic context, not elsewhere in chart', () => {
  const chart = fixture();
  chart.palaces[0].stars = [{ name: '左辅', type: 'lucky' }];
  chart.palaces[1].stars = [{ name: '右弼', type: 'lucky' }];
  assert.ok(!allItems(chart).some(item => item.id === 'pair-ta-huu'));
  chart.palaces[4].stars = chart.palaces[1].stars;
  chart.palaces[1].stars = [];
  const pair = allItems(chart).find(item => item.id === 'pair-ta-huu')!;
  assert.ok(pair.title.includes('tam phương tứ chính'));
  assert.ok(!pair.title.includes('đồng cung'));
  assert.ok(pair.evidence.some(line => line.includes('Tả Phù') && line.includes('Mệnh')));
  assert.ok(pair.evidence.some(line => line.includes('Hữu Bật') && line.includes('Tài Bạch')));
  // For love, branch 0 is outside context: the same two stars cannot trigger a pair.
  assert.ok(!allItems(chart, 'love').some(item => item.id === 'pair-ta-huu'));
});

test('Empty palace reads actual opposite principals without moving their brightness or transformations', () => {
  const chart = fixture();
  chart.palaces[0].borrowedStars = ['紫微']; // stale cache, must be ignored
  chart.palaces[6].stars = [{ name: '天机', type: 'major', brightnessRaw: '陷', siHua: '忌' }];
  const items = allItems(chart);
  const principal = items.find(item => item.id === 'principal-天机')!;
  assert.match(principal.title, /đối cung/);
  assert.ok(principal.evidence[0].includes('Thiên Di tại Ngọ'));
  assert.ok(principal.evidence[0].includes('Hãm'));
  assert.ok(!items.some(item => item.id === 'principal-紫微'));
  assert.equal(items.filter(item => item.id.startsWith('hua-')).length, 1);
  chart.palaces[6].stars = [];
  assert.ok(!allItems(chart).some(item => item.id.startsWith('principal-')));
});

test('Loc/Ky synthesis distinguishes same-palace from separate-palace and excludes unrelated palaces', () => {
  const chart = fixture();
  chart.palaces[0].stars = [{ name: '武曲', type: 'major', siHua: '禄' }];
  chart.palaces[4].stars = [{ name: '天机', type: 'major', siHua: '忌' }];
  assert.match(allItems(chart).find(item => item.id === 'loc-ky')!.text, /không gọi là đồng cung/);
  chart.palaces[0].stars.push(chart.palaces[4].stars[0]); chart.palaces[4].stars = [];
  assert.match(allItems(chart).find(item => item.id === 'loc-ky')!.text, /^Có Lộc và Kỵ đồng cung/);
  chart.palaces[1].stars = [chart.palaces[0].stars.pop()!];
  assert.ok(!allItems(chart).some(item => item.id === 'loc-ky'));
});

test('All 14 principals have four distinct editorial readings, preserving exact brightness labels', () => {
  assert.equal(Object.keys(STAR_TOPIC_CONTENT).length, 14);
  for (const name of Object.keys(STAR_TOPIC_CONTENT)) {
    const chart = fixture();
    for (const index of [0, 2, 4, 8]) chart.palaces[index].stars = [{ name, type: 'major', brightnessRaw: '利' }];
    const texts = topics.map(topic => {
      const item = allItems(chart, topic).find(item => item.id === `principal-${name}`)!;
      assert.ok(item.evidence[0].includes('(Lợi)'));
      assert.ok(item.sourceIds.includes('editorial'));
      return item.text;
    });
    assert.equal(new Set(texts).size, 4);
    assert.ok(!allItems(chart).some(item => item.id === 'brightness'));
  }
});

test('Unknown principals and missing palaces produce explicit gaps, never fabricated interpretations', () => {
  const chart = fixture();
  chart.palaces[0].stars = [{ name: 'chua-co-noi-dung', type: 'major' }];
  let reading = getDetailedVietnameseReading(chart, 'overview');
  assert.ok(reading.gaps.some(gap => gap.includes('chua-co-noi-dung')));
  chart.palaces = chart.palaces.filter(palace => palace.branch !== 6);
  reading = getDetailedVietnameseReading(chart, 'overview');
  assert.ok(reading.gaps.some(gap => gap.includes('Thiếu cung ở địa chi Ngọ')));
  chart.palaces = [];
  reading = getDetailedVietnameseReading(chart, 'career');
  assert.equal(reading.sections.length, 0);
  assert.ok(reading.gaps.some(gap => gap.includes('Thiếu cung chính')));
});

test('Mệnh/Thân distinction uses actual branch positions and reports co-location only when true', () => {
  const chart = fixture();
  assert.match(allItems(chart).find(item => item.id === 'ming-shen')!.text, /hai vị trí khác nhau/);
  chart.shenGongBranch = chart.mingGongBranch;
  assert.match(allItems(chart).find(item => item.id === 'ming-shen')!.text, /cùng vị trí/);
});

test('A transformation in a related palace keeps that palace role instead of inheriting current topic', () => {
  const chart = fixture();
  chart.palaces[8].stars = [{ name: '武曲', type: 'major', siHua: '权' }];
  const item = allItems(chart, 'love').find(item => item.id === 'hua-8-武曲')!;
  assert.match(item.text, /kiểm soát tiến độ/);
  assert.match(item.text, /không chuyển thành hóa tại Phu Thê/);
  assert.ok(!item.text.includes('quyết định chung'));
});

test('Actual charts keep facts unchanged, source references valid, and natal readings independent of selected age', () => {
  for (const birth of [
    { year: 1985, month: 1, day: 21, hour: 6, gender: 'female' as const, calendarSystem: 'vietnam' as const },
    { year: 1990, month: 1, day: 1, hour: 0, gender: 'male' as const, calendarSystem: 'chinese' as const, engineVersion: 'v4' as const },
    { year: 2004, month: 3, day: 21, hour: 11, gender: 'male' as const, calendarSystem: 'vietnam' as const },
  ]) {
    const chart = generateChart(birth);
    const before = JSON.stringify(chart);
    for (const topic of topics) {
      const reading = getVietnameseReading(chart, topic).detailed!;
      assert.equal(reading.sections.length, 4);
      assert.equal(reading.questions.length, 3);
      const ids = reading.sections.flatMap(section => section.items.map(item => item.id));
      assert.equal(new Set(ids).size, ids.length);
      for (const item of reading.sections.flatMap(section => section.items)) {
        assert.ok(item.evidence.length > 0, item.id);
        for (const sourceId of item.sourceIds) assert.ok(READING_SOURCES[sourceId]);
        assert.ok(!/[\u3400-\u9fff]/u.test([item.title, item.text, ...item.evidence].join(' ')), item.id);
      }
      assert.deepEqual(reading, getVietnameseReading({ ...chart, currentAge: 99, currentDaXianIndex: 0 }, topic).detailed);
    }
    assert.equal(JSON.stringify(chart), before);
    assert.equal(getVietnameseReading(chart, 'health').detailed, undefined);
  }
});
