import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../../fixture.js';
import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable.js';

export interface RejeterChangementPuissance {
  readonly réponseSignée: { format: string; content: ReadableStream };
  readonly rejetéeLe: string;
  readonly rejetéePar: string;
  readonly estUneDécisionDEtat: boolean;
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

  #rejetéeLe!: string;
  get rejetéeLe(): string {
    return this.#rejetéeLe;
  }

  #rejetéePar!: string;
  get rejetéePar(): string {
    return this.#rejetéePar;
  }

  #estUneDécisionDEtat!: boolean;
  get estUneDécisionDEtat(): boolean {
    return this.#estUneDécisionDEtat;
  }

  créer(partialData?: Partial<RejeterChangementPuissance>): Readonly<RejeterChangementPuissance> {
    const content = faker.word.words();

    const fixture = {
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      rejetéeLe: faker.date.recent().toISOString(),
      rejetéePar: faker.internet.email(),
      estUneDécisionDEtat: false,
      ...partialData,
    };

    this.#rejetéeLe = fixture.rejetéeLe;
    this.#rejetéePar = fixture.rejetéePar;
    this.#format = fixture.réponseSignée.format;
    this.#content = content;
    this.#estUneDécisionDEtat = fixture.estUneDécisionDEtat;

    this.aÉtéCréé = true;
    return fixture;
  }
}
