import { faker } from '@faker-js/faker';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';

interface RejeterDemandeDélai {
  readonly réponseSignée: PièceJustificative;
  readonly rejetéeLe: string;
  readonly rejetéePar: string;
}

export class RejeterDemandeDélaiFixture
  extends AbstractFixture<RejeterDemandeDélai>
  implements RejeterDemandeDélai
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

  créer(partialData?: Partial<RejeterDemandeDélai>): Readonly<RejeterDemandeDélai> {
    const fixture = {
      rejetéeLe: faker.date.recent().toISOString(),
      rejetéePar: faker.internet.email(),
      réponseSignée: faker.potentiel.document(),
      ...partialData,
    };

    this.#rejetéeLe = fixture.rejetéeLe;
    this.#rejetéePar = fixture.rejetéePar;
    this.#réponseSignée = fixture.réponseSignée;

    this.aÉtéCréé = true;

    return fixture;
  }
}
