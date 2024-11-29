export class RebuildFailedError extends Error {
  constructor(cause: unknown) {
    super('Rebuild failed', { cause });
  }
}
