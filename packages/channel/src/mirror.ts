class Mirror<T = any> {
  constructor(obj: T) {
    if (obj == null) return this;

    Object.entries(obj).forEach(([k, v]) => {
      (<any> this)[k] = v;
    });
  }
}

export default Mirror;
