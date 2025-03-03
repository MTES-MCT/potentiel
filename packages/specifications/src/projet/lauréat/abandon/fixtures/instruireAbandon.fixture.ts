import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface InstruireAbandon {
  readonly instruitLe: string;
  readonly instruitPar: string;
}

export class InstruireAbandonFixture
  extends AbstractFixture<InstruireAbandon>
  implements InstruireAbandon
{
  #instruitLe!: string;

  get instruitLe(): string {
    return this.#instruitLe;
  }

  #instruitPar!: string;

  get instruitPar(): string {
    return this.#instruitPar;
  }

  créer(partialData?: Partial<Readonly<InstruireAbandon>>): Readonly<InstruireAbandon> {
    const fixture: InstruireAbandon = {
      instruitLe: faker.date.soon().toISOString(),
      instruitPar: faker.internet.email(),
      ...partialData,
    };

    this.#instruitLe = fixture.instruitLe;
    this.#instruitPar = fixture.instruitPar;

    this.aÉtéCréé = true;
    return fixture;
  }
}
