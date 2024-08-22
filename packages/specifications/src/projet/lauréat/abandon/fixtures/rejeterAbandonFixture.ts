import { faker } from '@faker-js/faker';

import { Fixture } from '../../../../fixture';

interface RejetAbandon {
  réponseSignée: { format: string; content: ReadableStream };
  rejetéeLe: string;
  rejetéePar: string;
}

export class RejetAbandonFixture implements RejetAbandon, Fixture<RejetAbandon> {
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  #réponseSignée!: RejetAbandon['réponseSignée'];

  get réponseSignée(): RejetAbandon['réponseSignée'] {
    return this.#réponseSignée;
  }

  set réponseSignée(value: RejetAbandon['réponseSignée']) {
    this.#réponseSignée = value;
  }

  #rejetéeLe!: string;

  get rejetéeLe(): string {
    return this.#rejetéeLe;
  }

  set rejetéeLe(value: string) {
    this.#rejetéeLe = value;
  }

  #rejetéePar!: string;

  get rejetéePar(): string {
    return this.#rejetéePar;
  }

  set rejetéePar(value: string) {
    this.#rejetéePar = value;
  }

  créer(partialData?: Partial<Readonly<RejetAbandon>> | undefined): Readonly<RejetAbandon> {
    const fixture: RejetAbandon = {
      rejetéeLe: faker.date.soon().toISOString(),
      rejetéePar: faker.internet.email(),
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content: faker.potentiel.fileContent(),
      },
      ...partialData,
    };

    this.#rejetéeLe = fixture.rejetéeLe;
    this.#rejetéePar = fixture.rejetéePar;
    this.#réponseSignée = fixture.réponseSignée;

    this.#aÉtéCréé = true;
    return fixture;
  }
}
