export abstract class DomainError extends Error {
  get key() {
    return this.name.replace('Error', '');
  }

  #meta?: Record<string, unknown>;

  get meta() {
    return this.#meta;
  }

  constructor(message: string, meta?: Record<string, unknown>) {
    super(message);
    this.#meta = meta;
  }
}

export class NotFoundError extends DomainError {}

export class InvalidOperationError extends DomainError {}

export class OperationRejectedError extends DomainError {}
