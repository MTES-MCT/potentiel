import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../../fixture';
import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable';

interface RejeterChangementPuissance {
  readonly réponseSignée: { format: string; content: ReadableStream };
  readonly rejetetéeLe: string;
  readonly rejetetéePar: string;
}

export class RejeterChangementPuissanceFixture
  extends AbstractFixture<RejeterChangementPuissance>
  implements RejeterChangementPuissance
{
  #format!: string;
  #content!: string;

  get réponseSignée(): RejeterChangementPuissance['réponseSignée'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  #rejetetéeLe!: string;
  get rejetetéeLe(): string {
    return this.#rejetetéeLe;
  }

  #rejetetéePar!: string;
  get rejetetéePar(): string {
    return this.#rejetetéePar;
  }

  créer(partialData?: Partial<RejeterChangementPuissance>): Readonly<RejeterChangementPuissance> {
    const content = faker.word.words();

    const fixture = {
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      rejetetéeLe: faker.date.recent().toISOString(),
      rejetetéePar: faker.internet.email(),
      ...partialData,
    };

    this.#rejetetéeLe = fixture.rejetetéeLe;
    this.#rejetetéePar = fixture.rejetetéePar;

    this.aÉtéCréé = true;
    return fixture;
  }
}
