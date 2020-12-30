import { getTagType } from './__utils';

export default function isBoolean(s: any, includingObject: boolean | number = 0): boolean {
  return includingObject ? getTagType(s) === 'Boolean' : typeof s === 'boolean';
}
