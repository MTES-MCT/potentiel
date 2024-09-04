import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

interface RejeterRecours {
  readonly réponseSignée: { format: string; content: ReadableStream };
  readonly rejetéeLe: string;
  readonly rejetéePar: string;
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

  #rejetéeLe!: string;

  get rejetéeLe(): string {
    return this.#rejetéeLe;
  }

  #rejetéePar!: string;

  get rejetéePar(): string {
    return this.#rejetéePar;
  }

  créer(partialData?: RejeterRecours | undefined): Readonly<RejeterRecours> {
    const content = faker.word.words();

    const fixture: RejeterRecours = {
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
