import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { BirthFormState } from '../../components/BirthForm';
import { formToBirthInfo, formToSearchParams, searchParamsToForm } from '../../lib/ziwei/share';

const base: BirthFormState = {
  name: '', year: '1990', month: '5', day: '10', clockHour: '8', clockMinute: '0', unknownTime: false,
  province: '', city: '', longitude: 105, gender: 'male', calendarSystem: 'vietnam', inputCalendar: 'solar',
  utcOffsetMinutes: 420, timeConvention: 'clock', lateZishi: 'next-day', leapMonthPolicy: 'split', engineVersion: 'current',
};

test('Liên kết giữ năm xem, cờ ẩn và giờ theo chi', () => {
  const back = searchParamsToForm(formToSearchParams({ ...base, namXem: '2027', anHoTen: true, anNgaySinh: true, gioChi: 3 }))!;
  assert.equal(back.namXem, '2027');
  assert.equal(back.anHoTen, true);
  assert.equal(back.anNgaySinh, true);
  assert.equal(back.gioChi, 3);
  const plain = searchParamsToForm(formToSearchParams(base))!;
  assert.equal(plain.anHoTen, false);
  assert.equal(plain.gioChi, undefined);
});

test('Liên kết không bao giờ chứa mô tả bản thân', () => {
  const moTa = 'năm 2019 đổi việc, hỏi về sự nghiệp';
  const p = formToSearchParams({ ...base, moTa });
  assert.ok(![...p.values()].some(v => v.includes('2019 đổi việc')));
  assert.equal(searchParamsToForm(p)!.moTa, undefined);
});

test('Nhập âm lịch theo chi: giờ Sửu cho ra chi Sửu, bỏ qua hiệu chỉnh giờ mặt trời', () => {
  const lunar = { ...base, inputCalendar: 'lunar' as const, month: '3', day: '9', gioChi: 1, clockHour: '17', timeConvention: 'solar' as const, city: 'Hà Nội', longitude: 105.85 };
  assert.equal(formToBirthInfo(lunar).hour, 1);
  assert.equal(formToBirthInfo({ ...lunar, gioChi: 0 }).hour, 0);
  assert.equal(formToBirthInfo({ ...lunar, gioChi: 11 }).hour, 11);
});
