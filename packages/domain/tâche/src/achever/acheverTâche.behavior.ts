// Third party

import { DateTime, type IdentifiantProjet } from '@potentiel-domain/common';
// Workspaces
import type { DomainEvent } from '@potentiel-domain/core';

import * as TypeTâche from '../typeTâche.valueType';
// Package
import type { TâcheAggregate } from '../tâche.aggregate';

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

export function applyTâcheAchevée(this: TâcheAggregate, _event: TâcheAchevéeEvent) {
  this.achevée = true;
}
