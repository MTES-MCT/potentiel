import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';

import { GarantiesFinancièresEvent } from './garantiesFinancières.event';

export class GarantiesFinancièresAggregate extends AbstractAggregate<GarantiesFinancièresEvent> {
  #lauréat!: LauréatAggregate;
  get lauréat() {
    return this.#lauréat;
  }

  #aDesGarantiesFinancières: boolean = false;
  get aDesGarantiesFinancières() {
    return this.#aDesGarantiesFinancières;
  }

  async init(lauréat: LauréatAggregate) {
    this.#lauréat = lauréat;

    this.#aDesGarantiesFinancières =
      !lauréat.projet.candidature.typeGarantiesFinancières?.estInconnu();
  }

  apply(event: GarantiesFinancièresEvent): void {
    match(event)
      .with(
        {
          type: 'HistoriqueGarantiesFinancièresEffacé-V1',
        },
        () => this.applyHistoriqueGarantiesFinancièresEffacéV1(),
      )
      .with(
        {
          type: 'DépôtGarantiesFinancièresEnCoursValidé-V1',
        },
        () => this.applyDépôtGarantiesFinancièresEnCoursValidéV1(),
      )
      .with(
        {
          type: 'DépôtGarantiesFinancièresEnCoursValidé-V2',
        },
        () => this.applyDépôtGarantiesFinancièresEnCoursValidéV2(),
      )
      .with(
        {
          type: 'GarantiesFinancièresEnregistrées-V1',
        },
        () => this.applyGarantiesFinancièresEnregistréesV1(),
      )
      .with(
        {
          type: 'GarantiesFinancièresModifiées-V1',
        },
        () => this.applyGarantiesFinancièresModifiéesV1(),
      )
      .otherwise(() => {});
    // Provisoire le temps de déplacer toutes la logique métier du package lauréat à celui-ci.
    // Si l'on reste en `exhaustive` on pourrait avoir des erreurs si des événements non listés ici serait présent dans le stream
    // .exhaustive();
  }

  private applyDépôtGarantiesFinancièresEnCoursValidéV1() {
    this.#aDesGarantiesFinancières = true;
  }

  private applyDépôtGarantiesFinancièresEnCoursValidéV2() {
    this.#aDesGarantiesFinancières = true;
  }

  private applyGarantiesFinancièresEnregistréesV1() {
    this.#aDesGarantiesFinancières = true;
  }

  private applyGarantiesFinancièresModifiéesV1() {
    this.#aDesGarantiesFinancières = true;
  }

  private applyHistoriqueGarantiesFinancièresEffacéV1() {
    this.#aDesGarantiesFinancières = false;
  }
}
