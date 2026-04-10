// 1-9
// quotient 商
// remainder 余数

export default class SingleFlight<T> {
  private promises = new Map<string, Promise<T>>();

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
