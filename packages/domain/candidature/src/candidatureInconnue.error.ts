import { NotFoundError } from '@potentiel-domain/core';

export class CandidatureInconnueErreur extends NotFoundError {
  constructor() {
    super(`Candidature inconnue`);
  }
}
