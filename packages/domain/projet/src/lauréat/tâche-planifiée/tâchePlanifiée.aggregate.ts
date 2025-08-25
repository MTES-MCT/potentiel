import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../..';

import * as StatutTâchePlanifiée from './statutTâchePlanifiée.valueType';
import { TâchePlanifiéeAjoutéeEvent } from './ajouter/ajouterTâchePlanifiée.event';
import { AjouterOptions } from './ajouter/ajouterTâchePlanifiée.option';
import { TâchePlanifiéeAnnuléeEvent } from './annuler/annulerTâchePlanifiée.event';
import { TâchePlanifiéeExecutéeEvent } from './exécuter/exécuterTâchePlanifiée.event';
import { TâchePlanifiéeEvent } from './tâchePlanifiée.event';
import { TâcheAnnuléeError, TâcheDéjàExécutéeError } from './tâchePlanifiée.error';
import { ExécuterOptions } from './exécuter/exécuterTâchePlanifiée.options';

export class TâchePlanifiéeAggregate extends AbstractAggregate<
  TâchePlanifiéeEvent,
  'tâche-planifiée'
> {
  #statut: StatutTâchePlanifiée.ValueType = StatutTâchePlanifiée.inconnu;
  #àExécuterLe?: DateTime.ValueType;

  get typeTâchePlanifiée() {
    return this.aggregateId.slice(this.aggregateId.indexOf('|') + 1, this.aggregateId.indexOf('#'));
  }
  get identifiantProjet() {
    return IdentifiantProjet.convertirEnValueType(
      this.aggregateId.slice(this.aggregateId.indexOf('#') + 1),
    );
  }

  async ajouter({ àExécuterLe }: AjouterOptions) {
    if (!this.#àExécuterLe?.estÉgaleÀ(àExécuterLe) || this.#statut.estAnnulé()) {
      const event: TâchePlanifiéeAjoutéeEvent = {
        type: 'TâchePlanifiéeAjoutée-V1',
        payload: {
          ajoutéeLe: DateTime.now().formatter(),
          identifiantProjet: this.identifiantProjet.formatter(),
          typeTâchePlanifiée: this.typeTâchePlanifiée,
          àExécuterLe: àExécuterLe.formatter(),
        },
      };
      await this.publish(event);
    }
  }

  async annuler() {
    if (this.#statut.estEnAttenteExécution()) {
      const event: TâchePlanifiéeAnnuléeEvent = {
        type: 'TâchePlanifiéeAnnulée-V1',
        payload: {
          annuléeLe: DateTime.now().formatter(),
          identifiantProjet: this.identifiantProjet.formatter(),
          typeTâchePlanifiée: this.typeTâchePlanifiée,
        },
      };
      await this.publish(event);
    }
  }

  async exécuter({ exécutéeLe }: ExécuterOptions) {
    if (this.#statut.estAnnulé()) {
      throw new TâcheAnnuléeError();
    }
    if (this.#statut.estExécuté()) {
      throw new TâcheDéjàExécutéeError();
    }
    const event: TâchePlanifiéeExecutéeEvent = {
      type: 'TâchePlanifiéeExecutée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        exécutéeLe: exécutéeLe.formatter(),
        typeTâchePlanifiée: this.typeTâchePlanifiée,
      },
    };
    await this.publish(event);
  }

  apply(event: TâchePlanifiéeEvent) {
    match(event)
      .with({ type: 'TâchePlanifiéeAjoutée-V1' }, this.applyTâchePlanifiéeAjoutée.bind(this))
      .with({ type: 'TâchePlanifiéeAnnulée-V1' }, this.applyTâchePlanifiéeAnnulée.bind(this))
      .with({ type: 'TâchePlanifiéeExecutée-V1' }, this.applyTâchePlanifiéeExecutée.bind(this))
      .exhaustive();
  }

  applyTâchePlanifiéeAjoutée({ payload: { àExécuterLe } }: TâchePlanifiéeAjoutéeEvent) {
    this.#àExécuterLe = DateTime.convertirEnValueType(àExécuterLe);
    this.#statut = StatutTâchePlanifiée.enAttenteExécution;
  }

  applyTâchePlanifiéeAnnulée(_: TâchePlanifiéeAnnuléeEvent) {
    this.#statut = StatutTâchePlanifiée.annulée;
  }

  applyTâchePlanifiéeExecutée(_: TâchePlanifiéeExecutéeEvent) {
    this.#statut = StatutTâchePlanifiée.exécutée;
  }
}
