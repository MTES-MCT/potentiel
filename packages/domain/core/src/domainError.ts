export abstract class DomainError extends Error {
  readonly meta?: Record<string, unknown>;

  constructor(message: string, meta?: Record<string, unknown>) {
    super(message);
    this.meta = meta;
  }
}

export class AggregateNotFoundError extends DomainError {}

export class InvalidOperationError extends DomainError {}

export class OperationRejectedError extends DomainError {}
