import { OperationRejectedError } from '@potentiel-domain/core';

export class ProjetAbandonnéError extends OperationRejectedError {
  constructor(message: string) {
    super(message);
  }
}
