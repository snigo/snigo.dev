export default function isArrow(fn: any): boolean {
  return typeof fn === 'function' && (/^([^{=]+|\(.*\)\s*)?=>/).test(fn.toString().replace(/\s/, ''));
}
