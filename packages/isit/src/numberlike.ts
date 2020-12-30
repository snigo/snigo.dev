/* eslint-disable eqeqeq */
import isAnyNumber from './anynumber';

export default function isNumberLike(n: any): boolean {
  return isAnyNumber(n) || n == Number(n);
}
