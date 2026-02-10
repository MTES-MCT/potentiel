import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../index.js';
import { LauréatAggregate } from '../lauréat.aggregate.js';

import { TâcheEvent } from './tâche.event.js';
import * as TypeTâche from './typeTâche.valueType.js';
import {
  TâcheAjoutéeEvent,
  TâcheRelancéeEvent,
  TâcheRenouvelléeEvent,
} from './ajouter/ajouterTâche.event.js';
import { TâcheAchevéeEvent } from './achever/acheverTâche.event.js';

export class TâcheAggregate extends AbstractAggregate<TâcheEvent, 'tâche', LauréatAggregate> {
  #achevée: boolean = false;

  get lauréat() {
    return this.parent;
  }

  private get identifiantProjet(): IdentifiantProjet.ValueType {
    return this.lauréat.projet.identifiantProjet;
  }

  get typeTâche() {
    return TypeTâche.convertirEnValueType(
      this.aggregateId.slice(this.aggregateId.indexOf('|') + 1, this.aggregateId.indexOf('#')),
    );
  }

  async ajouter() {
    const event: TâcheAjoutéeEvent | TâcheRelancéeEvent | TâcheRenouvelléeEvent = !this.exists
      ? {
          type: 'TâcheAjoutée-V1',
          payload: {
            ajoutéeLe: DateTime.now().formatter(),
            identifiantProjet: this.identifiantProjet.formatter(),
            typeTâche: this.typeTâche.type,
          },
        }
      : this.#achevée
        ? {
            type: 'TâcheRenouvellée-V1',
            payload: {
              ajoutéeLe: DateTime.now().formatter(),
              identifiantProjet: this.identifiantProjet.formatter(),
              typeTâche: this.typeTâche.type,
            },
          }
        : {
            type: 'TâcheRelancée-V1',
            payload: {
              relancéeLe: DateTime.now().formatter(),
              identifiantProjet: this.identifiantProjet.formatter(),
              typeTâche: this.typeTâche.type,
            },
          };

    await this.publish(event);
  }

  async achever() {
    if (this.exists && !this.#achevée) {
      const event: TâcheAchevéeEvent = {
        type: 'TâcheAchevée-V1',
        payload: {
          achevéeLe: DateTime.now().formatter(),
          identifiantProjet: this.identifiantProjet.formatter(),
          typeTâche: this.typeTâche.type,
        },
      };

      await this.publish(event);
    }
  }

  apply(event: TâcheEvent) {
    match(event)
      .with({ type: 'TâcheAjoutée-V1' }, this.applyTâcheAjoutée.bind(this))
      .with({ type: 'TâcheRelancée-V1' }, this.applyTâcheRelancée.bind(this))
      .with({ type: 'TâcheRenouvellée-V1' }, this.applyTâcheRenouvellée.bind(this))
      .with({ type: 'TâcheAchevée-V1' }, this.applyTâcheAchevée.bind(this))
      .exhaustive();
  }

  applyTâcheAjoutée(_: TâcheAjoutéeEvent) {}

  applyTâcheRelancée(_: TâcheRelancéeEvent) {
    this.#achevée = false;
  }

  applyTâcheRenouvellée(_: TâcheRenouvelléeEvent) {
    this.#achevée = false;
  }

  applyTâcheAchevée(_: TâcheAchevéeEvent) {
    this.#achevée = true;
  }
}
