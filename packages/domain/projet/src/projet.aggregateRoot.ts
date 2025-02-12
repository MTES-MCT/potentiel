import { LoadAggregate } from '@potentiel-domain/core';

import { IdentifiantProjet } from '.';

interface ProjetAggregateRootDependencies {
  loadAggregate: LoadAggregate;
}

class ProjetAggregateRootAlreadyInitialized extends Error {
  constructor() {
    super('ProjetAggregateRoot instance already initialized');
  }
}

export class ProjetAggregateRoot {
  #identifiantProjet: IdentifiantProjet.ValueType;
  #initialized: boolean = false;
  #loadAggregate: LoadAggregate;

  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  private constructor(
    identifiantProjet: IdentifiantProjet.ValueType,
    loadAggregate: LoadAggregate,
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

    // TODO load graph
  }
}
