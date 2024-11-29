export class DomainEventHandlingFailedError extends Error {
  constructor(cause: unknown) {
    super('Handling domain event failed', { cause });
  }
}
