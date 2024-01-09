import { NotFoundError } from '@potentiel-domain/core';

export class DossierRaccordementNonRéférencéError extends NotFoundError {
  constructor() {
    super(`Le dossier de raccordement n'est pas référencé`);
  }
}
