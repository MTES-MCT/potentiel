import { InvalidOperationError } from '@potentiel-domain/core';

export class GarantiesFinancièresRequisesPourAppelOffreError extends InvalidOperationError {
  constructor() {
    super(`Les garanties financières sont requises pour cet appel d'offre ou famille`);
  }
}

export class DateÉchéanceGarantiesFinancièresRequiseError extends InvalidOperationError {
  constructor() {
    super(`La date d'échéance des garanties financières est requise`);
  }
}

export class DateÉchéanceNonAttendueError extends InvalidOperationError {
  constructor() {
    super(`La date d'échéance pour ce type de garanties financières ne peut être renseignée`);
  }
}

export class TypeGarantiesFinancièresNonDisponiblePourAppelOffreError extends InvalidOperationError {
  constructor() {
    super(`Ce type de garanties financières n'est pas disponible pour cet appel d'offre`);
  }
}
