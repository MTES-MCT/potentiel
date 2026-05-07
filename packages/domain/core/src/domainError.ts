const DOMAIN_ERROR_SYMBOL = Symbol.for('potentiel:DomainError');

export abstract class DomainError extends Error {
  readonly [DOMAIN_ERROR_SYMBOL] = true;
  readonly meta?: Record<string, unknown>;

  constructor(message: string, meta?: Record<string, unknown>) {
    super(message);
    this.meta = meta;
  }

  static isDomainError(error: unknown): error is DomainError {
    return error instanceof Error && DOMAIN_ERROR_SYMBOL in error;
  }
}

export class AggregateNotFoundError extends DomainError {}

export class InvalidOperationError extends DomainError {}

export class OperationRejectedError extends DomainError {}
