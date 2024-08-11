const cache = require('../src/cache');

describe('Cache', () => {

  it('should set and get a value', () => {
    const key = 'testKey';
    const value = 'testValue';

    cache.set(key, value);
    const result = cache.get(key);

    expect(result).toBe(value);
  });

  it('should delete a value', () => {
    const key = 'testKey';
    const value = 'testValue';

    cache.set(key, value);
    cache.delete(key);
    const result = cache.get(key);

    expect(result).toBeUndefined();
  });
});
