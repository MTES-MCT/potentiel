import { match } from 'ts-pattern';

import { AbstractAggregate, AggregateType, LoadAggregateV2 } from '@potentiel-domain/core';

import { ProjetAggregateRoot } from '../projet.aggregateRoot';

import { ÉliminéEvent } from './éliminé.event';
import { ÉliminéArchivéEvent } from './archiver/éliminéArchivé.event';
import { NotifierÉliminéOptions } from './notifier/notifierÉliminé.option';
import { ArchiverÉliminéOptions } from './archiver/archiverÉliminé.options';
import { ÉliminéNotifiéEvent } from './notifier/éliminéNotifié.event';
import { RecoursAggregate } from './recours/recours.aggregate';

export class ÉliminéAggregate extends AbstractAggregate<ÉliminéEvent> {
  #projet!: ProjetAggregateRoot;

  get projet() {
    return this.#projet;
  }

  #recours!: AggregateType<RecoursAggregate>;

  get recours() {
    return this.#recours;
  }

  #estArchivé: boolean = false;

  get estArchivé() {
    return this.#estArchivé;
  }

  async init(projet: ProjetAggregateRoot, loadAggregate: LoadAggregateV2) {
    this.#projet = projet;
    this.#recours = await loadAggregate(
      `recours|${this.projet.identifiantProjet.formatter()}`,
      RecoursAggregate,
    );
    await this.#recours.init(this);
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

  private applyÉliminéNotifiéV1(_: ÉliminéNotifiéEvent) {
    // TODO
  }
}
