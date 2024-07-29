import { InvalidOperationError } from '@potentiel-domain/core';

export class DossierRaccordementNonRéférencéError extends InvalidOperationError {
  constructor() {
    super(`Le dossier de raccordement n'est pas référencé`);
  }
}
