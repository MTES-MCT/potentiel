import { AggregateNotFoundError, InvalidOperationError } from '@potentiel-domain/core';

import { IdentifiantProjet } from '..';

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

export class CandidatureNonNotifiéeError extends InvalidOperationError {
  constructor() {
    super(`La candidature n'est pas notifiée`);
  }
}

export class CandidatureDéjàNotifiéeError extends InvalidOperationError {
  constructor(identifiantProjet: IdentifiantProjet.ValueType) {
    super(`La candidature est déjà notifiée`, { identifiantProjet });
  }
}

export class FonctionManquanteError extends InvalidOperationError {
  constructor() {
    super(`La fonction de l'utilisateur doit être précisée pour cette opération`);
  }
}

export class NomManquantError extends InvalidOperationError {
  constructor() {
    super(`Le nom de l'utilisateur doit être précisé pour cette opération`);
  }
}

export class ChoixCoefficientKRequisError extends InvalidOperationError {
  constructor() {
    super(`Le choix du coefficient K est requis pour cette période`);
  }
}

export class ChoixCoefficientKNonAttenduError extends InvalidOperationError {
  constructor() {
    super(`Le choix du coefficient K ne peut être renseigné pour cette période`);
  }
}

export class PuissanceDeSiteRequiseError extends InvalidOperationError {
  constructor() {
    super(`La puissance de site est requise pour cet appel d'offre`);
  }
}

export class PuissanceDeSiteNonAttendueError extends InvalidOperationError {
  constructor() {
    super(`La puissance de site ne peut être renseignée pour cet appel d'offre`);
  }
}

export class InstallateurRequisError extends InvalidOperationError {
  constructor() {
    super(`L'installateur est requis pour cet appel d'offre`);
  }
}

export class InstallateurNonAttenduError extends InvalidOperationError {
  constructor() {
    super(`L'installateur ne peut être renseigné pour cet appel d'offre`);
  }
}

export class TechnologieRequiseError extends InvalidOperationError {
  constructor() {
    super("Une technologie est requise pour cet appel d'offre");
  }
}

export class TechnologieIndisponibleError extends InvalidOperationError {
  constructor() {
    super("Cette technologie n'est pas disponible pour cet appel d'offre");
  }
}

export class AutorisationDUrbanismeRequiseError extends InvalidOperationError {
  constructor() {
    super(
      "Le numéro et la date d'obtention de l'autorisation d'urbanisme sont requis pour cet appel d'offre",
    );
  }
}

export class DateAutorisationDUrbanismeError extends InvalidOperationError {
  constructor() {
    super(
      "La date d'obtention de l'autorisation d'urbanisme doit être antérieure à la date du jour",
    );
  }
}
