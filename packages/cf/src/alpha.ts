/* eslint-disable no-unused-vars */
export function cfAlphanumeric<V = any>(a: V, b: V, direction: 'asc' | 'desc' = 'asc'): number {
  const _start = String(direction === 'desc' ? b : a);
  const _end = String(direction === 'desc' ? a : b);
  return _start.localeCompare(_end);
}

export function cfAlphanumericAsc<V = any>(a: V, b: V): number {
  return cfAlphanumeric<V>(a, b, 'asc');
}

export function cfAlphanumericDesc<V = any>(a: V, b: V): number {
  return cfAlphanumeric<V>(a, b, 'desc');
}

export function cfAlphanumericBy<O = any>(
  prop: keyof O,
  direction: 'asc' | 'desc' = 'asc',
): (a: O, b: O) => number {
  return (a: O, b: O) => cfAlphanumeric<O[keyof O]>(a[prop], b[prop], direction);
}
