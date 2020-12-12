import precision from './precision';
import round from './round';

/**
 * Checks if the first argument approximately equals
 * to the second argument within delta
 *
 * @param {number} a Number to be checked
 * @param {number} b Number to be checked
 * @param {number} delta Acceptable difference between a and b
 *
 * @returns {boolean} True or False
 */
function approx(a: number, b: number, delta: number = 0): boolean {
  const _p = Math.max(precision(a), precision(b), precision(delta));
  return round(+Math.abs(a - b), _p) <= delta;
}

export default approx;
