import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { StatutGarantiesFinancières } from '..';
import { GarantiesFinancièresAggregate } from '../garantiesFinancières.aggregate';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { AucunesGarantiesFinancièresÀTraiter } from '../aucunesGarantiesFinancièresÀTraiter.error';

export type GarantiesFinancièresValidéesEvent = DomainEvent<
  'GarantiesFinancièresValidées-V1',
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

export async function valider(
  this: GarantiesFinancièresAggregate,
  { validéLe, identifiantProjet, validéPar }: Options,
) {
  if (!this.àTraiter) {
    throw new AucunesGarantiesFinancièresÀTraiter();
  }
  const event: GarantiesFinancièresValidéesEvent = {
    type: 'GarantiesFinancièresValidées-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      validéLe: validéLe.formatter(),
      validéPar: validéPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyGarantiesFinancièresValidées(
  this: GarantiesFinancièresAggregate,
  { payload: { validéLe } }: GarantiesFinancièresValidéesEvent,
) {
  this.statut = StatutGarantiesFinancières.validé;
  this.validées = {
    type: this.àTraiter!.type,
    ...(this.àTraiter!.dateÉchéance && { dateÉchéance: this.àTraiter!.dateÉchéance }),
    dateConstitution: this.àTraiter!.dateConstitution,
    validéLe: DateTime.convertirEnValueType(validéLe),
  };
  this.àTraiter = undefined;
}
