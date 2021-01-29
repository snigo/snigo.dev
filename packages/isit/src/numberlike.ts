/* eslint-disable eqeqeq */
import isAnyNumber from './anynumber';
import isBoolean from './boolean';

export default function isNumberLike(n: any): boolean {
  return (isAnyNumber(n) || n == Number(n)) && !isBoolean(n, 1);
}
