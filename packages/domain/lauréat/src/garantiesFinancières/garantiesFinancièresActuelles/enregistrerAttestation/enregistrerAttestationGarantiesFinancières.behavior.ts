import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjet } from '@potentiel-domain/document';

import { DateConstitutionDansLeFuturError } from '../../dateConstitutionDansLeFutur.error';
import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export type AttestationGarantiesFinancièresEnregistréeEvent = DomainEvent<
  'AttestationGarantiesFinancièresEnregistrée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    attestation: { format: string };
    dateConstitution: DateTime.RawType;
    enregistréLe: DateTime.RawType;
    enregistréPar: IdentifiantUtilisateur.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  attestation: DocumentProjet.ValueType;
  dateConstitution: DateTime.ValueType;
  enregistréLe: DateTime.ValueType;
  enregistréPar: IdentifiantUtilisateur.ValueType;
};

export async function enregistrerAttestation(
  this: GarantiesFinancièresAggregate,
  { attestation, dateConstitution, identifiantProjet, enregistréLe, enregistréPar }: Options,
) {
  if (!this.actuelles) {
    throw new AucunesGarantiesFinancièresActuelles();
  }
  if (this.actuelles.dateConstitution && this.actuelles.attestation) {
    throw new AttestationGarantiesFinancièresDéjàExistante();
  }
  if (dateConstitution.estDansLeFutur()) {
    throw new DateConstitutionDansLeFuturError();
  }

  const event: AttestationGarantiesFinancièresEnregistréeEvent = {
    type: 'AttestationGarantiesFinancièresEnregistrée-V1',
    payload: {
      attestation: { format: attestation.format },
      dateConstitution: dateConstitution.formatter(),
      identifiantProjet: identifiantProjet.formatter(),
      enregistréLe: enregistréLe.formatter(),
      enregistréPar: enregistréPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyEnregistrerAttestationGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  { payload: { dateConstitution, attestation } }: AttestationGarantiesFinancièresEnregistréeEvent,
) {
  this.actuelles = {
    ...this.actuelles!,
    dateConstitution: DateTime.convertirEnValueType(dateConstitution),
    attestation,
  };
}

class AucunesGarantiesFinancièresActuelles extends InvalidOperationError {
  constructor() {
    super(`Il n'y a aucunes garanties financières actuelles pour ce projet`);
  }
}

class AttestationGarantiesFinancièresDéjàExistante extends InvalidOperationError {
  constructor() {
    super(`Il y a déjà une attestation pour ces garanties financières`);
  }
}
