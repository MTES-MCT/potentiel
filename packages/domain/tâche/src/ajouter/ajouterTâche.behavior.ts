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
    typeTâche: TypeTâche.RawType;
    ajoutéeLe: DateTime.RawType;
  }
>;

export type TâcheRelancéeEvent = DomainEvent<
  'TâcheRelancée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typeTâche: TypeTâche.RawType;
    relancéeLe: DateTime.RawType;
  }
>;

export type TâcheRenouvelléeEvent = DomainEvent<
  'TâcheRenouvellée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typeTâche: TypeTâche.RawType;
    ajoutéeLe: DateTime.RawType;
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
  const event: TâcheAjoutéeEvent | TâcheRelancéeEvent | TâcheRenouvelléeEvent =
    this.typeTâche.estÉgaleÀ(TypeTâche.inconnue)
      ? {
          type: 'TâcheAjoutée-V1',
          payload: {
            ajoutéeLe: DateTime.now().formatter(),
            identifiantProjet: identifiantProjet.formatter(),
            typeTâche: typeTâche.type,
          },
        }
      : this.achevée
      ? {
          type: 'TâcheRenouvellée-V1',
          payload: {
            ajoutéeLe: DateTime.now().formatter(),
            identifiantProjet: identifiantProjet.formatter(),
            typeTâche: typeTâche.type,
          },
        }
      : {
          type: 'TâcheRelancée-V1',
          payload: {
            relancéeLe: DateTime.now().formatter(),
            identifiantProjet: identifiantProjet.formatter(),
            typeTâche: typeTâche.type,
          },
        };

  await this.publish(event);
}

export function applyTâcheAjoutée(
  this: TâcheAggregate,
  { payload: { typeTâche: type } }: TâcheAjoutéeEvent,
) {
  this.typeTâche = TypeTâche.convertirEnValueType(type);
  this.achevée = false;
}

export function applyTâcheRenouvellée(this: TâcheAggregate, _event: TâcheRenouvelléeEvent) {
  this.achevée = false;
}
