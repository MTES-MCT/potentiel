import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, NotFoundError } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { StatutGarantiesFinancières, TypeGarantiesFinancières } from '../..';
import { DateConstitutionDansLeFuturError } from '../../dateConstitutionDansLeFutur.error';
import { DateÉchéanceManquanteError } from '../../dateÉchéanceManquante.error';
import { DateÉchéanceNonAttendueError } from '../../dateÉchéanceNonAttendue.error';
import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { GarantiesFinancièresDéjàLevéesError } from '../../garantiesFinancièresDéjàLevées.error';

export type GarantiesFinancièresModifiéesEvent = DomainEvent<
  'GarantiesFinancièresModifiées-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    type: TypeGarantiesFinancières.RawType;
    dateÉchéance?: DateTime.RawType;
    attestation: { format: string };
    dateConstitution: DateTime.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: IdentifiantUtilisateur.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  type: TypeGarantiesFinancières.ValueType;
  dateÉchéance?: DateTime.ValueType;
  attestation: { format: string };
  dateConstitution: DateTime.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: IdentifiantUtilisateur.ValueType;
};

export async function modifier(
  this: GarantiesFinancièresAggregate,
  {
    attestation,
    dateConstitution,
    identifiantProjet,
    type,
    dateÉchéance,
    modifiéLe,
    modifiéPar,
  }: Options,
) {
  if (!this.actuelles) {
    throw new AucunesGarantiesFinancièresValidées();
  }
  if (type.estAvecDateÉchéance() && !dateÉchéance) {
    throw new DateÉchéanceManquanteError();
  }
  if (!type.estAvecDateÉchéance() && dateÉchéance) {
    throw new DateÉchéanceNonAttendueError();
  }
  if (dateConstitution.estDansLeFutur()) {
    throw new DateConstitutionDansLeFuturError();
  }

  const event: GarantiesFinancièresModifiéesEvent = {
    type: 'GarantiesFinancièresModifiées-V1',
    payload: {
      attestation: { format: attestation.format },
      dateConstitution: dateConstitution.formatter(),
      identifiantProjet: identifiantProjet.formatter(),
      type: type.type,
      dateÉchéance: dateÉchéance?.formatter(),
      modifiéLe: modifiéLe.formatter(),
      modifiéPar: modifiéPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyModifierGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  {
    payload: { type, dateÉchéance, dateConstitution, attestation },
  }: GarantiesFinancièresModifiéesEvent,
) {
  if (this.actuelles?.statut.estLevé()) {
    throw new GarantiesFinancièresDéjàLevéesError();
  }

  this.actuelles = {
    ...this.actuelles,
    statut: StatutGarantiesFinancières.validé,
    type: TypeGarantiesFinancières.convertirEnValueType(type),
    dateÉchéance: dateÉchéance && DateTime.convertirEnValueType(dateÉchéance),
    dateConstitution: DateTime.convertirEnValueType(dateConstitution),
    attestation,
  };
}

class AucunesGarantiesFinancièresValidées extends NotFoundError {
  constructor() {
    super(`Il n'y a aucunes garanties financières validées pour ce projet`);
  }
}
