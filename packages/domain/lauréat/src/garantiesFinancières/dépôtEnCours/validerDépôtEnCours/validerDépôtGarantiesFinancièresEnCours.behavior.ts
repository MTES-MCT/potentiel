import { DateTime, type IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature, type Lauréat } from '@potentiel-domain/projet';
import type { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { StatutGarantiesFinancières } from '../..';
import type { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { AucunDépôtEnCoursGarantiesFinancièresPourLeProjetError } from '../aucunDépôtEnCoursGarantiesFinancièresPourLeProjet.error';

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  validéLe: DateTime.ValueType;
  validéPar: IdentifiantUtilisateur.ValueType;
};

export async function validerDépôtEnCours(
  this: GarantiesFinancièresAggregate,
  { validéLe, identifiantProjet, validéPar }: Options,
) {
  if (!this.dépôtsEnCours) {
    throw new AucunDépôtEnCoursGarantiesFinancièresPourLeProjetError();
  }

  const {
    dateConstitution,
    type: { type },
    attestation,
    dateÉchéance,
    soumisLe,
  } = this.dépôtsEnCours;

  const event: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent = {
    type: 'DépôtGarantiesFinancièresEnCoursValidé-V2',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      dateConstitution: dateConstitution.formatter(),
      type,
      dateÉchéance: dateÉchéance?.formatter(),
      soumisLe: soumisLe.formatter(),
      attestation,
      validéLe: validéLe.formatter(),
      validéPar: validéPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyDépôtGarantiesFinancièresEnCoursValidéV1(
  this: GarantiesFinancièresAggregate,
  {
    payload: { validéLe },
  }: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEventV1,
) {
  const dépôtValidé = this.dépôtsEnCours;

  this.actuelles = {
    statut: StatutGarantiesFinancières.validé,
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
    statut: StatutGarantiesFinancières.validé,
    type: Candidature.TypeGarantiesFinancières.convertirEnValueType(type),
    dateÉchéance: dateÉchéance ? DateTime.convertirEnValueType(dateÉchéance) : undefined,
    dateConstitution: DateTime.convertirEnValueType(dateConstitution),
    attestation,
    validéLe: DateTime.convertirEnValueType(validéLe),
  };

  this.dépôtsEnCours = undefined;
}
