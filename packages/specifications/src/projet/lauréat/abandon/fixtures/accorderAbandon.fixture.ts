import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';

interface AccorderAbandon {
  readonly réponseSignée: { format: string; content: string };
  readonly accordéLe: string;
  readonly accordéePar: string;
}

export class AccorderAbandonFixture
  extends AbstractFixture<AccorderAbandon>
  implements AccorderAbandon
{
  #format!: string;
  #content!: string;

  get réponseSignée(): AccorderAbandon['réponseSignée'] {
    return {
      format: this.#format,
      content: this.#content,
    };
  }

  #accordéLe!: string;

  get accordéLe(): string {
    return this.#accordéLe;
  }

  #accordéPar!: string;

  get accordéePar(): string {
    return this.#accordéPar;
  }

  créer(partialFixture?: Partial<AccorderAbandon>): AccorderAbandon {
    const content = faker.word.words();

    const fixture: AccorderAbandon = {
      accordéLe: faker.date.soon().toISOString(),
      accordéePar: faker.internet.email(),
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content,
      },
      ...partialFixture,
    };

    this.#accordéLe = fixture.accordéLe;
    this.#accordéPar = fixture.accordéePar;
    this.#format = fixture.réponseSignée.format;
    this.#content = content;

    this.aÉtéCréé = true;
    return fixture;
  }
}
