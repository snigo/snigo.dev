import round from './round';

/**
 * Converts string or number to a certain precision
 * NOTE! This function will not coerce values to number, so
 * ```
 * num(false) => NaN
 * num(null) => NaN
 * ```
 *
 * @param {string | number} numberLike Number to be converted
 * @param {number} precision Precision, the number to be rounded to
 */
function num(numberLike: any, precision = 12) {
  if (numberLike == null || Array.isArray(numberLike)) return NaN;

  const _s = numberLike.toString();
  const _n = /%$/.test(_s) ? +_s.slice(0, -1) / 100 : +_s;

  return precision !== undefined ? round(_n, precision) : _n;
}

export default num;
