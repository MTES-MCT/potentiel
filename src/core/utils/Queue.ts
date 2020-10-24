export class Queue {
  private promise: Promise<any>

  constructor() {
    this.promise = Promise.resolve()
  }

  push<T>(fn: () => Promise<T>): Promise<T>
  // eslint-disable-next-line no-dupe-class-members
  push<T>(fn: () => T): Promise<T> {
    this.promise = this.promise.then(fn, fn)
    return this.promise
  }
}
