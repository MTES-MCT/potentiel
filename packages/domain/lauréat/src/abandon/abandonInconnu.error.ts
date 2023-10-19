import { NotFoundError } from '@potentiel-domain/core';

export class AbandonInconnuErreur extends NotFoundError {
  constructor() {
    super(`Abandon inconnu`);
  }
}
