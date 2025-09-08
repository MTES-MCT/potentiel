import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { Candidature } from '@potentiel-domain/projet';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export function applyDépôtGarantiesFinancièresEnCoursValidéV1(
  this: GarantiesFinancièresAggregate,
  {
    payload: { validéLe },
  }: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEventV1,
) {
  const dépôtValidé = this.dépôtsEnCours;

  this.actuelles = {
    statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.validé,
    type: dépôtValidé ? dépôtValidé.type : Candidature.TypeGarantiesFinancières.typeInconnu,
    dateÉchéance: dépôtValidé && dépôtValidé.dateÉchéance,
    dateConstitution: dépôtValidé && dépôtValidé.dateConstitution,
    attestation: dépôtValidé && dépôtValidé.attestation,
    validéLe: DateTime.convertirEnValueType(validéLe),
  };

  this.dépôtsEnCours = undefined;
}

export function applyDépôtGarantiesFinancièresEnCoursValidé(
  this: GarantiesFinancièresAggregate,
  {
    payload: { validéLe, dateConstitution, type, attestation, dateÉchéance },
  }: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent,
) {
  this.actuelles = {
    statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.validé,
    type: Candidature.TypeGarantiesFinancières.convertirEnValueType(type),
    dateÉchéance: dateÉchéance ? DateTime.convertirEnValueType(dateÉchéance) : undefined,
    dateConstitution: DateTime.convertirEnValueType(dateConstitution),
    attestation,
    validéLe: DateTime.convertirEnValueType(validéLe),
  };

  this.dépôtsEnCours = undefined;
}
