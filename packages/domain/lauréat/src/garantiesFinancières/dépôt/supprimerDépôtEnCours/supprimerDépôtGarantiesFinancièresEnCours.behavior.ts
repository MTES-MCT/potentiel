import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { StatutGarantiesFinancières } from '../..';
import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { AucunDépôtDeGarantiesFinancièresEnCours } from '../../aucunDépôtDeGarantiesFinancièresEnCours.error';

export type DépôtGarantiesFinancièresEnCoursSuppriméEvent = DomainEvent<
  'DépôtGarantiesFinancièresEnCoursSupprimé-V1',
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

export async function supprimerDépôtGarantiesFinancièresEnCours(
  this: GarantiesFinancièresAggregate,
  { suppriméLe, identifiantProjet, suppriméPar }: Options,
) {
  if (!this.àTraiter) {
    throw new AucunDépôtDeGarantiesFinancièresEnCours();
  }
  const event: DépôtGarantiesFinancièresEnCoursSuppriméEvent = {
    type: 'DépôtGarantiesFinancièresEnCoursSupprimé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      suppriméLe: suppriméLe.formatter(),
      suppriméPar: suppriméPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyDépôtGarantiesFinancièresEnCoursSupprimé(this: GarantiesFinancièresAggregate) {
  this.statut = this.enAttente
    ? StatutGarantiesFinancières.enAttente
    : this.validées
    ? StatutGarantiesFinancières.validé
    : undefined;

  this.àTraiter = undefined;
}
