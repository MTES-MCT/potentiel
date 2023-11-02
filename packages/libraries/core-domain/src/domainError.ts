/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
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

/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
export class NotFoundError extends DomainError {}

/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
export class InvalidOperationError extends DomainError {}

/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
export class OperationRejectedError extends DomainError {}
