class Cache {
  constructor() {
    this.cacheStore = {};
  }

  get(key) {
    return this.cacheStore[key];
  }

  set(key, value) {
    this.cacheStore[key] = value;
  }

  delete(key) {
    delete this.cacheStore[key];
  }
}

const cache = new Cache();
module.exports = cache;

