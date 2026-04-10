/**
 * A generic SingleFlight implementation that deduplicates concurrent
 * asynchronous calls sharing the same key.
 *
 * When multiple callers invoke `run` with an identical key before the first
 * call settles, only the first invocation executes the provided function —
 * every subsequent caller receives the same pending Promise. Once the Promise
 * settles (resolves or rejects) the key is removed so future calls trigger a
 * fresh execution.
 *
 * @typeParam T - The resolved value type of the deduplicated async function.
 *
 * @example
 * ```ts
 * const sf = new SingleFlight<string>();
 * const result = await sf.run('user:1', () => fetchUser('1'));
 * ```
 */
export default class SingleFlight<T> {
  private promises = new Map<string, Promise<T>>();

  /**
   * Execute an async function exactly once per key while the resulting Promise
   * is in-flight.
   *
   * If a Promise for the given `key` is already pending, that Promise is
   * returned without calling `fn`. When the Promise settles the internal
   * mapping for `key` is automatically removed, allowing subsequent calls to
   * trigger a fresh execution.
   *
   * @param key  - A unique identifier used to group concurrent calls.
   * @param fn   - The factory function that produces the Promise to deduplicate.
   * @returns     A Promise resolving to the same value for every concurrent
   *              caller sharing `key`.
   *
   * @example
   * ```ts
   * const sf = new SingleFlight<number>();
   *
   * // These three calls share one underlying execution:
   * const [a, b, c] = await Promise.all([
   *   sf.run('count', () => expensiveCount()),
   *   sf.run('count', () => expensiveCount()),
   *   sf.run('count', () => expensiveCount()),
   * ]);
   * // a === b === c
   * ```
   */
  run(key: string, fn: () => Promise<T>): Promise<T> {
    const exist = this.promises.get(key);
    if (exist) return exist;

    const promise = fn().finally(() => {
      this.promises.delete(key);
    });

    this.promises.set(key, promise);
    return promise;
  }
}
