import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { StatutGarantiesFinancières } from '../..';
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
  if (!this.àTraiter) {
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
  this.statut = StatutGarantiesFinancières.validé;
  this.validées = {
    type: this.àTraiter ? this.àTraiter.type : 'type-inconnu',
    ...(this.àTraiter &&
      this.àTraiter.dateÉchéance && { dateÉchéance: this.àTraiter!.dateÉchéance }),
    dateConstitution: this.àTraiter!.dateConstitution,
    validéLe: DateTime.convertirEnValueType(validéLe),
    attestation: this.àTraiter?.attestation,
  };
  this.àTraiter = undefined;
}
