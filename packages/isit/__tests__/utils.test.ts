// @ts-nocheck
import { getTagType } from '../src/__utils';

test('gets correct tag type', () => {
  expect(getTagType(new Promise((r) => r(1)))).toBe('Promise');
  expect(getTagType([])).toBe('Array');
  expect(getTagType({})).toBe('Object');
  expect(getTagType(Object.create(null))).toBe('Object');
  expect(getTagType('')).toBe('String');
  expect(getTagType(43)).toBe('Number');
  expect(getTagType(43n)).toBe('BigInt');
  expect(getTagType(true)).toBe('Boolean');
  expect(getTagType(null)).toBe('Null');
  expect(getTagType(undefined)).toBe('Undefined');
  expect(getTagType()).toBe('Undefined');
  expect(getTagType(new Date())).toBe('Date');
});
