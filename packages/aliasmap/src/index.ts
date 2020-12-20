/* eslint-disable class-methods-use-this */
/* eslint-disable no-use-before-define */
import Entry from './entry';

interface AliasMapDescriptior {
  strict: boolean;
  immutable: boolean;
}

interface AliasMapState<K = any, V = any, A = K> extends AliasMapDescriptior {
  size: number;
  map: Map<K | V | A, Entry<K, V>>;
}

const __scope = new WeakMap<AliasMap, AliasMapState>();

const DEFAULT_DESCRIPTOR: AliasMapDescriptior = {
  strict: true,
  immutable: true,
};

const _updateSize = (aliasmap: AliasMap, inc: number): void => {
  const state = __scope.get(aliasmap);
  if (state) {
    state.size += inc;
  }
};

const _testNullParam = (aliasmap: AliasMap, ...args: any[]): boolean => {
  if (args.some((a) => a == null)) {
    if (!aliasmap.getOwnDescriptor().strict) return false;
    throw TypeError('AliasMap entry cannot be null or undefined');
  }
  return true;
};

const _testImmutableParam = (aliasmap: AliasMap, ...args: any[]): boolean => {
  if (aliasmap.getOwnDescriptor().immutable && args.some((a) => aliasmap.has(a))) {
    if (!aliasmap.getOwnDescriptor().strict) return false;
    throw TypeError('Cannot reassign immutable entry. Delete entry first or set immutable property to false: .setOwnDescriptor({ immutable: false }).');
  }

  return true;
};

const _testStrictDuplicateAlias = (
  aliasmap: AliasMap,
  key: any,
  value: any,
  ...aliases: any[]
): void => {
  if (aliases.some((a) => a === key || a === value) && aliasmap.getOwnDescriptor().strict) {
    throw TypeError('Key or value cannot be alias for itself');
  }
};

// eslint-disable-next-line no-unused-vars
type AliasMapCallbackFunction = (entry: Entry, index: number, entries: Entry[]) => void;

class AliasMap<K = any, V = any, A = K> {
  constructor(descriptor: AliasMapDescriptior = DEFAULT_DESCRIPTOR) {
    const state: AliasMapState<K, V, A> = {
      map: new Map<K | V | A, Entry<K, V>>(),
      size: 0,
      strict: descriptor.strict ?? true,
      immutable: descriptor.immutable ?? true,
    };

    __scope.set(this, state);
  }

  get size(): number {
    return __scope.get(this)?.size || 0;
  }

  * [Symbol.iterator]() {
    const entries = this.entries();

    for (const entry of entries) {
      yield entry;
    }

    return undefined;
  }

  get [Symbol.toStringTag](): string {
    return 'AliasMap';
  }

  getOwnDescriptor(): AliasMapDescriptior {
    const { strict, immutable } = __scope.get(this) || DEFAULT_DESCRIPTOR;
    return {
      strict,
      immutable,
    };
  }

  get(item: K | V | A): Entry<K, V> | undefined {
    return __scope.get(this)?.map.get(item);
  }

  getKey(item: K | V | A): K | undefined {
    return this.get(item)?.key;
  }

  getValue(item: K | V | A): V | undefined {
    return this.get(item)?.value;
  }

  getAliases(item: K | V | A): A[] | undefined {
    const _entry = this.get(item);
    const entries = __scope.get(this)?.map.entries();
    if (!_entry || !entries) return undefined;
    return ([...entries] as [K | V | A, Entry<K, V>][])
      .filter(([k, e]: [K | V | A, Entry<K, V>]) => (
        e === _entry
        && k !== _entry.key
        && k !== _entry.value))
      .map(([k]) => k as A);
  }

  has(item: K | V | A): boolean {
    return __scope.get(this)?.map.has(item) || false;
  }

  hasAlias(item: K | V | A, alias: A): boolean {
    return this.getAliases(item)?.includes(alias) || false;
  }

