import { getTagType } from './__utils';

export default function isNumber(n: any, includingObject: boolean | number = 0): boolean {
  return includingObject ? getTagType(n) === 'Number' : typeof n === 'number';
}
