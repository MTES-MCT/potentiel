// Third party

// Workspaces
import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

// Package
import { TâcheAggregate } from '../tâche.aggregate';
import * as TypeTâche from '../typeTâche.valueType';

export type TâcheAjoutéeEvent = DomainEvent<
  'TâcheAjoutée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    type: TypeTâche.RawType;
    ajoutéeLe: DateTime.RawType;
  }
>;

export type TâcheRelancéeEvent = DomainEvent<
  'TâcheRelancée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    type: TypeTâche.RawType;
  }
>;

export type TâcheRenouvelléeEvent = DomainEvent<
  'TâcheRenouvellée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    type: TypeTâche.RawType;
  }
>;

export type AjouterOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  typeTâche: TypeTâche.ValueType;
};

export async function ajouter(
  this: TâcheAggregate,
  { identifiantProjet, typeTâche }: AjouterOptions,
) {
  const event: TâcheAjoutéeEvent | TâcheRelancéeEvent | TâcheRenouvelléeEvent = this.type.estÉgaleÀ(
    TypeTâche.inconnue,
  )
    ? {
        type: 'TâcheAjoutée-V1',
        payload: {
          ajoutéeLe: DateTime.now().formatter(),
          identifiantProjet: identifiantProjet.formatter(),
          type: typeTâche.type,
        },
      }
    : this.achevée
    ? {
        type: 'TâcheRenouvellée-V1',
        payload: {
          identifiantProjet: identifiantProjet.formatter(),
          type: typeTâche.type,
        },
      }
    : {
        type: 'TâcheRelancée-V1',
        payload: {
          identifiantProjet: identifiantProjet.formatter(),
          type: typeTâche.type,
        },
      };

  await this.publish(event);
}

export function applyTâcheAjoutée(this: TâcheAggregate, { payload: { type } }: TâcheAjoutéeEvent) {
  this.type = TypeTâche.convertirEnValueType(type);
  this.achevée = false;
}

export function applyTâcheRenouvellée(this: TâcheAggregate, event: TâcheRenouvelléeEvent) {
  this.achevée = false;
}
