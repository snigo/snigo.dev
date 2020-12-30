import { isNumberLike } from '@snigo.dev/isit';
import { cfAlphanumeric } from './alpha';

export function cfNumeric(a: any, b: any, direction: 'asc' | 'desc' = 'asc'): number {
  if (!isNumberLike(a) && !isNumberLike(b)) return cfAlphanumeric(a, b, direction);
  if (!isNumberLike(a)) return direction === 'asc' ? 1 : -1;
  if (!isNumberLike(b)) return direction === 'asc' ? -1 : 1;
  return direction === 'asc' ? a - b : b - a;
}

export function cfNumericAsc(a: any, b: any): number {
  return cfNumeric(a, b, 'asc');
}

export function cfNumericDesc(a: any, b: any): number {
  return cfNumeric(a, b, 'desc');
}
