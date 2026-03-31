import { faker } from '@faker-js/faker';

import { Candidature } from '@potentiel-domain/projet';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../fixture.js';

export interface ModifierSiteDeProduction {
  readonly modifiéLe: string;
  readonly modifiéPar: string;
  readonly localité: {
    adresse1: string;
    adresse2: string;
    codePostal: string;
    commune: string;
    département: string;
    région: string;
  };
  readonly raison: string;
  readonly pièceJustificative: PièceJustificative;
}

export class ModifierSiteDeProductionFixture
  extends AbstractFixture<ModifierSiteDeProduction>
  implements ModifierSiteDeProduction
{
  #modifiéLe!: string;

  get modifiéLe(): string {
    return this.#modifiéLe;
  }
  #modifiéPar!: string;

  get modifiéPar(): string {
    return this.#modifiéPar;
  }

  #localité!: ModifierSiteDeProduction['localité'];

  get localité(): ModifierSiteDeProduction['localité'] {
    return this.#localité;
  }

  #pièceJustificative!: PièceJustificative;

  get pièceJustificative(): ModifierSiteDeProduction['pièceJustificative'] {
    return this.#pièceJustificative;
  }

  #raison!: string;
  get raison(): string {
    return this.#raison;
  }

  créer(
    partialFixture: Partial<Readonly<ModifierSiteDeProduction>> & { modifiéPar: string },
  ): Readonly<ModifierSiteDeProduction> {
    const fixture = {
      modifiéLe: faker.date.recent().toISOString(),
      localité: {
        adresse1: faker.location.streetAddress(),
        adresse2: faker.location.streetAddress(),
        ...faker.potentiel.location(),
      },
      pièceJustificative: faker.potentiel.document(),
      raison: faker.word.words(),
      ...partialFixture,
    };

    this.#localité = fixture.localité;
    this.#modifiéLe = fixture.modifiéLe;
    this.#modifiéPar = fixture.modifiéPar;
    this.#pièceJustificative = fixture.pièceJustificative;
    this.#raison = fixture.raison;

    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected() {
    if (!this.aÉtéCréé) {
      return {};
    }
    return {
      localité: Candidature.Localité.bind(this.localité),
    };
  }
}
