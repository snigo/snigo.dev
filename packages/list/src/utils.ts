/* eslint-disable valid-typeof */
import { num } from '@snigo.dev/mathx';
import { isConstructor, isFunction } from '@snigo.dev/isit';
import { DEFAULT_LIST_DESCRIPTOR, ListDescriptor, MAX_ARRAY_SIZE } from './const';

export function chain(...fns: (Function)[]) {
  return function (...args: any[]) {
    return (fns.reduce((result, fn, i) => {
      if (isFunction(fn)) return i ? fn(result) : fn(...result);
      return result;
    }, args) as any);
  };
}

export function defaults<T = any>(obj: Partial<T>, source: T): T {
  if (obj == null || typeof obj !== 'object') return source;
  if (source == null) return obj as T;
  const output: Partial<T> = {};
  (Object.keys(source) as (keyof T)[]).forEach((k: keyof T) => {
    output[k] = obj[k] === undefined ? source[k] : obj[k];
  });

  return output as T;
}

export function getTypedKeys<T = any>(type: string, object: T): (keyof T)[] {
  const __t = String(type).toLowerCase();
  try {
    return (Object.keys(object) as (keyof T)[])
      .filter((key: keyof T) => typeof object[key] === __t);
  } catch (e) {
    return [];
  }
}

export function __validateLength(length: number, max: number = MAX_ARRAY_SIZE): void {
  const __l = +length;
  if (
    Number.isNaN(__l)
    || __l < 0
    || __l > max
    || __l % 1 !== 0
  ) throw RangeError('Invalid list length');
}

export function __validateCtor(ctor: Function): void {
  if (!isConstructor(ctor)) {
    throw TypeError(`${ctor} is not a constructor.`);
  }
}

export function __fitDescriptor(descriptor: ListDescriptor): ListDescriptor {
  const _descriptor: ListDescriptor = { ...descriptor };
  const booleanProperties = getTypedKeys<ListDescriptor>('boolean', DEFAULT_LIST_DESCRIPTOR);
  booleanProperties.forEach((prop: keyof ListDescriptor) => {
    (<any>_descriptor)[prop] = !!_descriptor[prop];
  });

  const lengthProperties: ['length', 'maxSize'] = ['length', 'maxSize'];
  lengthProperties.forEach((prop: 'length' | 'maxSize') => {
    _descriptor[prop] = num(_descriptor[prop], 0);
  });

  const stringProperties = getTypedKeys<ListDescriptor>('string', DEFAULT_LIST_DESCRIPTOR);
  stringProperties.forEach((prop: keyof ListDescriptor) => {
    (<any>_descriptor)[prop] = String(_descriptor[prop]).toLowerCase();
  });

  if (!Array.isArray(_descriptor.allowTypes)) {
    throw TypeError('allowTypes property must be an array or list .');
  }
  _descriptor.allowTypes = [...new Set(_descriptor.allowTypes)];

  return _descriptor;
}

export function __validateDescriptor(descriptor: ListDescriptor): ListDescriptor {
  /**
   * Length / max-size validation
   */
  const lengthProperties: ['length', 'maxSize'] = ['length', 'maxSize'];
  for (const prop of lengthProperties) {
    __validateLength(descriptor[prop]);
  }
  if (descriptor.length > descriptor.maxSize) {
    throw RangeError('List size cannot be greater than maxSize. Did you mean revrting them?');
  }

  if (!descriptor.length && !descriptor.expandable) {
    throw RangeError('Non-expandable list size cannot be 0.');
  }

  /**
   * types validation
   */
  for (const ctor of descriptor.allowTypes) {
    __validateCtor(ctor);
  }

  /**
   * order validation
   */
  if (descriptor.orderDirection !== 'asc' && descriptor.orderDirection !== 'desc') {
    throw TypeError('orderDirection value must be either "asc" or "desc".');
  }

  if (!['alphanumeric', 'numeric', 'date'].includes(descriptor.orderFn)) {
    throw TypeError('Incorrect order function value.');
  }

  /**
   * overflow validation
   */
  if (!['throw', 'ignore', 'push', 'swap'].includes(descriptor.overflow)) {
    throw TypeError('Incorrect overflow strategy value.');
  }

  return descriptor;
}
