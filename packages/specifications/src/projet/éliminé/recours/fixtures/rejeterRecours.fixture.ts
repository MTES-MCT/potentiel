import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable.js';

interface RejeterRecours {
  readonly réponseSignée: { format: string; content: ReadableStream };
  readonly rejetéLe: string;
  readonly rejetéPar: string;
}

export class RejeterRecoursFixture
  extends AbstractFixture<RejeterRecours>
  implements RejeterRecours
{
  #format!: string;
  #content!: string;

  get réponseSignée(): RejeterRecours['réponseSignée'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  #rejetéLe!: string;

  get rejetéLe(): string {
    return this.#rejetéLe;
  }

  #rejetéPar!: string;

  get rejetéPar(): string {
    return this.#rejetéPar;
  }

  créer(partialData?: Partial<RejeterRecours>): Readonly<RejeterRecours> {
    const content = faker.word.words();

    const fixture: RejeterRecours = {
      rejetéLe: faker.date.soon().toISOString(),
      rejetéPar: faker.internet.email(),
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ...partialData,
    };

    this.#rejetéLe = fixture.rejetéLe;
    this.#rejetéPar = fixture.rejetéPar;
    this.#format = fixture.réponseSignée.format;
    this.#content = content;

    this.aÉtéCréé = true;
    return fixture;
  }
}
