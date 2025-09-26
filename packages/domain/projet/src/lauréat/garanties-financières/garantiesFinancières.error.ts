import { InvalidOperationError } from '@potentiel-domain/core';

export class GarantiesFinancièresRequisesPourAppelOffreError extends InvalidOperationError {
  constructor() {
    super(`Les garanties financières sont requises pour cet appel d'offres ou famille`);
  }
}

export class TypeGarantiesFinancièresInconnu extends InvalidOperationError {
  constructor() {
    super('Le type de garanties financières est inconnu');
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

export class DateDélibérationDansLeFuturError extends InvalidOperationError {
  constructor() {
    super(
      `La date de délibération de l'exemption des garanties financières ne peut pas être une date future`,
    );
  }
}

export class TypeGarantiesFinancièresNonDisponiblePourAppelOffreError extends InvalidOperationError {
  constructor() {
    super(`Ce type de garanties financières n'est pas disponible pour cet appel d'offres`);
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

export class AttestationGarantiesFinancièresDéjàExistanteError extends InvalidOperationError {
  constructor() {
    super(`Il y a déjà une attestation pour ces garanties financières`);
  }
}

export class AttestationEtDateGarantiesFinancièresRequisesError extends InvalidOperationError {
  constructor() {
    super(`L'attestation et la date de constitution sont requises pour les garanties financières`);
  }
}

export class GarantiesFinancièresSansÉchéanceError extends InvalidOperationError {
  constructor() {
    super(`Impossible d'échoir des garanties financières sans date d'échéance`);
  }
}

export class DateÉchéanceNonPasséeError extends InvalidOperationError {
  constructor() {
    super(`La date d'échéance des garanties financières n'est pas encore passée`);
  }
}

export class GarantiesFinancièresDéjàÉchuesError extends InvalidOperationError {
  constructor() {
    super(`Les garanties financières du projet sont déjà échues`);
  }
}

export class DépôtEnCoursError extends InvalidOperationError {
  constructor() {
    super(
      `Le projet dispose d'un dépôt de garanties financières en attente de validation, ce qui empêche de pouvoir échoir ses garanties financières`,
    );
  }
}

export class AttestationDeConformitéError extends InvalidOperationError {
  constructor() {
    super(
      `Le projet dispose d'une attestation de conformité, ce qui empêche de pouvoir échoir ses garanties financières`,
    );
  }
}

export class ProjetExemptDeGarantiesFinancièresError extends InvalidOperationError {
  constructor() {
    super(`Le projet est exempt de garanties financières`);
  }
}
