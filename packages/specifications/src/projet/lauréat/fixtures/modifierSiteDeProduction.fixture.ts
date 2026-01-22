import { faker } from '@faker-js/faker';

import { Candidature } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../fixture.js';
import { getFakeLocation } from '../../../helpers/getFakeLocation.js';

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
  readonly pièceJustificative: {
    readonly content: string;
    readonly format: string;
  };
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

  #format!: string;
  #content!: string;

  get pièceJustificative(): ModifierSiteDeProduction['pièceJustificative'] {
    return {
      format: this.#format,
      content: this.#content,
    };
  }

  #raison!: string;
  get raison(): string {
    return this.#raison;
  }

  créer(
    partialFixture: Partial<Readonly<ModifierSiteDeProduction>> & { modifiéPar: string },
  ): Readonly<ModifierSiteDeProduction> {
    const content = faker.word.words();

    const fixture = {
      modifiéLe: faker.date.recent().toISOString(),
      localité: {
        adresse1: faker.location.streetAddress(),
        adresse2: faker.location.streetAddress(),
        ...getFakeLocation(),
      },
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content,
      },
      raison: faker.word.words(),
      ...partialFixture,
    };

    this.#localité = fixture.localité;
    this.#modifiéLe = fixture.modifiéLe;
    this.#modifiéPar = fixture.modifiéPar;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;
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
