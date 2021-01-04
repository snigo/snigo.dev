/* eslint-disable no-unused-vars */
import { isNumberLike } from '@snigo.dev/isit';
import { cfAlphanumeric } from './alpha';

const numericCheck = (a: any): boolean => isNumberLike(a) && !Number.isNaN(a);

export function cfNumeric<V = any>(a: V, b: V, direction: 'asc' | 'desc' = 'asc'): number {
  if (!numericCheck(a) && !numericCheck(b)) return cfAlphanumeric(a, b, direction);
  if (!numericCheck(a)) return direction === 'asc' ? 1 : -1;
  if (!numericCheck(b)) return direction === 'asc' ? -1 : 1;
  const _a = Number(a);
  const _b = Number(b);
  return direction === 'asc' ? _a - _b : _b - _a;
}

export function cfNumericAsc<V = any>(a: V, b: V): number {
  return cfNumeric<V>(a, b, 'asc');
}

export function cfNumericDesc<V = any>(a: V, b: V): number {
  return cfNumeric<V>(a, b, 'desc');
}

export function cfNumericBy<O = any>(
  prop: keyof O,
  direction: 'asc' | 'desc' = 'asc',
): (a: O, b: O) => number {
  return (a: O, b: O) => cfNumeric<O[keyof O]>(a[prop], b[prop], direction);
}
