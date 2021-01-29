import { getTagType } from './__utils';

export default function isDate(d: any, includingInvalid: boolean | number = 1): boolean {
  return (
    typeof d === 'object'
      && getTagType(d) === 'Date'
      && (!includingInvalid ? !Number.isNaN(+d) : true)
  );
}
