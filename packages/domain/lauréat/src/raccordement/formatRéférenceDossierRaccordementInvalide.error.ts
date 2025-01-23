import { InvalidOperationError } from '@potentiel-domain/core';

export class FormatRéférenceDossierRaccordementInvalideError extends InvalidOperationError {
  constructor() {
    super(`Le format de la référence du dossier de raccordement est invalide`);
  }
}
