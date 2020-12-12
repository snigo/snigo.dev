// @ts-nocheck
/* eslint-disable no-new-wrappers */
import num from '../src/num';

test('correctly converts provided number to a certain precision', () => {
  expect(num('3.45e2')).toBe(345);
  expect(num('3.45e2', -1)).toBe(350);
  expect(num(0.2 + 0.1, 1)).toBe(0.3);
  expect(num('13.359%', 4)).toBe(0.1336);
  expect(num(100000000000000000000 * 100000000000000000000)).toBe(1e+40);
});

test('incorrect number values', () => {
  expect(num()).toBeNaN();
  expect(num(null)).toBeNaN();
  expect(num(false)).toBeNaN();
  expect(num(true)).toBeNaN();
  expect(num([1])).toBeNaN();
  expect(num('12n')).toBeNaN();
});

test('handles String and Number objects', () => {
  expect(num(new Number(42), -1)).toBe(40);
  expect(num(new String('5.1'), -1)).toBe(10);
});
