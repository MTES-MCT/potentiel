import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';

interface AnnulerAbandon {
  readonly annuléeLe: string;
  readonly annuléePar: string;
}

export class AnnulerAbandonFixture
  extends AbstractFixture<AnnulerAbandon>
  implements AnnulerAbandon
{
  #annuléeLe!: string;

  get annuléeLe(): string {
    return this.#annuléeLe;
  }

  #annuléePar!: string;

  get annuléePar(): string {
    return this.#annuléePar;
  }

  créer(partialFixture?: Partial<Readonly<AnnulerAbandon>>): Readonly<AnnulerAbandon> {
    const fixture: AnnulerAbandon = {
      annuléeLe: faker.date.soon().toISOString(),
      annuléePar: faker.internet.email(),
      ...partialFixture,
    };

    this.#annuléeLe = fixture.annuléeLe;
    this.#annuléePar = fixture.annuléePar;

    this.aÉtéCréé = true;
    return fixture;
  }
}
