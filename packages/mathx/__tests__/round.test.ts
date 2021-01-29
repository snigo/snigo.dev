// @ts-nocheck
import round from '../src/round';

test('correctly rounds provided number or string', () => {
  expect(round(0.45876453, 4)).toBe(0.4588);
  expect(round('0.45876453', 4)).toBe(0.4588);
  expect(round(12.45, 1)).toBe(12.5);
  expect(round('1245', -2)).toBe(1200);
  expect(round(1250, -2)).toBe(1300);
  expect(round(-1250, -2)).toBe(-1200);
  expect(round(45, -1)).toBe(50);
  expect(round('45')).toBe(45);
  expect(round(0.1 + 0.2)).toBe(0.3);
  expect(round(0.145, 2)).toBe(0.15);
  expect(round('3.15e-3', 4)).toBe(0.0032);
  expect(round('0xfafa', -4)).toBe(60000);
});
