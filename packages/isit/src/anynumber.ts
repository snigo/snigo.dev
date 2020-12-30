import isNumber from './number';

export default function isAnyNumber(n: any): boolean {
  return isNumber(n, 1) || typeof n === 'bigint';
}
