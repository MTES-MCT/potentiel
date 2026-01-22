import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';

interface AnnulerDemandeDélai {
  readonly annuléeLe: string;
  readonly annuléePar: string;
}

export class AnnulerDemandeDélaiFixture
  extends AbstractFixture<AnnulerDemandeDélai>
  implements AnnulerDemandeDélai
{
  #annuléeLe!: string;

  get annuléeLe(): string {
    return this.#annuléeLe;
  }

  #annuléePar!: string;

  get annuléePar(): string {
    return this.#annuléePar;
  }

  créer(partialData?: Partial<AnnulerDemandeDélai>): Readonly<AnnulerDemandeDélai> {
    const fixture = {
      annuléeLe: faker.date.recent().toISOString(),
      annuléePar: faker.internet.email(),
      ...partialData,
    };

    this.#annuléeLe = fixture.annuléeLe;
    this.#annuléePar = fixture.annuléePar;

    this.aÉtéCréé = true;
    return fixture;
  }
}
