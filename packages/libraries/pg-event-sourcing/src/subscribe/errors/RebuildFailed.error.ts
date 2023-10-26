/**
 * @deprecated en faveur du package @potentiel-infrastructure/pg-event-sourcing
 */
export class RebuildFailedError extends Error {
  constructor() {
    super('Rebuild failed');
  }
}
