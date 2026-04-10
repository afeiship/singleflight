import SingleFlight from '../src';

describe('SingleFlight', () => {
  test('basic dedup: same key shares one promise', async () => {
    let count = 0;
    const sf = new SingleFlight<number>();
    const fn = () => {
      count++;
      return new Promise<number>((resolve) => setTimeout(() => resolve(42), 10));
    };

    const results = await Promise.all([sf.run('a', fn), sf.run('a', fn), sf.run('a', fn)]);
    expect(results).toEqual([42, 42, 42]);
    expect(count).toBe(1);
  });

  test('different keys are isolated', async () => {
    let countA = 0;
    let countB = 0;
    const sf = new SingleFlight<number>();

    const results = await Promise.all([
      sf.run('a', () => { countA++; return Promise.resolve(1); }),
      sf.run('b', () => { countB++; return Promise.resolve(2); }),
    ]);

    expect(results).toEqual([1, 2]);
    expect(countA).toBe(1);
    expect(countB).toBe(1);
  });

  test('re-entry after resolve: factory re-executes', async () => {
    let count = 0;
    const sf = new SingleFlight<number>();
    const fn = () => Promise.resolve(++count);

    const first = await sf.run('a', fn);
    const second = await sf.run('a', fn);

    expect(first).toBe(1);
    expect(second).toBe(2);
  });

  test('re-entry after reject: factory re-executes', async () => {
    let count = 0;
    const sf = new SingleFlight<number>();
    const fn = () => Promise.reject(++count);

    await expect(sf.run('a', fn)).rejects.toBe(1);
    await expect(sf.run('a', fn)).rejects.toBe(2);
  });

  test('error propagation: all callers receive same rejection', async () => {
    const sf = new SingleFlight<number>();
    const fn = () => new Promise<number>((_, reject) => setTimeout(() => reject(new Error('fail')), 10));

    const results = await Promise.allSettled([
      sf.run('a', fn),
      sf.run('a', fn),
    ]);

    expect(results[0].status).toBe('rejected');
    expect(results[1].status).toBe('rejected');
    if (results[0].status === 'rejected' && results[1].status === 'rejected') {
      expect(results[0].reason.message).toBe('fail');
      expect(results[1].reason.message).toBe('fail');
    }
  });

  test('map cleanup: key removed after settle', async () => {
    const sf = new SingleFlight<number>();
    await sf.run('a', () => Promise.resolve(1));
    expect((sf as any).promises.has('a')).toBe(false);
  });

  test('sync factory throw: error propagates without key leak', () => {
    const sf = new SingleFlight<number>();
    const fn = () => { throw new Error('sync'); };

    expect(() => sf.run('a', fn)).toThrow('sync');
    expect((sf as any).promises.has('a')).toBe(false);
  });
});
