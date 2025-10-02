import { InvalidOperationError } from '@potentiel-domain/core';

export class AgrégatÉliminéNonInitialiséError extends InvalidOperationError {
  constructor() {
    super(`L'agrégat Éliminé n'a pas été initialisé`);
  }
}
