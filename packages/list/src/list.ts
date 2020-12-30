/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import { num } from '@snigo.dev/mathx';
import {
  chain,
  defaults,
  __fitDescriptor,
  __validateCtor,
  __validateDescriptor,
  __validateLength,
} from './utils';
import { ListDescriptor, DEFAULT_LIST_DESCRIPTOR } from './const';

const __len = new WeakMap<List, number>();
const __conf = new WeakMap<List, ListDescriptor>();

class List<T = any> {
  constructor(descriptor: Partial<ListDescriptor> = DEFAULT_LIST_DESCRIPTOR) {
    const descriptorChain = chain(defaults, __fitDescriptor, __validateDescriptor);
    const _descriptor: ListDescriptor = descriptorChain(descriptor, DEFAULT_LIST_DESCRIPTOR);
    __conf.set(this, _descriptor);
    __len.set(this, _descriptor.length);
  }

  /**
   * Getters
   */
  get changeable(): boolean {
    return this.getOwnDescriptor().changeable;
  }

  get expandable(): boolean {
    return this.getOwnDescriptor().expandable;
  }

  get length(): number {
    return __len.get(this) || 0;
  }

  get maxSize(): number {
    return this.getOwnDescriptor().maxSize;
  }

  get orderBy(): string {
    return this.getOwnDescriptor().orderBy;
  }

  get ordered(): boolean {
    return this.getOwnDescriptor().ordered;
  }

  get typed(): boolean {
    return this.getOwnDescriptor().typed;
  }

  get unique(): boolean {
    return this.getOwnDescriptor().unique;
  }

  /**
   * Setters
   */
  set changeable(value: boolean) {
    const __bool = !!value;
    this.getOwnDescriptor().changeable = __bool;
  }

  set expandable(value: boolean) {
    const __bool = !!value;
    this.getOwnDescriptor().expandable = __bool;
  }

  set length(value: number) {
    const __l = num(value, 0);
    __validateLength(__l, this.maxSize);
    for (let i = __l; i < this.length; i += 1) {
      delete (<any> this)[i];
    }
    __len.set(this, __l);
  }

  set maxSize(value: number) {
    const __num = num(value, 0);
    __validateLength(__num, this.length);
    this.getOwnDescriptor().maxSize = __num;
  }

  set typed(value: boolean) {
    const __bool = !!value;
    this.getOwnDescriptor().typed = __bool;
  }

  set unique(value: boolean) {
    const __bool = !!value;
    this.getOwnDescriptor().unique = __bool;
  }

  /**
   * Iterator
   */
  [Symbol.iterator]() {
    return Array.prototype[Symbol.iterator].call(this);
  }

  allowType(ctor: Function, keep: boolean | number = 1): number {
    __validateCtor(ctor);
    const allowedTypes = this.getOwnDescriptor().allowTypes;
    if (!keep) {
      const index = allowedTypes.indexOf(ctor);
      if (index >= 0) {
        allowedTypes.splice(index, 1);
      }
      return allowedTypes.length;
    }
    if (allowedTypes.includes(ctor)) return allowedTypes.length;
    return allowedTypes.push(ctor);
  }

  getAllowedTypes(): Function[] {
    return this.getOwnDescriptor().allowTypes;
  }

  getOwnDescriptor(): ListDescriptor {
    return __conf.get(this) || DEFAULT_LIST_DESCRIPTOR;
  }

  clear(): void {
    this.length = 0;
  }
}

export default List;
