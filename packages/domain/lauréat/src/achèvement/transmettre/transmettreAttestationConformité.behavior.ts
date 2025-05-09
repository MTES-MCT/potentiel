import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { InvalidOperationError } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { AchèvementAggregate } from '../achèvement.aggregate';
import { DateDeTransmissionAuCoContractantFuturError } from '../dateTransmissionAuCocontractantFutureError.error';

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  attestation: DocumentProjet.ValueType;
  dateTransmissionAuCocontractant: DateTime.ValueType;
  preuveTransmissionAuCocontractant: DocumentProjet.ValueType;
  date: DateTime.ValueType;
  utilisateur: IdentifiantUtilisateur.ValueType;
  aUnAbandonAccordé: boolean;
};

export async function transmettre(
  this: AchèvementAggregate,
  {
    identifiantProjet,
    attestation,
    dateTransmissionAuCocontractant,
    preuveTransmissionAuCocontractant,
    date,
    utilisateur,
    aUnAbandonAccordé,
  }: Options,
) {
  if (aUnAbandonAccordé) {
    throw new ImpossibleTransmettreAttestationDeConformitéProjetAbandonnéError();
  }

  if (dateTransmissionAuCocontractant.estDansLeFutur()) {
    throw new DateDeTransmissionAuCoContractantFuturError();
  }

  if (this.attestationConformité && this.preuveTransmissionAuCocontractant) {
    throw new AttestationDeConformitéDéjàTransmiseError();
  }

  const event: Lauréat.Achèvement.AttestationConformitéTransmiseEvent = {
    type: 'AttestationConformitéTransmise-V1',
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

export function applyAttestationConformitéTransmise(
  this: AchèvementAggregate,
  {
    payload: {
      dateTransmissionAuCocontractant,
      date,
      utilisateur,
      attestation,
      preuveTransmissionAuCocontractant,
    },
  }: Lauréat.Achèvement.AttestationConformitéTransmiseEvent,
) {
  this.utilisateur = IdentifiantUtilisateur.convertirEnValueType(utilisateur);
  this.attestationConformité = {
    format: attestation.format,
    date: DateTime.convertirEnValueType(date),
  };
  this.preuveTransmissionAuCocontractant = {
    format: preuveTransmissionAuCocontractant.format,
    date: DateTime.convertirEnValueType(dateTransmissionAuCocontractant),
  };
}
class AttestationDeConformitéDéjàTransmiseError extends InvalidOperationError {
  constructor() {
    super('le projet a déjà une attestation de conformité');
  }
}

class ImpossibleTransmettreAttestationDeConformitéProjetAbandonnéError extends InvalidOperationError {
  constructor() {
    super(
      'Il est impossible de transmettre une attestation de conformité pour un projet abandonné',
    );
  }
}
