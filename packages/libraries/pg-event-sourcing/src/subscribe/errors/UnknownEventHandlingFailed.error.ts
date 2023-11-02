/**
 * @deprecated en faveur du package @potentiel-infrastructure/pg-event-sourcing
 */
export class UnknownEventHandlingFailedError extends Error {
  constructor() {
    super('Handling unknow event failed');
  }
}
