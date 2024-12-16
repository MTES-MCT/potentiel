import { faker } from '@faker-js/faker';

import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';
import { AbstractFixture } from '../../../../fixture';

interface AccorderChangementActionnaire {
  readonly réponseSignée: { format: string; content: ReadableStream };
  readonly accordéLe: string;
  readonly accordéPar: string;
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

  #accordéLe!: string;

  get accordéLe(): string {
    return this.#accordéLe;
  }

  #accordéPar!: string;

  get accordéPar(): string {
    return this.#accordéPar;
  }

  créer(partialFixture?: Partial<AccorderChangementActionnaire>): AccorderChangementActionnaire {
    const content = faker.word.words();

    const fixture: AccorderChangementActionnaire = {
      accordéLe: faker.date.soon().toISOString(),
      accordéPar: faker.internet.email(),
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ...partialFixture,
    };

    this.#accordéLe = fixture.accordéLe;
    this.#accordéPar = fixture.accordéPar;
    this.#format = fixture.réponseSignée.format;
    this.#content = content;

    this.aÉtéCréé = true;
    return fixture;
  }
}
