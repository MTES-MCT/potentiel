import { faker } from '@faker-js/faker';

import { Fixture } from '../../../../fixture';

interface AccorderAbandon {
  réponseSignée: { format: string; content: ReadableStream };
  accordéeLe: string;
  accordéePar: string;
}

export class AccorderAbandonFixture implements AccorderAbandon, Fixture<AccorderAbandon> {
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  #réponseSignée!: AccorderAbandonFixture['réponseSignée'];

  get réponseSignée(): AccorderAbandon['réponseSignée'] {
    return this.#réponseSignée;
  }

  set réponseSignée(value: AccorderAbandonFixture['réponseSignée']) {
    this.#réponseSignée = value;
  }

  #accordéLe!: string;

  get accordéeLe(): string {
    return this.#accordéLe;
  }

  set accordéeLe(value: string) {
    this.#accordéLe = value;
  }

  #accordéPar!: string;

  get accordéePar(): string {
    return this.#accordéPar;
  }

  set accordéePar(value: string) {
    this.#accordéPar = value;
  }

  créer(partialFixture?: Partial<Readonly<AccorderAbandon>>): Readonly<AccorderAbandon> {
    const fixture: AccorderAbandon = {
      accordéeLe: faker.date.soon().toISOString(),
      accordéePar: faker.internet.email(),
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content: faker.potentiel.fileContent(),
      },
      ...partialFixture,
    };

    this.#accordéLe = fixture.accordéeLe;
    this.#accordéPar = fixture.accordéePar;
    this.#réponseSignée = fixture.réponseSignée;

    this.#aÉtéCréé = true;
    return fixture;
  }
}
