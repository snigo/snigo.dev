import { isDateLike } from '@snigo.dev/isit';
import { cfAlphanumeric } from './alpha';

export function cfDateTime(a: any, b: any, direction: 'asc' | 'desc' = 'asc'): number {
  if (!isDateLike(a) && !isDateLike(b)) return cfAlphanumeric(a, b, direction);
  if (!isDateLike(a)) return direction === 'asc' ? 1 : -1;
  if (!isDateLike(b)) return direction === 'asc' ? -1 : 1;
  const _start = Date.parse(direction === 'asc' ? a : b);
  const _end = Date.parse(direction === 'asc' ? b : a);
  return _start - _end;
}

export function cfDateTimeAsc(a: any, b: any): number {
  return cfDateTime(a, b, 'asc');
}

export function cfDateTimeDesc(a: any, b: any): number {
  return cfDateTime(a, b, 'desc');
}
