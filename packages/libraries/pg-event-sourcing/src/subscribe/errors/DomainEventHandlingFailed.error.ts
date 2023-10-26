/**
 * @deprecated en faveur du package @potentiel-infrastructure/pg-event-sourcing
 */
export class DomainEventHandlingFailedError extends Error {
  constructor() {
    super('Handling domain event failed');
  }
}
