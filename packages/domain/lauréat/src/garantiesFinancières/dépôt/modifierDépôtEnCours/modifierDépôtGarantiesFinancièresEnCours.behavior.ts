import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { DocumentProjet } from '@potentiel-domain/document';
import { TypeGarantiesFinancières } from '../..';
import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DateConstitutionDansLeFutur } from '../../dateConstitutionDansLeFutur.error';
import { DateÉchéanceManquante } from '../../dateÉchéanceManquante.error';
import { DateÉchéanceNonAttendue } from '../../dateÉchéanceNonAttendue.error';
import { AucunDépôtDeGarantiesFinancièresEnCours } from '../../aucunDépôtDeGarantiesFinancièresEnCours.error';

export type DépôtGarantiesFinancièresEnCoursModifiéEvent = DomainEvent<
  'DépôtGarantiesFinancièresEnCoursModifié-V1',
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
  attestation: DocumentProjet.ValueType;
  dateConstitution: DateTime.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: IdentifiantUtilisateur.ValueType;
};

export async function modifierDépôtGarantiesFinancièresEnCours(
  this: GarantiesFinancièresAggregate,
  {
    attestation,
    dateConstitution,
    identifiantProjet,
    modifiéLe,
    type,
    dateÉchéance,
    modifiéPar,
  }: Options,
) {
  if (!this.dépôtEnCours) {
    throw new AucunDépôtDeGarantiesFinancièresEnCours();
  }
  if (dateConstitution.estDansLeFutur()) {
    throw new DateConstitutionDansLeFutur();
  }
  if (type.estAvecDateÉchéance() && !dateÉchéance) {
    throw new DateÉchéanceManquante();
  }
  if (!type.estAvecDateÉchéance() && dateÉchéance) {
    throw new DateÉchéanceNonAttendue();
  }
  const event: DépôtGarantiesFinancièresEnCoursModifiéEvent = {
    type: 'DépôtGarantiesFinancièresEnCoursModifié-V1',
    payload: {
      attestation: { format: attestation.format },
      dateConstitution: dateConstitution.formatter(),
      identifiantProjet: identifiantProjet.formatter(),
      modifiéLe: modifiéLe.formatter(),
      type: type.type,
      dateÉchéance: dateÉchéance?.formatter(),
      modifiéPar: modifiéPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyDépôtGarantiesFinancièresEnCoursModifié(
  this: GarantiesFinancièresAggregate,
  {
    payload: { type, dateÉchéance, dateConstitution, modifiéLe, attestation },
  }: DépôtGarantiesFinancièresEnCoursModifiéEvent,
) {
  this.dépôtEnCours = {
    type: TypeGarantiesFinancières.convertirEnValueType(type),
    dateÉchéance: dateÉchéance && DateTime.convertirEnValueType(dateÉchéance),
    dateConstitution: DateTime.convertirEnValueType(dateConstitution),
    soumisLe: DateTime.convertirEnValueType(modifiéLe),
    attestation,
  };
}
