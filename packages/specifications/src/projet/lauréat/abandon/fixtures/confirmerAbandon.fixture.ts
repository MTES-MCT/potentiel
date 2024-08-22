import { faker } from '@faker-js/faker';

import { Fixture } from '../../../../fixture';

interface ConfirmerAbandon {
  confirméeLe: string;
  confirméePar: string;
}

export class ConfirmerAbandonFixture implements ConfirmerAbandon, Fixture<ConfirmerAbandon> {
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  #confirméeLe!: string;

  get confirméeLe(): string {
    return this.#confirméeLe;
  }

  set confirméeLe(value: string) {
    this.#confirméeLe = value;
  }

  #confirméePar!: string;

  get confirméePar(): string {
    return this.#confirméePar;
  }

  set confirméePar(value: string) {
    this.#confirméePar = value;
  }

  créer(partialData?: Partial<Readonly<ConfirmerAbandon>>): Readonly<ConfirmerAbandon> {
    const fixture: ConfirmerAbandon = {
      confirméeLe: faker.date.soon().toISOString(),
      confirméePar: faker.internet.email(),
      ...partialData,
    };

    this.#confirméeLe = fixture.confirméeLe;
    this.#confirméePar = fixture.confirméePar;

    this.#aÉtéCréé = true;
    return fixture;
  }
}
