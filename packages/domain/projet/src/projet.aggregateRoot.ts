import { LoadAggregate } from '@potentiel-domain/core';

import { IdentifiantProjet, StatutProjet } from '.';

import {
  LauréatAggregate,
  LauréatEvent,
  LauréatAggregateId,
  getDefaultLauréatAggregate,
} from './lauréat/lauréat.aggregate';
import {
  getDefaultÉliminéAggregate,
  ÉliminéAggregate,
  ÉliminéAggregateId,
  ÉliminéEvent,
} from './éliminé/éliminé.aggregate';

export interface ProjetAggregateRoot {
  readonly identifiant: IdentifiantProjet.ValueType;
  readonly statut: StatutProjet.ValueType;
  readonly lauréat: LauréatAggregate;
  readonly éliminé: ÉliminéAggregate;
}

class ProjetAggregateImpl implements ProjetAggregateRoot {
  #lauréat!: LauréatAggregate;
  #éliminé!: ÉliminéAggregate;

  get lauréat() {
    return this.#lauréat;
  }

  get éliminé() {
    return this.#éliminé;
  }

  get statut() {
    if (this.#éliminé.exists && this.#éliminé.estArchivé) {
      return StatutProjet.éliminé;
    }

    if (this.lauréat.exists) {
      return StatutProjet.classé;
    }

    return StatutProjet.nonNotifié;
  }

  constructor(
    public readonly identifiant: IdentifiantProjet.ValueType,
    private readonly loadAggregate: LoadAggregate,
  ) {}

  async init() {
    await this.initLauréat();
    await this.initÉliminé();
  }

  private async initLauréat() {
    const lauréatAggregateId: LauréatAggregateId = `lauréat|${this.identifiant.formatter()}`;
    this.#lauréat = await this.loadAggregate<LauréatAggregate, LauréatEvent>({
      aggregateId: lauréatAggregateId,
      getDefaultAggregate: getDefaultLauréatAggregate(this),
    });

    return this.#lauréat.init();
  }

  private async initÉliminé() {
    const éliminéAggregateId: ÉliminéAggregateId = `éliminé|${this.identifiant.formatter()}`;
    this.#éliminé = await this.loadAggregate<ÉliminéAggregate, ÉliminéEvent>({
      aggregateId: éliminéAggregateId,
      getDefaultAggregate: getDefaultÉliminéAggregate(this, this.loadAggregate),
    });

    return this.#éliminé.init();
  }
}

export const get = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  loadAggregate: LoadAggregate,
) => {
  const projet = new ProjetAggregateImpl(identifiantProjet, loadAggregate);
  await projet.init();
  return projet;
};
