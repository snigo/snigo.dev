class Entry<K = any, V = any> {
  key: K;

  value: V;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export default Entry;
