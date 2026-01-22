import { faker } from '@faker-js/faker';

import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable.js';
import { AbstractFixture } from '../../../../fixture.js';

interface AccorderChangementActionnaire {
  readonly réponseSignée: { format: string; content: ReadableStream };
  readonly accordéeLe: string;
  readonly accordéePar: string;
}

export class AccorderChangementActionnaireFixture
  extends AbstractFixture<AccorderChangementActionnaire>
  implements AccorderChangementActionnaire
{
  #format!: string;
  #content!: string;

  get réponseSignée(): AccorderChangementActionnaire['réponseSignée'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  #accordéeLe!: string;

  get accordéeLe(): string {
    return this.#accordéeLe;
  }

  #accordéePar!: string;

  get accordéePar(): string {
    return this.#accordéePar;
  }

  créer(partialFixture?: Partial<AccorderChangementActionnaire>): AccorderChangementActionnaire {
    const content = faker.word.words();

    const fixture: AccorderChangementActionnaire = {
      accordéeLe: faker.date.soon().toISOString(),
      accordéePar: faker.internet.email(),
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ...partialFixture,
    };

    this.#accordéeLe = fixture.accordéeLe;
    this.#accordéePar = fixture.accordéePar;
    this.#format = fixture.réponseSignée.format;
    this.#content = content;

    this.aÉtéCréé = true;
    return fixture;
  }
}
