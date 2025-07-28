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
    super(`La date d'échéance ne peut être renseignée pour ce type de garanties financières`);
  }
}

export class DateDélibérationRequiseError extends InvalidOperationError {
  constructor() {
    super(`La date de délibération de l'exemption des garanties financières est requise`);
  }
}

export class DateDélibérationNonAttendueError extends InvalidOperationError {
  constructor() {
    super(`La date de délibération ne peut être renseignée pour ce type de garanties financières`);
  }
}

export class TypeGarantiesFinancièresNonDisponiblePourAppelOffreError extends InvalidOperationError {
  constructor() {
    super(`Ce type de garanties financières n'est pas disponible pour cet appel d'offre`);
  }
}
