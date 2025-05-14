import { InvalidOperationError } from '@potentiel-domain/core';

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
