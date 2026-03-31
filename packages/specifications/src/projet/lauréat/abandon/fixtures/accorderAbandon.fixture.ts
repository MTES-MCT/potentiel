import { faker } from '@faker-js/faker';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';

interface AccorderAbandon {
  readonly réponseSignée: PièceJustificative;
  readonly accordéLe: string;
  readonly accordéePar: string;
}

export class AccorderAbandonFixture
  extends AbstractFixture<AccorderAbandon>
  implements AccorderAbandon
{
  #réponseSignée!: PièceJustificative;

  get réponseSignée(): PièceJustificative {
    return this.#réponseSignée;
  }

  #accordéLe!: string;

  get accordéLe(): string {
    return this.#accordéLe;
  }

  #accordéPar!: string;

  get accordéePar(): string {
    return this.#accordéPar;
  }

  créer(partialFixture?: Partial<AccorderAbandon>): AccorderAbandon {
    const fixture: AccorderAbandon = {
      accordéLe: faker.date.soon().toISOString(),
      accordéePar: faker.internet.email(),
      réponseSignée: faker.potentiel.document(),
      ...partialFixture,
    };

    this.#accordéLe = fixture.accordéLe;
    this.#accordéPar = fixture.accordéePar;
    this.#réponseSignée = fixture.réponseSignée;

    this.aÉtéCréé = true;
    return fixture;
  }
}
