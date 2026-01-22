import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable.js';

interface RejetAbandon {
  readonly réponseSignée: { format: string; content: ReadableStream };
  readonly rejetéeLe: string;
  readonly rejetéePar: string;
}

export class RejetAbandonFixture extends AbstractFixture<RejetAbandon> implements RejetAbandon {
  #format!: string;
  #content!: string;

  get réponseSignée(): RejetAbandon['réponseSignée'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  #rejetéeLe!: string;

  get rejetéeLe(): string {
    return this.#rejetéeLe;
  }

  #rejetéePar!: string;

  get rejetéePar(): string {
    return this.#rejetéePar;
  }

  créer(partialData?: Partial<Readonly<RejetAbandon>> | undefined): Readonly<RejetAbandon> {
    const content = faker.word.words();

    const fixture: RejetAbandon = {
      rejetéeLe: faker.date.soon().toISOString(),
      rejetéePar: faker.internet.email(),
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ...partialData,
    };

    this.#rejetéeLe = fixture.rejetéeLe;
    this.#rejetéePar = fixture.rejetéePar;
    this.#format = fixture.réponseSignée.format;
    this.#content = content;

    this.aÉtéCréé = true;
    return fixture;
  }
}
