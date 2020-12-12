/**
 * Calculates precision of number
 *
 * @param {number} number Number to be checked
 *
 * @returns {number} Precision of the number
 */
function precision(number: number): number {
  const _n = +number;
  if (Number.isNaN(_n)) return NaN;

  const sciRe = /^[+-]?\d+(?:\.(\d+))?e([+-]?\d+)$/;
  const numRe = /^[+-]?\d+(?:\.(\d+))?$/;
  const zerosRe = /^[+-]?\d+?(0+)$/;

  const _s = _n.toString();

  if (zerosRe.test(_s)) {
    const group = _s.match(zerosRe)?.[1];
    return group ? -group.length : 0;
  }

  if (numRe.test(_s)) {
    const group = _s.match(numRe)?.[1];
    return group ? group.length : 0;
  }

  if (sciRe.test(_s)) {
    const [, numGroup = '', expGroup = 0] = Array.from(_s.match(sciRe) || []);
    return numGroup.length - +expGroup;
  }

  return 0;
}

export default precision;
