import { getTagType } from './__utils';

export default function isPromise(p: any): boolean {
  return getTagType(p) === 'Promise';
}
