class ColorMap<K = any, V = any, A = K> extends Map<K | V | A, K | V> {
  setMany(key: K, value: V, ...aliases: A[]) {
    this.set(key, value);
    this.set(value, key);
    aliases.forEach((alias) => {
      this.set(alias, value);
    });
    return this;
  }

  getPrimaryKey(key: K | A): K {
    return this.get(this.get(key) as V) as K;
  }
}

export default ColorMap;
