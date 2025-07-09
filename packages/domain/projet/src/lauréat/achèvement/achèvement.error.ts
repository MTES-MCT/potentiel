import { InvalidOperationError } from '@potentiel-domain/core';

export class ImpossibleDeCalculerLaDateAchèvementPrévisionnelle extends InvalidOperationError {
  constructor() {
    super(`Impossible de calculer la date d'achèvement prévisionnelle`);
  }
}
