import { AggregateNotFoundError, InvalidOperationError } from '@potentiel-domain/core';

export class AttestationNonGénéréeError extends InvalidOperationError {
  constructor() {
    super(`L'attestation d'une candidature non notifiée ne peut pas être régénérée`);
  }
}

export class CandidatureDéjàImportéeError extends InvalidOperationError {
  constructor() {
    super("Il est impossible d'importer 2 fois la même candidature");
  }
}

export class CandidatureNonModifiéeError extends InvalidOperationError {
  constructor(nomProjet: string) {
    super(`La candidature ne contient aucune modification`, { nomProjet });
  }
}

export class CandidatureNonTrouvéeError extends AggregateNotFoundError {
  constructor() {
    super(`La candidature n'existe pas`);
  }
}

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

export class PériodeAppelOffreLegacyError extends InvalidOperationError {
  constructor(appelOffre: string, période: string) {
    super(`Cette période est obsolète et ne peut être importée`, {
      appelOffre,
      période,
    });
  }
}

export class StatutNonModifiableAprèsNotificationError extends InvalidOperationError {
  constructor() {
    super(`Le statut d'une candidature ne peut être modifié après la notification`);
  }
}

export class TypeGarantiesFinancièresNonModifiableAprèsNotificationError extends InvalidOperationError {
  constructor() {
    super(
      `Le type de garanties financières d'une candidature ne peut être modifié après la notification`,
    );
  }
}
