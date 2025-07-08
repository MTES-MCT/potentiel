import { InvalidOperationError } from '@potentiel-domain/core';

export class ImpossibleDeCalculerLaDatePrévisionnelleAchèvement extends InvalidOperationError {
  constructor() {
    super(`Impossible de calculer la date prévisionnelle d'achèvement`);
  }
}