  isAlias(alias: A): boolean {
    const entry = this.get(alias);
    if (!entry) return false;
    return entry.key !== (alias as unknown) && entry.value !== (alias as unknown);
  }

  delete(item: K | V | A): boolean {
    const entry = this.get(item);
    const entries = __scope.get(this)?.map;
    if (!entry || !entries) return false;

    this.getAliases(item)?.forEach((alias) => {
      entries.delete(alias);
    });
    entries.delete(entry.key);
    entries.delete(entry.value);
    _updateSize(this, -1);
    return true;
  }

  deleteAlias(item: K | V | A, alias: A): boolean {
    const entry = this.get(item);
    const entries = __scope.get(this)?.map;
    if (
      !entry
      || !entries
      || entry.key === (alias as unknown)
      || entry.value === (alias as unknown)
    ) return false;
    return entries.delete(alias);
  }

  set(key: K, value: V, ...aliases: A[]): AliasMap {
    const entries = __scope.get(this)?.map;
    if (!_testNullParam(this, key, value, ...aliases) || !entries) return this;

    const _keyEntry = this.get(key);
    if (_keyEntry && _keyEntry.key === key && _keyEntry.value === value) {
      this.setAlias(key, ...aliases);
      return this;
    }

    if (!_testImmutableParam(this, key, value, ...aliases)) return this;
    _testStrictDuplicateAlias(this, key, value, ...aliases);

    if (_keyEntry && _keyEntry.key === key) {
      this.delete(value);
      entries.delete(_keyEntry.value);
      _keyEntry.value = value;
      entries.set(value, _keyEntry);
      this.setAlias(key, ...aliases);
      return this;
    }

    const _valueEntry = this.get(value);

    if (_keyEntry && _keyEntry.key !== key) {
      this.delete(key);
    }

    if (_valueEntry) {
      this.delete(value);
    }

    const entry = new Entry(key, value);
    entries.set(key, entry);
    entries.set(value, entry);
    this.setAlias(key, ...aliases);
    _updateSize(this, 1);
    return this;
  }

  setAlias(item: K | V | A, ...aliases: A[]): boolean {
    if (!_testNullParam(this, ...aliases)) return false;
    if (!_testImmutableParam(this, ...aliases)) return false;

    const entry = this.get(item);
    const entries = __scope.get(this)?.map;
    if (!entry || !entries || !aliases.length) return false;

    _testStrictDuplicateAlias(this, entry.key, entry.value, ...aliases);

    aliases.forEach((a: A) => {
      if (!(this.has(a) && !this.isAlias(a))) {
        entries.set(a, entry);
      }
    });

    return true;
  }

  setOwnDescriptor(descriptor: Partial<AliasMapDescriptior>): AliasMapDescriptior {
    const state = __scope.get(this);
    if (!state) return DEFAULT_DESCRIPTOR;

    const ownDescriptor = this.getOwnDescriptor();
    if ('strict' in descriptor && typeof descriptor.strict === 'boolean') {
      ownDescriptor.strict = descriptor.strict;
    }

    if ('immutable' in descriptor && typeof descriptor.immutable === 'boolean') {
      ownDescriptor.immutable = descriptor.immutable;
    }

    __scope.set(this, {
      ...state,
      strict: ownDescriptor.strict,
      immutable: ownDescriptor.immutable,
    });

    return ownDescriptor;
  }

  clear(): void {
    const entries = __scope.get(this)?.map;
    if (!entries) return undefined;

    _updateSize(this, -this.size);
    return entries.clear();
  }

  entries(): Entry<K, V>[] {
    const _entries = __scope.get(this)?.map;
    if (!_entries) return [];
    return [...new Set([..._entries.values()])];
  }

  keys(): K[] {
    return this.entries().map((e: Entry<K, V>) => e.key);
  }

  values(): V[] {
    return this.entries().map((e: Entry<K, V>) => e.value);
  }

  forEach(fn: AliasMapCallbackFunction, ctx?: Object): void {
    return this.entries().forEach(fn, ctx);
  }
}

export default AliasMap;
