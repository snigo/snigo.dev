import isDate from './date';

export default function isDateLike(d: any): boolean {
  return isDate(d) || !Number.isNaN(Date.parse(d));
}
