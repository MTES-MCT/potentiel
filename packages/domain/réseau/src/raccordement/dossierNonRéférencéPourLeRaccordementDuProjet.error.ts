import { InvalidOperationError } from '@potentiel-domain/core';

export class DossierNonRéférencéPourLeRaccordementDuProjetError extends InvalidOperationError {
  constructor() {
    super(`Le dossier n'est pas référencé dans le raccordement de ce projet`);
  }
}
