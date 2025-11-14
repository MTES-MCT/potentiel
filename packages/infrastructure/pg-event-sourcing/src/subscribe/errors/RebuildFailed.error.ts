export class RebuildFailedError extends Error {
  constructor(
    cause: unknown,
    public event?: unknown,
  ) {
    super('Rebuild failed', { cause });
  }
}
