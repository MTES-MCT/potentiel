import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjet } from '@potentiel-domain/document';

import { AchèvementAggregate } from '../achèvement.aggregate';
import { DateDeTransmissionAuCoContractantFuturError } from '../dateTransmissionAuCocontractantFutureError.error';

export type AttestationConformitéModifiéeEvent = DomainEvent<
  'AttestationConformitéModifiée-V1',
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

export async function modifier(
  this: AchèvementAggregate,
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
    throw new DateDeTransmissionAuCoContractantFuturError();
  }

  if (!this.attestationConformité?.format) {
    throw new AucuneAttestationDeConformitéÀCorrigerError();
  }

  const event: AttestationConformitéModifiéeEvent = {
    type: 'AttestationConformitéModifiée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      attestation,
      dateTransmissionAuCocontractant: dateTransmissionAuCocontractant.formatter(),
      preuveTransmissionAuCocontractant,
      date: date.formatter(),
      utilisateur: utilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyAttestationConformitéModifiée(
  this: AchèvementAggregate,
  {
    payload: {
      dateTransmissionAuCocontractant,
      date,
      attestation,
      preuveTransmissionAuCocontractant,
    },
  }: AttestationConformitéModifiéeEvent,
) {
  this.attestationConformité = {
    date: DateTime.convertirEnValueType(date),
    format: attestation.format,
  };
  this.preuveTransmissionAuCocontractant = {
    date: DateTime.convertirEnValueType(dateTransmissionAuCocontractant),
    format: preuveTransmissionAuCocontractant.format,
  };
}

class AucuneAttestationDeConformitéÀCorrigerError extends InvalidOperationError {
  constructor() {
    super("Aucune attestation de conformité à modifier n'a été trouvée");
  }
}
