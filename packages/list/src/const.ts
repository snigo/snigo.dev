/* eslint-disable no-unused-vars */
const MAX_ARRAY_SIZE = 4294967295;

interface ListDescriptor {
  allowTypes: Function[];
  changeable: boolean;
  configurable: boolean;
  expandable: boolean;
  length: number;
  maxSize: number;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
  orderFn: 'alphanumeric' | 'numeric' | 'date';
  ordered: boolean;
  overflow: 'throw' | 'ignore' | 'push' | 'swap';
  typed: boolean;
  unique: boolean;
}

const DEFAULT_LIST_DESCRIPTOR: ListDescriptor = {
  allowTypes: [],
  changeable: true,
  configurable: true,
  expandable: true,
  length: 0,
  maxSize: MAX_ARRAY_SIZE,
  orderBy: '',
  orderDirection: 'asc',
  orderFn: 'alphanumeric',
  ordered: false,
  overflow: 'throw',
  typed: false,
  unique: false,
};

export {
  MAX_ARRAY_SIZE,
  DEFAULT_LIST_DESCRIPTOR,
  ListDescriptor,
};
