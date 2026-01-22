import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';

interface ConfirmerAbandon {
  readonly confirméeLe: string;
  readonly confirméePar: string;
}

export class ConfirmerAbandonFixture
  extends AbstractFixture<ConfirmerAbandon>
  implements ConfirmerAbandon
{
  #confirméeLe!: string;

  get confirméeLe(): string {
    return this.#confirméeLe;
  }

  #confirméePar!: string;

  get confirméePar(): string {
    return this.#confirméePar;
  }

  créer(partialData?: Partial<Readonly<ConfirmerAbandon>>): Readonly<ConfirmerAbandon> {
    const fixture: ConfirmerAbandon = {
      confirméeLe: faker.date.soon().toISOString(),
      confirméePar: faker.internet.email(),
      ...partialData,
    };

    this.#confirméeLe = fixture.confirméeLe;
    this.#confirméePar = fixture.confirméePar;

    this.aÉtéCréé = true;
    return fixture;
  }
}
