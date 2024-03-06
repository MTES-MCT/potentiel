import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { ÉtatGarantiesFinancières } from '../..';
import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { AucunDépôtDeGarantiesFinancièresEnCours } from '../../aucunDépôtDeGarantiesFinancièresEnCours.error';

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
  if (!this.dépôtEnCours) {
    throw new AucunDépôtDeGarantiesFinancièresEnCours();
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
  this.état = ÉtatGarantiesFinancières.validé;
  this.actuelles = {
    type: this.dépôtEnCours ? this.dépôtEnCours.type : 'type-inconnu',
    ...(this.dépôtEnCours &&
      this.dépôtEnCours.dateÉchéance && { dateÉchéance: this.dépôtEnCours!.dateÉchéance }),
    dateConstitution: this.dépôtEnCours!.dateConstitution,
    validéLe: DateTime.convertirEnValueType(validéLe),
    attestation: this.dépôtEnCours?.attestation,
  };
  this.dépôtEnCours = undefined;
}
