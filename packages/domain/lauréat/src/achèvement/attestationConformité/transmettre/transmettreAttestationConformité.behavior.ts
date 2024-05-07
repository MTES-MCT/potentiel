import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';

import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjet } from '@potentiel-domain/document';
import { AttestationConformitéAggregate } from '../attestationConformité.aggregate';

export type AttestationConformitéTransmiseEvent = DomainEvent<
  'AttestationConformitéTransmise-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    attestation: { format: string };
    dateTransmissionAuCocontractant: DateTime.RawType;
    preuveTransmissionAuCocontractant: { format: string };
    date: DateTime.RawType;
    utilisateur: IdentifiantUtilisateur.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  attestation: DocumentProjet.ValueType;
  dateTransmissionAuCocontractant: DateTime.ValueType;
  preuveTransmissionAuCocontractant: DocumentProjet.ValueType;
  date: DateTime.ValueType;
  utilisateur: IdentifiantUtilisateur.ValueType;
};

export async function transmettre(
  this: AttestationConformitéAggregate,
  {
    identifiantProjet,
    attestation,
    dateTransmissionAuCocontractant,
    preuveTransmissionAuCocontractant,
    date,
    utilisateur,
  }: Options,
) {
  if (dateTransmissionAuCocontractant.estDansLeFutur()) {
    throw new DateDeTransmissionAuCoContractantFutureError();
  }
  if (this.attestation.format && this.preuveTransmissionAuCocontractant.format) {
    throw new AttestationDeConformitéDéjàTransmiseError();
  }

  const event: AttestationConformitéTransmiseEvent = {
    type: 'AttestationConformitéTransmise-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      attestation: { format: attestation.format },
      dateTransmissionAuCocontractant: dateTransmissionAuCocontractant.formatter(),
      preuveTransmissionAuCocontractant: { format: preuveTransmissionAuCocontractant.format },
      date: date.formatter(),
      utilisateur: utilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyAttestationConformitéTransmise(
  this: AttestationConformitéAggregate,
  {
    payload: {
      dateTransmissionAuCocontractant,
      date,
      utilisateur,
      attestation,
      preuveTransmissionAuCocontractant,
    },
  }: AttestationConformitéTransmiseEvent,
) {
  this.dateTransmissionAuCocontractant = DateTime.convertirEnValueType(
    dateTransmissionAuCocontractant,
  );
  this.date = DateTime.convertirEnValueType(date);
  this.utilisateur = IdentifiantUtilisateur.convertirEnValueType(utilisateur);
  this.attestation = { format: attestation.format };
  this.preuveTransmissionAuCocontractant = { format: preuveTransmissionAuCocontractant.format };
}

class DateDeTransmissionAuCoContractantFutureError extends InvalidOperationError {
  constructor() {
    super('la date de transmission au co-contractant ne peut pas être une date future');
  }
}

class AttestationDeConformitéDéjàTransmiseError extends InvalidOperationError {
  constructor() {
    super('le projet a déjà une attestation de conformité');
  }
}
