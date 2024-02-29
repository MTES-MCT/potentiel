import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { StatutGarantiesFinancières } from '..';
import { GarantiesFinancièresAggregate } from '../garantiesFinancières.aggregate';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { AucunesGarantiesFinancièresÀTraiter } from '../aucunesGarantiesFinancièresÀTraiter.error';

export type GarantiesFinancièresÀTraiterSuppriméesEvent = DomainEvent<
  'GarantiesFinancièresÀTraiterSupprimées-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    suppriméLe: DateTime.RawType;
    suppriméPar: IdentifiantUtilisateur.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  suppriméLe: DateTime.ValueType;
  suppriméPar: IdentifiantUtilisateur.ValueType;
};

export async function supprimerGarantiesFinancièresÀTraiter(
  this: GarantiesFinancièresAggregate,
  { suppriméLe, identifiantProjet, suppriméPar }: Options,
) {
  if (!this.àTraiter) {
    throw new AucunesGarantiesFinancièresÀTraiter();
  }
  const event: GarantiesFinancièresÀTraiterSuppriméesEvent = {
    type: 'GarantiesFinancièresÀTraiterSupprimées-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      suppriméLe: suppriméLe.formatter(),
      suppriméPar: suppriméPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyGarantiesFinancièresÀTraiterSupprimées(this: GarantiesFinancièresAggregate) {
  this.statut = this.enAttente
    ? StatutGarantiesFinancières.enAttente
    : this.validées
    ? StatutGarantiesFinancières.validé
    : undefined;

  this.àTraiter = undefined;
}
