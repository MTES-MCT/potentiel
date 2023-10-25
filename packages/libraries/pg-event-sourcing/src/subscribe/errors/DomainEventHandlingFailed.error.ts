export class DomainEventHandlingFailedError extends Error {
  constructor() {
    super('Handling domain event failed');
  }
}
