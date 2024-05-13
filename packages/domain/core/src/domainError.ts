export abstract class DomainError extends Error {
  readonly meta?: Record<string, unknown>;

  constructor(message: string, meta?: Record<string, unknown>) {
    super(message);
    this.meta = meta;
  }
}

/**
 * @deprecated not found are only throw for Aggregate when executing a command.
 * Use AggregateNotFoundError instead, or return an Option if your operation is a query
 */
export class NotFoundError extends DomainError {}

export class AggregateNotFoundError extends DomainError {}

export class InvalidOperationError extends DomainError {}

export class OperationRejectedError extends DomainError {}
