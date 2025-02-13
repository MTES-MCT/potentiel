import { AggregateType, LoadAggregateV2 } from '@potentiel-domain/core';

import { IdentifiantProjet } from '.';

import { ÉliminéAggregate } from './éliminé/éliminé.aggregate';

interface ProjetAggregateRootDependencies {
  loadAggregate: LoadAggregateV2;
}

class ProjetAggregateRootAlreadyInitialized extends Error {
  constructor() {
    super('ProjetAggregateRoot instance already initialized');
  }
}

export class ProjetAggregateRoot {
  #initialized: boolean = false;
  #loadAggregate: LoadAggregateV2;

  #identifiantProjet: IdentifiantProjet.ValueType;

  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  #éliminé!: AggregateType<ÉliminéAggregate>;

  get éliminé() {
    return this.#éliminé;
  }

  private constructor(
    identifiantProjet: IdentifiantProjet.ValueType,
    loadAggregate: LoadAggregateV2,
  ) {
    this.#identifiantProjet = identifiantProjet;
    this.#loadAggregate = loadAggregate;
  }

  static async get(
    identifiantProjet: IdentifiantProjet.ValueType,
    { loadAggregate }: ProjetAggregateRootDependencies,
  ) {
    const root = new ProjetAggregateRoot(identifiantProjet, loadAggregate);
    return root.init();
  }

  private async init() {
    if (this.#initialized) {
      throw new ProjetAggregateRootAlreadyInitialized();
    }

    this.#éliminé = await this.#loadAggregate(
      `éliminé|${this.identifiantProjet.formatter()}`,
      ÉliminéAggregate,
    );
    await this.#éliminé.init(this, this.#loadAggregate);

    this.#initialized = true;
  }
}
