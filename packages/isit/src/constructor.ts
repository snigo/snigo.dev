import isFunction from './function';

export default function isConstructor(fn: any): boolean {
  if (!isFunction(fn)) return false;

  const handler = {
    construct() {
      return handler;
    },
  };
  const ProxyFn = new Proxy(fn, handler);
  try {
    return !!new ProxyFn();
  } catch (e) {
    return false;
  }
}
