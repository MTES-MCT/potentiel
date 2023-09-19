export class RebuildFailedError extends Error {
  constructor() {
    super('Rebuild failed');
  }
}
