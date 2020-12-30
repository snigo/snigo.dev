import { getTagType } from './__utils';

export default function isDate(d: any): boolean {
  return typeof d === 'object' && getTagType(d) === 'Date';
}
