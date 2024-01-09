import { InvalidOperationError } from '@potentiel-domain/core';

export class DateDansLeFuturError extends InvalidOperationError {
  constructor() {
    super(`La date ne peut pas être une date future`);
  }
}
