/* eslint-disable no-unused-vars */
import { isDateLike } from '@snigo.dev/isit';
import { cfAlphanumeric } from './alpha';

export function cfDateTime<V = any>(a: V, b: V, direction: 'asc' | 'desc' = 'asc'): number {
  if (!isDateLike(a) && !isDateLike(b)) return cfAlphanumeric(a, b, direction);
  if (!isDateLike(a)) return direction === 'asc' ? 1 : -1;
  if (!isDateLike(b)) return direction === 'asc' ? -1 : 1;
  const _sa = String(a);
  const _sb = String(b);
  const _start = Date.parse(direction === 'asc' ? _sa : _sb);
  const _end = Date.parse(direction === 'asc' ? _sb : _sa);
  return _start - _end;
}

export function cfDateTimeAsc<V = any>(a: V, b: V): number {
  return cfDateTime<V>(a, b, 'asc');
}

export function cfDateTimeDesc<V = any>(a: V, b: V): number {
  return cfDateTime<V>(a, b, 'desc');
}

export function cfDateTimeBy<O = any>(
  prop: keyof O,
  direction: 'asc' | 'desc' = 'asc',
): (a: O, b: O) => number {
  return (a: O, b: O) => cfDateTime<O[keyof O]>(a[prop], b[prop], direction);
}
