import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';

import {
  GarantiesFinancièresDemandéesEvent,
  GarantiesFinancièresEvent,
  HistoriqueGarantiesFinancièresEffacéEvent,
} from './garantiesFinancières.event';
import { DemanderOptions } from './demander/demanderGarantiesFinancières.options';
import { EffacerHistoriqueOptions } from './effacer/efffacerHistoriqueGarantiesFinancières';

export class GarantiesFinancièresAggregate extends AbstractAggregate<
  GarantiesFinancièresEvent,
  'garanties-financieres',
  LauréatAggregate
> {
  get lauréat() {
    return this.parent;
  }

  get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  #aDesGarantiesFinancières: boolean = false;
  get aDesGarantiesFinancières() {
    return this.#aDesGarantiesFinancières;
  }

  #aUnDépôtEnCours: boolean = false;
  get aUnDépôtEnCours() {
    return this.#aUnDépôtEnCours;
  }

  async demander({ demandéLe, motif }: DemanderOptions) {
    if (this.estSoumisAuxGarantiesFinancières()) {
      const event: GarantiesFinancièresDemandéesEvent = {
        type: 'GarantiesFinancièresDemandées-V1',
        payload: {
          identifiantProjet: this.identifiantProjet.formatter(),
          dateLimiteSoumission: demandéLe.ajouterNombreDeMois(2).formatter(),
          demandéLe: demandéLe.formatter(),
          motif: motif.motif,
        },
      };
      await this.publish(event);
    }
  }

  async effacerHistorique({ effacéLe, effacéPar }: EffacerHistoriqueOptions) {
    if (this.aDesGarantiesFinancières || this.aUnDépôtEnCours) {
      const event: HistoriqueGarantiesFinancièresEffacéEvent = {
        type: 'HistoriqueGarantiesFinancièresEffacé-V1',
        payload: {
          identifiantProjet: this.identifiantProjet.formatter(),
          effacéLe: effacéLe.formatter(),
          effacéPar: effacéPar.formatter(),
        },
      };

      await this.publish(event);
    }
  }

  estSoumisAuxGarantiesFinancières() {
    const { appelOffre, famille } = this.lauréat.projet;
    return (
      famille?.soumisAuxGarantiesFinancieres !== 'non soumis' ||
      appelOffre.soumisAuxGarantiesFinancieres !== 'non soumis'
    );
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
      .with(
        {
          type: 'TypeGarantiesFinancièresImporté-V1',
        },
        () => this.applyTypeGarantiesFinancièresImportéV1(),
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

  private applyTypeGarantiesFinancièresImportéV1() {
    this.#aDesGarantiesFinancières = true;
  }
}
