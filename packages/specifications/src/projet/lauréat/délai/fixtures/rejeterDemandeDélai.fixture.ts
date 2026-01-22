import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable.js';

interface RejeterDemandeDélai {
  readonly réponseSignée: { format: string; content: ReadableStream };
  readonly rejetéeLe: string;
  readonly rejetéePar: string;
}

export class RejeterDemandeDélaiFixture
  extends AbstractFixture<RejeterDemandeDélai>
  implements RejeterDemandeDélai
{
  #format!: string;
  #content!: string;

  get réponseSignée(): RejeterDemandeDélai['réponseSignée'] {
    return { format: this.#format, content: convertStringToReadableStream(this.#content) };
  }

  #rejetéeLe!: string;

  get rejetéeLe(): string {
    return this.#rejetéeLe;
  }

  #rejetéePar!: string;

  get rejetéePar(): string {
    return this.#rejetéePar;
  }

  créer(partialData?: Partial<RejeterDemandeDélai>): Readonly<RejeterDemandeDélai> {
    const content = faker.word.words();

    const fixture = {
      rejetéeLe: faker.date.recent().toISOString(),
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
