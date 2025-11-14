import { InvalidOperationError } from '@potentiel-domain/core';

export class ImpossibleDeCalculerLaDateAchèvementPrévisionnelle extends InvalidOperationError {
  constructor() {
    super(`Impossible de calculer la date d'achèvement prévisionnel`);
  }
}

export class DateDeTransmissionAuCoContractantFuturError extends InvalidOperationError {
  constructor() {
    super('la date de transmission au co-contractant ne peut pas être une date future');
  }
}

export class AttestationDeConformitéDéjàTransmiseError extends InvalidOperationError {
  constructor() {
    super('le projet a déjà une attestation de conformité');
  }
}

export class ImpossibleTransmettreAttestationDeConformitéProjetAbandonnéError extends InvalidOperationError {
  constructor() {
    super(
      'Il est impossible de transmettre une attestation de conformité pour un projet abandonné',
    );
  }
}

export class AucuneAttestationDeConformitéÀCorrigerError extends InvalidOperationError {
  constructor() {
    super("Aucune attestation de conformité à modifier n'a été trouvée");
  }
}

export class DateAchèvementAntérieureÀDateNotificationError extends InvalidOperationError {
  constructor() {
    super("La date d'achèvement ne peut pas être antérieure à la date de notification du projet");
  }
}

export class DateAchèvementDansLeFuturError extends InvalidOperationError {
  constructor() {
    super("La date d'achèvement ne peut pas être dans le futur");
  }
}

export class ProjetDéjàAchevéError extends InvalidOperationError {
  constructor() {
    super('Le projet est déjà achevé');
  }
}
