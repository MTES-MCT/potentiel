import { NotFoundError } from '@potentiel-domain/core';

export class RégionNonTrouvéeError extends NotFoundError {
  constructor() {
    super(`La région n'a pas pu être identifiée.`);
  }
}
