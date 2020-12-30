import isNullish from './nullish';

export default function isIterable(i: any): boolean {
  return !isNullish(i) && typeof i[Symbol.iterator] === 'function';
}
