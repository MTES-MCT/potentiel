// Third party

// Workspaces
import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

// Package
import { TâcheAggregate } from '../tâche.aggregate';

export type TâcheAchevéeEvent = DomainEvent<
  'TâcheAchevée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    achevéeLe: DateTime.RawType;
  }
>;

export type AcheverOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function achever(this: TâcheAggregate, { identifiantProjet }: AcheverOptions) {
  if (!this.achevée) {
    const event: TâcheAchevéeEvent = {
      type: 'TâcheAchevée-V1',
      payload: {
        achevéeLe: DateTime.now().formatter(),
        identifiantProjet: identifiantProjet.formatter(),
      },
    };

    await this.publish(event);
  }
}

export function applyTâcheAchevée(this: TâcheAggregate, event: TâcheAchevéeEvent) {
  this.achevée = true;
}
