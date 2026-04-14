import { AggregateNotFoundError, InvalidOperationError } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../index.js';

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

export class TechnologieRequiseError extends InvalidOperationError {
  constructor() {
    super("Une technologie est requise pour cet appel d'offres");
  }
}

export class TechnologieIndisponibleError extends InvalidOperationError {
  constructor() {
    super("Cette technologie n'est pas disponible pour cet appel d'offres");
  }
}

export class AutorisationRequiseError extends InvalidOperationError {
  constructor() {
    super("Le numéro et la date d'obtention de l'autorisation sont requis pour cet appel d'offres");
  }
}

export class DateAutorisationError extends InvalidOperationError {
  constructor() {
    super("La date d'obtention de l'autorisation doit être antérieure à la date du jour");
  }
}

export class ChampRequisError extends InvalidOperationError {
  constructor(champ: string) {
    super(`Le champ ${champ} est requis pour cet appel d'offres`);
  }
}

export class ChampNonAttenduError extends InvalidOperationError {
  constructor(champ: string) {
    super(`Le champ ${champ} ne peut être renseigné pour cet appel d'offres`);
  }
}
