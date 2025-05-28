import { InvalidOperationError } from '@potentiel-domain/core';

export class PièceJustificativeObligatoireError extends InvalidOperationError {
  constructor() {
    super('La pièce justificative est obligatoire');
  }
}
