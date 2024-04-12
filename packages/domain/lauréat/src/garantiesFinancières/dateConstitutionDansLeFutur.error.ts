import { InvalidOperationError } from '@potentiel-domain/core';

export class DateConstitutionDansLeFuturError extends InvalidOperationError {
  constructor() {
    super(`La date de constitution des garanties financières ne peut pas être une date future`);
  }
}
