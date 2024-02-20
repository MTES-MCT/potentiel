// Third party

// Workspaces
import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

// Package
import { TâcheAggregate } from '../tâche.aggregate';
import * as TypeTâche from '../typeTâche.valueType';

export type TâcheAchevéeEvent = DomainEvent<
  'TâcheAchevée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    achevéeLe: DateTime.RawType;
    typeTâche: TypeTâche.RawType;
  }
>;

export type AcheverOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function achever(this: TâcheAggregate, { identifiantProjet }: AcheverOptions) {
  if (!this.typeTâche.estÉgaleÀ(TypeTâche.inconnue) && !this.achevée) {
    const event: TâcheAchevéeEvent = {
      type: 'TâcheAchevée-V1',
      payload: {
        achevéeLe: DateTime.now().formatter(),
        identifiantProjet: identifiantProjet.formatter(),
        typeTâche: this.typeTâche.type,
      },
    };

    await this.publish(event);
  }
}

export function applyTâcheAchevée(this: TâcheAggregate, event: TâcheAchevéeEvent) {
  this.achevée = true;
}
