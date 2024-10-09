import { AggregateNotFoundError } from '@potentiel-domain/core';

export class CandidatureNonTrouvéeError extends AggregateNotFoundError {
  constructor() {
    super(`La candidature n'existe pas`);
  }
}
