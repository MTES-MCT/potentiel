import { faker } from '@faker-js/faker';

import { Fixture } from '../../../../fixture';

interface AnnulerAbandon {
  annuléeLe: string;
  annuléePar: string;
}

export class AnnulerAbandonFixture implements AnnulerAbandon, Fixture<AnnulerAbandon> {
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  #annuléeLe!: string;

  get annuléeLe(): string {
    return this.#annuléeLe;
  }

  set annuléeLe(value: string) {
    this.#annuléeLe = value;
  }

  #annuléePar!: string;

  get annuléePar(): string {
    return this.#annuléePar;
  }

  set annuléePar(value: string) {
    this.#annuléePar = value;
  }

  créer(partialFixture?: Partial<Readonly<AnnulerAbandon>>): Readonly<AnnulerAbandon> {
    const fixture: AnnulerAbandon = {
      annuléeLe: faker.date.soon().toISOString(),
      annuléePar: faker.internet.email(),
      ...partialFixture,
    };

    this.#annuléeLe = fixture.annuléeLe;
    this.#annuléePar = fixture.annuléePar;

    this.#aÉtéCréé = true;
    return fixture;
  }
}
