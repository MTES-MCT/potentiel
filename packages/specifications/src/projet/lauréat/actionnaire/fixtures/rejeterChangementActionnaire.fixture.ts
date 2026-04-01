import { faker } from '@faker-js/faker';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';

interface RejeterChangementActionnaire {
  readonly réponseSignée: PièceJustificative;
  readonly rejetéeLe: string;
  readonly rejetéePar: string;
}

export class RejeterChangementActionnaireFixture
  extends AbstractFixture<RejeterChangementActionnaire>
  implements RejeterChangementActionnaire
{
  #réponseSignée!: PièceJustificative;

  get réponseSignée(): PièceJustificative {
    return this.#réponseSignée;
  }

  #rejetéeLe!: string;

  get rejetéeLe(): string {
    return this.#rejetéeLe;
  }

  #rejetéePar!: string;

  get rejetéePar(): string {
    return this.#rejetéePar;
  }

  créer(partialFixture?: Partial<RejeterChangementActionnaire>): RejeterChangementActionnaire {
    const fixture: RejeterChangementActionnaire = {
      rejetéeLe: faker.date.soon().toISOString(),
      rejetéePar: faker.internet.email(),
      réponseSignée: faker.potentiel.document(),
      ...partialFixture,
    };

    this.#rejetéeLe = fixture.rejetéeLe;
    this.#rejetéePar = fixture.rejetéePar;
    this.#réponseSignée = fixture.réponseSignée;

    this.aÉtéCréé = true;
    return fixture;
  }
}
