import { OperationRejectedError } from '@potentiel-domain/core';

export class TokenInvalideError extends OperationRejectedError {
  constructor(cause: Error) {
    super(`Le format du token utilisateur n'est pas valide.`);
    this.cause = cause;
  }
}

export class EmptyTokenError extends OperationRejectedError {
  constructor() {
    super(`Token vide`);
  }
}

export class WrongTokenTypeError extends OperationRejectedError {
  constructor(type: string) {
    super(`Le type du token incorrect`, {
      type,
    });
  }
}
