// Third party

// Workspaces
import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

// Package
import { TâcheAggregate } from '../tâche.aggregate';

export type TâcheAjoutéeEvent = DomainEvent<
  'TâcheAjoutée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typeTâche: string;
    ajoutéeLe: DateTime.RawType;
  }
>;

export type TâcheRelancéeEvent = DomainEvent<
  'TâcheRelancée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typeTâche: string;
    relancéeLe: DateTime.RawType;
  }
>;

export type TâcheRenouvelléeEvent = DomainEvent<
  'TâcheRenouvellée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typeTâche: string;
    ajoutéeLe: DateTime.RawType;
  }
>;

export type AjouterOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  typeTâche: string;
};

export async function ajouter(
  this: TâcheAggregate,
  { identifiantProjet, typeTâche }: AjouterOptions,
) {
  const event: TâcheAjoutéeEvent | TâcheRelancéeEvent | TâcheRenouvelléeEvent =
    this.typeTâche === 'inconnue'
      ? {
          type: 'TâcheAjoutée-V1',
          payload: {
            ajoutéeLe: DateTime.now().formatter(),
            identifiantProjet: identifiantProjet.formatter(),
            typeTâche: typeTâche,
          },
        }
      : this.achevée
        ? {
            type: 'TâcheRenouvellée-V1',
            payload: {
              ajoutéeLe: DateTime.now().formatter(),
              identifiantProjet: identifiantProjet.formatter(),
              typeTâche: typeTâche,
            },
          }
        : {
            type: 'TâcheRelancée-V1',
            payload: {
              relancéeLe: DateTime.now().formatter(),
              identifiantProjet: identifiantProjet.formatter(),
              typeTâche: typeTâche,
            },
          };

  await this.publish(event);
}

export function applyTâcheAjoutée(
  this: TâcheAggregate,
  { payload: { typeTâche } }: TâcheAjoutéeEvent,
) {
  this.typeTâche = typeTâche;
  this.achevée = false;
}

export function applyTâcheRenouvellée(this: TâcheAggregate, _event: TâcheRenouvelléeEvent) {
  this.achevée = false;
}
