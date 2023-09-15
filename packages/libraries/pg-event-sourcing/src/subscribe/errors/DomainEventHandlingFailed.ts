export class DomainEventHandlingFailed extends Error {
  constructor() {
    super('Handling domain event failed');
  }
}
