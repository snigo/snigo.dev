import { getTagType } from './__utils';

export default function isString(s: any, includingObject: boolean | number = 0): boolean {
  return includingObject ? getTagType(s) === 'String' : typeof s === 'string';
}
