import isDate from './date';

export default function isDateLike(d: any): boolean {
  return isDate(d, 0) || !Number.isNaN(Date.parse(d));
}
