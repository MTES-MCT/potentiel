/* 
  Symbol.for() utilise un registre global partagé entre tous les modules du runtime,
  ce qui permet à isDomainError() de fonctionner même si le bundler (ex. Turbopack)
  charge plusieurs instances de ce fichier dans des chunks différents.
  
  Un simple `instanceof DomainError` échouerait dans ce cas, car chaque chunk
  aurait sa propre référence de classe, distincte des autres. 
*/
const SYMBOL_GLOBAL_DOMAIN_ERROR = Symbol.for('potentiel:DomainError');
const SYMBOL_AGGREGATE_NOT_FOUND_ERROR = Symbol.for('potentiel:DomainError:AggregateNotFoundError');
const SYMBOL_INVALID_OPERATION_ERROR = Symbol.for('potentiel:DomainError:InvalidOperationError');
const SYMBOL_OPERATION_REJECTED_ERROR = Symbol.for('potentiel:DomainError:OperationRejectedError');

export abstract class DomainError extends Error {
  readonly [SYMBOL_GLOBAL_DOMAIN_ERROR] = true;
  readonly meta?: Record<string, unknown>;

  constructor(message: string, meta?: Record<string, unknown>) {
    super(message);
    this.meta = meta;
  }

  static isDomainError(error: unknown): error is DomainError {
    return error instanceof Error && SYMBOL_GLOBAL_DOMAIN_ERROR in error;
  }
}

export class AggregateNotFoundError extends DomainError {
  readonly [SYMBOL_AGGREGATE_NOT_FOUND_ERROR] = true;

  static isAggregateNotFoundError(error: Error): error is AggregateNotFoundError {
    return DomainError.isDomainError(error) && SYMBOL_AGGREGATE_NOT_FOUND_ERROR in error;
  }
}

export class InvalidOperationError extends DomainError {
  readonly [SYMBOL_INVALID_OPERATION_ERROR] = true;

  static isInvalidOperationError(error: Error): error is InvalidOperationError {
    return DomainError.isDomainError(error) && SYMBOL_INVALID_OPERATION_ERROR in error;
  }
}

export class OperationRejectedError extends DomainError {
  readonly [SYMBOL_OPERATION_REJECTED_ERROR] = true;

  static isOperationRejectedError(error: Error): error is OperationRejectedError {
    return DomainError.isDomainError(error) && SYMBOL_OPERATION_REJECTED_ERROR in error;
  }
}
