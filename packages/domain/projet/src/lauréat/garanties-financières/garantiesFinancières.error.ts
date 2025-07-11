import { InvalidOperationError } from '@potentiel-domain/core';

export class TypeGarantiesFinancièresNonDisponiblePourAppelOffreError extends InvalidOperationError {
  constructor(value: string) {
    super(`Ce type de garanties financières n'est pas disponible pour cet appel d'offre`, {
      value,
    });
  }
}
