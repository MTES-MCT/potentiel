import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';

import { StatutAbandon } from '.';

import { AbandonEvent } from './abandon.event';
import { AbandonDemandéEvent, AbandonDemandéEventV1 } from './demander/demanderAbandon.event';
import { AbandonAccordéEvent } from './accorder/accorderAbandon.event';
import { AbandonRejetéEvent } from './rejeter/rejeterAbandon.event';
import { AbandonAnnuléEvent } from './annuler/annulerAbandon.event';

export class AbandonAggregate extends AbstractAggregate<AbandonEvent> {
  #lauréat!: LauréatAggregate;

  #statut: StatutAbandon.ValueType = StatutAbandon.inconnu;
  get statut() {
    return this.#statut;
  }

  get lauréat() {
    return this.#lauréat;
  }

  async init(lauréat: LauréatAggregate) {
    this.#lauréat = lauréat;
  }

  apply(event: AbandonEvent): void {
    match(event)
      .with(
        {
          type: 'AbandonDemandé-V1',
        },
        (event) => this.applyAbandonDemandéV1(event),
      )
      .with(
        {
          type: 'AbandonDemandé-V2',
        },
        (event) => this.applyAbandonDemandéV2(event),
      )
      .with(
        {
          type: 'AbandonAccordé-V1',
        },
        (event) => this.applyAbandonAccordéV1(event),
      )
      .with(
        {
          type: 'AbandonRejeté-V1',
        },
        (event) => this.applyAbandonRejetéV1(event),
      )
      .with(
        {
          type: 'AbandonAnnulé-V1',
        },
        (event) => this.applyAbandonAnnuléV1(event),
      )
      .otherwise(() => {});
    // Provisoire le temps de déplacer toutes la logique métier du package lauréat à celui-ci.
    // Si l'on reste en `exhaustive` on pourrait avoir des erreurs si des événements non listés ici serait présent dans le stream
    // .exhaustive();
  }

  private applyAbandonDemandéV1(_event: AbandonDemandéEventV1) {
    this.#statut = StatutAbandon.demandé;
  }

  private applyAbandonDemandéV2(_event: AbandonDemandéEvent) {
    this.#statut = StatutAbandon.demandé;
  }

  private applyAbandonAccordéV1(_event: AbandonAccordéEvent) {
    this.#statut = StatutAbandon.accordé;
  }

  private applyAbandonRejetéV1(_event: AbandonRejetéEvent) {
    this.#statut = StatutAbandon.rejeté;
  }

  private applyAbandonAnnuléV1(_event: AbandonAnnuléEvent) {
    this.#statut = StatutAbandon.annulé;
  }
}
