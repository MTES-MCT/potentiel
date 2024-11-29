export class UnknownEventHandlingFailedError extends Error {
  constructor(cause: unknown) {
    super('Handling unknow event failed', { cause });
  }
}
