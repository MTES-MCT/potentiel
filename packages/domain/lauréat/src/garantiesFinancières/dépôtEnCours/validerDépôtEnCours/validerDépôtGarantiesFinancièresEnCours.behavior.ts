import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { AucunDépôtEnCoursGarantiesFinancièresPourLeProjetError } from '../aucunDépôtEnCoursGarantiesFinancièresPourLeProjet.error';
import { StatutGarantiesFinancières, TypeGarantiesFinancières } from '../..';

/**
 * @deprecated Utilisez DépôtGarantiesFinancièresEnCoursValidéEvent à la place.
 * Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type DépôtGarantiesFinancièresEnCoursValidéEventV1 = DomainEvent<
  'DépôtGarantiesFinancièresEnCoursValidé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    validéLe: DateTime.RawType;
    validéPar: IdentifiantUtilisateur.RawType;
  }
>;

export type DépôtGarantiesFinancièresEnCoursValidéEvent = DomainEvent<
  'DépôtGarantiesFinancièresEnCoursValidé-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;

    typeDépôt: TypeGarantiesFinancières.RawType;
    dateÉchéance?: DateTime.RawType;
    dateConstitution: DateTime.RawType;
    soumisLe: DateTime.RawType;
    attestation?: { format: string };

    validéLe: DateTime.RawType;
    validéPar: IdentifiantUtilisateur.RawType;
  }
>;

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

  const event: DépôtGarantiesFinancièresEnCoursValidéEvent = {
    type: 'DépôtGarantiesFinancièresEnCoursValidé-V2',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      dateConstitution: dateConstitution.formatter(),
      typeDépôt: type,
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
  { payload: { validéLe } }: DépôtGarantiesFinancièresEnCoursValidéEventV1,
) {
  const dépôtValidé = this.dépôtsEnCours;

  this.actuelles = {
    statut: StatutGarantiesFinancières.validé,
    type: dépôtValidé ? dépôtValidé.type : TypeGarantiesFinancières.typeInconnu,
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
    payload: { validéLe, dateConstitution, typeDépôt, attestation, dateÉchéance },
  }: DépôtGarantiesFinancièresEnCoursValidéEvent,
) {
  this.actuelles = {
    statut: StatutGarantiesFinancières.validé,
    type: TypeGarantiesFinancières.convertirEnValueType(typeDépôt),
    dateÉchéance: dateÉchéance ? DateTime.convertirEnValueType(dateÉchéance) : undefined,
    dateConstitution: DateTime.convertirEnValueType(dateConstitution),
    attestation: attestation,
    validéLe: DateTime.convertirEnValueType(validéLe),
  };

  this.dépôtsEnCours = undefined;
}
