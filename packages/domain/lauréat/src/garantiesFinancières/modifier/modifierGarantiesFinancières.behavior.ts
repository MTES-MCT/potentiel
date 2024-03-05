import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, NotFoundError } from '@potentiel-domain/core';

import { TypeGarantiesFinancières } from '..';
import { GarantiesFinancièresAggregate } from '../garantiesFinancières.aggregate';
import { DateÉchéanceManquante } from '../dateÉchéanceManquante.error';
import { DateÉchéanceNonAttendue } from '../dateÉchéanceNonAttendue.error';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DateConstitutionDansLeFutur } from '../dateConstitutionDansLeFutur.error';

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
  if (!this.validées) {
    throw new AucunesGarantiesFinancièresValidées();
  }
  if (type.estAvecDateÉchéance() && !dateÉchéance) {
    throw new DateÉchéanceManquante();
  }
  if (!type.estAvecDateÉchéance() && dateÉchéance) {
    throw new DateÉchéanceNonAttendue();
  }
  if (dateConstitution.estDansLeFutur()) {
    throw new DateConstitutionDansLeFutur();
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
  { payload: { type, dateÉchéance, dateConstitution } }: GarantiesFinancièresModifiéesEvent,
) {
  this.validées = {
    ...this.validées,
    type: TypeGarantiesFinancières.convertirEnValueType(type),
    dateÉchéance: dateÉchéance && DateTime.convertirEnValueType(dateÉchéance),
    dateConstitution: DateTime.convertirEnValueType(dateConstitution),
  };
}

class AucunesGarantiesFinancièresValidées extends NotFoundError {
  constructor() {
    super(`Il n'y a aucunes garanties financières validées pour ce projet`);
  }
}
