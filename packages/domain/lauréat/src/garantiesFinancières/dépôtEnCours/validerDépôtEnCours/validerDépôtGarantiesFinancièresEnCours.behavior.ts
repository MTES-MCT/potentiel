import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { AucunDépôtEnCoursGarantiesFinancièresPourLeProjetError } from '../aucunDépôtEnCoursGarantiesFinancièresPourLeProjet.error';
import { StatutGarantiesFinancières, TypeGarantiesFinancières } from '../..';

export type DépôtGarantiesFinancièresEnCoursValidéEvent = DomainEvent<
  'DépôtGarantiesFinancièresEnCoursValidé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
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
  const event: DépôtGarantiesFinancièresEnCoursValidéEvent = {
    type: 'DépôtGarantiesFinancièresEnCoursValidé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      validéLe: validéLe.formatter(),
      validéPar: validéPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyDépôtGarantiesFinancièresEnCoursValidé(
  this: GarantiesFinancièresAggregate,
  { payload: { validéLe } }: DépôtGarantiesFinancièresEnCoursValidéEvent,
) {
  const dépôtValidé = this.dépôtsEnCours;

  this.actuelles = {
    statut: StatutGarantiesFinancières.validées,
    type: dépôtValidé ? dépôtValidé.type : TypeGarantiesFinancières.typeInconnu,
    dateÉchéance: dépôtValidé && dépôtValidé.dateÉchéance,
    dateConstitution: dépôtValidé && dépôtValidé.dateConstitution,
    attestation: dépôtValidé && dépôtValidé.attestation,
    validéLe: DateTime.convertirEnValueType(validéLe),
  };

  this.dépôtsEnCours = undefined;
}
