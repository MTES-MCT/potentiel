import { AggregateType, LoadAggregateV2 } from '@potentiel-domain/core';
import { AppelOffreAggregate, LoadAppelOffreAggregatePort } from '@potentiel-domain/appel-offre';

import { IdentifiantProjet } from '.';

import { ÉliminéAggregate } from './éliminé/éliminé.aggregate';

interface ProjetAggregateRootDependencies {
  loadAggregate: LoadAggregateV2;
  loadAppelOffreAggregate: LoadAppelOffreAggregatePort;
}

class ProjetAggregateRootAlreadyInitialized extends Error {
  constructor() {
    super('ProjetAggregateRoot instance already initialized');
  }
}

export class ProjetAggregateRoot {
  #initialized: boolean = false;
  #loadAggregate: LoadAggregateV2;
  #loadAppelOffreAggregate: LoadAppelOffreAggregatePort;

  #identifiantProjet: IdentifiantProjet.ValueType;

  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  #éliminé!: AggregateType<ÉliminéAggregate>;

  get éliminé() {
    return this.#éliminé;
  }

  #appelOffre!: AppelOffreAggregate;

  get appelOffre() {
    return this.#appelOffre;
  }

  private constructor(
    identifiantProjet: IdentifiantProjet.ValueType,
    loadAggregate: LoadAggregateV2,
    loadAppelOffreAggregate: LoadAppelOffreAggregatePort,
  ) {
    this.#identifiantProjet = identifiantProjet;
    this.#loadAggregate = loadAggregate;
    this.#loadAppelOffreAggregate = loadAppelOffreAggregate;
  }

  static async get(
    identifiantProjet: IdentifiantProjet.ValueType,
    { loadAggregate, loadAppelOffreAggregate }: ProjetAggregateRootDependencies,
  ) {
    const root = new ProjetAggregateRoot(identifiantProjet, loadAggregate, loadAppelOffreAggregate);
    await root.init();
    return root;
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

    this.#appelOffre = await this.#loadAppelOffreAggregate(this.#identifiantProjet.appelOffre);

    this.#initialized = true;
  }
}
