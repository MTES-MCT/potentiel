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

export class AucunesGarantiesFinancièresActuellesError extends InvalidOperationError {
  constructor() {
    super(`Il n'y a aucunes garanties financières actuelles pour ce projet`);
  }
}

export class GarantiesFinancièresDéjàLevéesError extends InvalidOperationError {
  constructor() {
    super(
      'Vous ne pouvez pas déposer ou modifier des garanties financières car elles ont déjà été levées pour ce projet',
    );
  }
}

export class DateConstitutionDansLeFuturError extends InvalidOperationError {
  constructor() {
    super(`La date de constitution des garanties financières ne peut pas être une date future`);
  }
}

export class GarantiesFinancièresDéjàEnregistréesError extends InvalidOperationError {
  constructor() {
    super(`Il y a déjà des garanties financières pour ce projet`);
  }
}

export class AttestationGarantiesFinancièresDéjàExistante extends InvalidOperationError {
  constructor() {
    super(`Il y a déjà une attestation pour ces garanties financières`);
  }
}
