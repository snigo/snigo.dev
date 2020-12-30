export function cfAlphanumeric(a: string, b: string, direction: 'asc' | 'desc' = 'asc'): number {
  const _start = String(direction === 'asc' ? a : b);
  const _end = String(direction === 'asc' ? b : a);
  return _start.localeCompare(_end);
}

export function cfAlphanumericAsc(a: string, b: string): number {
  return cfAlphanumeric(a, b, 'asc');
}

export function cfAlphanumericDesc(a: string, b: string): number {
  return cfAlphanumeric(a, b, 'desc');
}
