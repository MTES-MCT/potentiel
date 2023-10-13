import { NotFoundError } from '@potentiel-domain/core';

export class ProjetInconnuError extends NotFoundError {
  constructor() {
    super(`Le projet n'existe pas`);
  }
}
