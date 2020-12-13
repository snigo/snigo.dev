import { precision } from '@snigo.dev/mathx';

/**
 * Determines if Range is iterable and throws error if not
 */
export function checkLength() {
  const MAX_ARRAY_SIZE = 4294967295;
  if (this.length > MAX_ARRAY_SIZE) {
    throw RangeError('Cannot iterate infinite size range');
  }
}

/**
 * Verifies step argument
 * @param {number} step Step value
 */
export function normalizeStep(step = 1) {
  let _step = +step;
  if (Number.isNaN(_step)) _step = 1;
  if (_step <= 0) throw TypeError('Step cannot be 0 or negative number');

  return _step;
}

/**
 * Returns max precision from the array of numbers
 * @param {number[]} numbers
 */
export function maxPrecision(numbers: number[]): number {
  if (!Array.isArray(numbers)) return NaN;
  return Math.max(...numbers.map(precision));
}
