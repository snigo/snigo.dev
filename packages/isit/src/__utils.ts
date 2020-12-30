/* eslint-disable import/prefer-default-export */
export function getTagType(o: any): string {
  const tag = Object.prototype.toString.call(o);
  return tag.replace(/[[\]]/g, '').split(/\s+/).slice(1).join(' ');
}
