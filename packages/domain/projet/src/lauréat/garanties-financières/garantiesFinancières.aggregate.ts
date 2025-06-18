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

  #aUnDépôtEnCours: boolean = false;
  get aUnDépôtEnCours() {
    return this.#aUnDépôtEnCours;
  }

  async init(lauréat: LauréatAggregate) {
    this.#lauréat = lauréat;

    this.#aDesGarantiesFinancières =
      !lauréat.projet.candidature.typeGarantiesFinancières?.estInconnu();

    this.#aUnDépôtEnCours = false;
  }

  apply(event: GarantiesFinancièresEvent): void {
    match(event)
      .with(
        {
          type: 'DépôtGarantiesFinancièresEnCoursSupprimé-V1',
        },
        () => this.applyDépôtGarantiesFinancièresEnCoursSuppriméV1(),
      )
      .with(
        {
          type: 'DépôtGarantiesFinancièresEnCoursSupprimé-V2',
        },
        () => this.applyDépôtGarantiesFinancièresEnCoursSuppriméV2(),
      )
      .with(
        {
          type: 'DépôtGarantiesFinancièresSoumis-V1',
        },
        () => this.applyDépôtGarantiesFinancièresSoumisV1(),
      )
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
    // .exhaustive();
  }

  private applyDépôtGarantiesFinancièresEnCoursSuppriméV1() {
    this.#aUnDépôtEnCours = false;
  }

  private applyDépôtGarantiesFinancièresEnCoursSuppriméV2() {
    this.#aUnDépôtEnCours = false;
  }

  private applyDépôtGarantiesFinancièresSoumisV1() {
    this.#aUnDépôtEnCours = true;
  }

  private applyDépôtGarantiesFinancièresEnCoursValidéV1() {
    this.#aDesGarantiesFinancières = true;
    this.#aUnDépôtEnCours = false;
  }

  private applyDépôtGarantiesFinancièresEnCoursValidéV2() {
    this.#aDesGarantiesFinancières = true;
    this.#aUnDépôtEnCours = false;
  }

  private applyGarantiesFinancièresEnregistréesV1() {
    this.#aDesGarantiesFinancières = true;
  }

  private applyGarantiesFinancièresModifiéesV1() {
    this.#aDesGarantiesFinancières = true;
  }

  private applyHistoriqueGarantiesFinancièresEffacéV1() {
    this.#aDesGarantiesFinancières = false;
    this.#aUnDépôtEnCours = false;
  }
}
