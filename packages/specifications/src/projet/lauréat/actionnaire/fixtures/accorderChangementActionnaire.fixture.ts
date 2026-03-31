import { faker } from '@faker-js/faker';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';

interface AccorderChangementActionnaire {
  readonly réponseSignée: PièceJustificative;
  readonly accordéeLe: string;
  readonly accordéePar: string;
}

export class AccorderChangementActionnaireFixture
  extends AbstractFixture<AccorderChangementActionnaire>
  implements AccorderChangementActionnaire
{
  #réponseSignée!: PièceJustificative;

  get réponseSignée(): PièceJustificative {
    return this.#réponseSignée;
  }

  #accordéeLe!: string;

  get accordéeLe(): string {
    return this.#accordéeLe;
  }

  #accordéePar!: string;

  get accordéePar(): string {
    return this.#accordéePar;
  }

  créer(partialFixture?: Partial<AccorderChangementActionnaire>): AccorderChangementActionnaire {
    const fixture: AccorderChangementActionnaire = {
      accordéeLe: faker.date.soon().toISOString(),
      accordéePar: faker.internet.email(),
      réponseSignée: faker.potentiel.document(),
      ...partialFixture,
    };

    this.#accordéeLe = fixture.accordéeLe;
    this.#accordéePar = fixture.accordéePar;
    this.#réponseSignée = fixture.réponseSignée;

    this.aÉtéCréé = true;
    return fixture;
  }
}
