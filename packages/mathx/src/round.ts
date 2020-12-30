/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
function __incString(s: string, amount: number) {
  return String(+s > Number.MAX_SAFE_INTEGER ? BigInt(s) + BigInt(amount) : +s + amount);
}

function __padNumber(n: number | bigint, p: number) {
  if (p >= 0) return n;
  const _str = String(n);
  const _neg = _str.startsWith('-');
  const _dlen = _str.length - +_neg;
  const _sign = +!_neg || -1;
  const _up = +_str[_str.length + p] > 4 + +_neg;
  const _slice = _str.slice(+_neg, p);
  const _padded = (_neg ? '-' : '') + __incString(_slice, +_up * _sign).padEnd(_dlen, '0');
  return typeof n === 'bigint' ? BigInt(_padded) : Number(_padded);
}

/**
 * Rounds number to a certain precision.
 * Negative precision will work as well:
 * ```
 * round(1234, -2) => 1200
 * ```
 *
 * @param {number} num Number to be rounded
 * @param {number} precision Precision, the number to be rounded to
 *
 * @returns {number} Rounded number
 */
function round(num: number, precision: number): number;
function round(num: bigint, precision: number): bigint;
function round(num: any, precision: number = 12): any {
  if (typeof num === 'bigint') return precision < 0 ? __padNumber(num, precision) : num;
  return +(Math.round(num * 10 ** precision) * 10 ** -precision)
    .toFixed(precision < 0 ? 0 : precision);
}

export default round;
