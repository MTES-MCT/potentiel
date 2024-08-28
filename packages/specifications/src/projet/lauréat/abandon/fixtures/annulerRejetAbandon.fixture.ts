import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface AnnulerRejetAbandon {
  readonly annuléeLe: string;
  readonly annuléePar: string;
}

export class AnnulerRejetAbandonFixture
  extends AbstractFixture<AnnulerRejetAbandon>
  implements AnnulerRejetAbandon
{
  #annuléeLe!: string;

  get annuléeLe(): string {
    return this.#annuléeLe;
  }

  #annuléePar!: string;

  get annuléePar(): string {
    return this.#annuléePar;
  }

  créer(partialFixture?: Partial<Readonly<AnnulerRejetAbandon>>): Readonly<AnnulerRejetAbandon> {
    const fixture: AnnulerRejetAbandon = {
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
