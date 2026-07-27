import { match } from 'ts-pattern';

import { DateTime } from '@potentiel-domain/common';
import { AbstractAggregate, type AggregateType } from '@potentiel-domain/core';

import type { ProjetAggregateRoot } from '../projet.aggregateRoot.js';
import type { ArchiverÉliminéOptions } from './archiver/archiverÉliminé.options.js';
import type { ÉliminéArchivéEvent } from './archiver/éliminéArchivé.event.js';
import type { NotifierÉliminéOptions } from './notifier/notifierÉliminé.option.js';
import type { ÉliminéNotifiéEvent } from './notifier/éliminéNotifié.event.js';
import { RecoursAggregate } from './recours/recours.aggregate.js';
import { ÉliminéNonNotifiéError } from './éliminé.error.js';
import type { ÉliminéEvent } from './éliminé.event.js';

export class ÉliminéAggregate extends AbstractAggregate<
  ÉliminéEvent,
  'éliminé',
  ProjetAggregateRoot
> {
  get projet() {
    return this.parent;
  }

  #recours!: AggregateType<RecoursAggregate>;
  get recours() {
    return this.#recours;
  }

  #notifiéLe?: DateTime.ValueType;
  get notifiéLe() {
    if (!this.#notifiéLe) {
      throw new ÉliminéNonNotifiéError();
    }

    return this.#notifiéLe;
  }

  #estNotifié: boolean = false;
  get estNotifié() {
    return this.#estNotifié;
  }

  #estArchivé: boolean = false;
  get estArchivé() {
    return this.#estArchivé;
  }

  async init() {
    this.#recours = await this.loadAggregate(
      RecoursAggregate,
      `recours|${this.projet.identifiantProjet.formatter()}`,
    );
  }

  async archiver({ dateArchive, identifiantUtilisateur }: ArchiverÉliminéOptions) {
    if (!this.estArchivé) {
      const event: ÉliminéArchivéEvent = {
        type: 'ÉliminéArchivé-V1',
        payload: {
          identifiantProjet: this.projet.identifiantProjet.formatter(),
          archivéLe: dateArchive.formatter(),
          archivéPar: identifiantUtilisateur.formatter(),
        },
      };

      await this.publish(event);
    }
  }

  async notifier({ notifiéLe, notifiéPar, attestation }: NotifierÉliminéOptions) {
    const event: ÉliminéNotifiéEvent = {
      type: 'ÉliminéNotifié-V1',
      payload: {
        identifiantProjet: this.projet.identifiantProjet.formatter(),
        notifiéLe: notifiéLe.formatter(),
        notifiéPar: notifiéPar.formatter(),
        attestation: {
          format: attestation.format,
        },
      },
    };

    await this.publish(event);
  }

  apply(event: ÉliminéEvent) {
    match(event)
      .with(
        {
          type: 'ÉliminéArchivé-V1',
        },
        (event) => this.applyÉliminéArchivéV1(event),
      )
      .with(
        {
          type: 'ÉliminéNotifié-V1',
        },
        (event) => this.applyÉliminéNotifiéV1(event),
      )
      .exhaustive();
  }

  private applyÉliminéArchivéV1(_: ÉliminéArchivéEvent) {
    this.#estArchivé = true;
  }

  private applyÉliminéNotifiéV1({ payload: { notifiéLe } }: ÉliminéNotifiéEvent) {
    this.#estNotifié = true;
    this.#notifiéLe = DateTime.convertirEnValueType(notifiéLe);
  }
}
