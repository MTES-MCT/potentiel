// Third party

// Workspaces
import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

// Package
import { TâcheAggregate } from '../tâche.aggregate';

export type TâcheSuppriméeEvent = DomainEvent<
  'TâcheSupprimée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    suppriméeLe: DateTime.RawType;
  }
>;

export type SupprimerOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateSuppression: DateTime.ValueType;
};

export async function supprimer(
  this: TâcheAggregate,
  { dateSuppression, identifiantProjet }: SupprimerOptions,
) {
  const event: TâcheSuppriméeEvent = {
    type: 'TâcheSupprimée-V1',
    payload: {
      suppriméeLe: dateSuppression.formatter(),
      identifiantProjet: identifiantProjet.formatter(),
    },
  };

  await this.publish(event);
}

export function applyTâcheSupprimée(this: TâcheAggregate, event: TâcheSuppriméeEvent) {
  this.achevée = true;
}
