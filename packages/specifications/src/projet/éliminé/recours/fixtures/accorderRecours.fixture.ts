import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable.js';

interface AccorderRecours {
  readonly réponseSignée: { format: string; content: ReadableStream };
  readonly accordéLe: string;
  readonly accordéPar: string;
}

export class AccorderRecoursFixture
  extends AbstractFixture<AccorderRecours>
  implements AccorderRecours
{
  #format!: string;
  #content!: string;

  get réponseSignée(): AccorderRecours['réponseSignée'] {
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

  créer(partialData?: Partial<AccorderRecours>): Readonly<AccorderRecours> {
    const content = faker.word.words();

    const fixture: AccorderRecours = {
      accordéLe: faker.date.soon().toISOString(),
      accordéPar: faker.internet.email(),
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ...partialData,
    };

    this.#accordéLe = fixture.accordéLe;
    this.#accordéPar = fixture.accordéPar;
    this.#format = fixture.réponseSignée.format;
    this.#content = content;

    this.aÉtéCréé = true;
    return fixture;
  }
}
