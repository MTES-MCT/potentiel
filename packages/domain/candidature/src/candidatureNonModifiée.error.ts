import { InvalidOperationError } from '@potentiel-domain/core';

export class CandidatureNonModifiéeError extends InvalidOperationError {
  constructor(nomProjet: string) {
    super(`La candidature ne contient aucune modification`, { nomProjet });
  }
}
