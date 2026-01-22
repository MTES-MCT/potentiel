import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable.js';

interface RejeterChangementActionnaire {
  readonly réponseSignée: { format: string; content: ReadableStream };
  readonly rejetéeLe: string;
  readonly rejetéePar: string;
}

export class RejeterChangementActionnaireFixture
  extends AbstractFixture<RejeterChangementActionnaire>
  implements RejeterChangementActionnaire
{
  #format!: string;
  #content!: string;

  get réponseSignée(): RejeterChangementActionnaire['réponseSignée'] {
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

  créer(partialFixture?: Partial<RejeterChangementActionnaire>): RejeterChangementActionnaire {
    const content = faker.word.words();

    const fixture: RejeterChangementActionnaire = {
      rejetéeLe: faker.date.soon().toISOString(),
      rejetéePar: faker.internet.email(),
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ...partialFixture,
    };

    this.#rejetéeLe = fixture.rejetéeLe;
    this.#rejetéePar = fixture.rejetéePar;
    this.#format = fixture.réponseSignée.format;
    this.#content = content;

    this.aÉtéCréé = true;
    return fixture;
  }
}
