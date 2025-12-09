import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../../fixture';
import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable';

export interface AccorderChangementPuissance {
  readonly réponseSignée: { format: string; content: ReadableStream };
  readonly accordéeLe: string;
  readonly accordéePar: string;
  readonly estUneDécisionDEtat: boolean;
}

export class AccorderChangementPuissanceFixture
  extends AbstractFixture<AccorderChangementPuissance>
  implements AccorderChangementPuissance
{
  #format!: string;
  #content!: string;

  get réponseSignée(): AccorderChangementPuissance['réponseSignée'] {
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

  #estUneDécisionDEtat!: boolean;
  get estUneDécisionDEtat(): boolean {
    return this.#estUneDécisionDEtat;
  }

  créer(partialData?: Partial<AccorderChangementPuissance>): Readonly<AccorderChangementPuissance> {
    const content = faker.word.words();

    const fixture = {
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      accordéeLe: faker.date.recent().toISOString(),
      accordéePar: faker.internet.email(),
      estUneDécisionDEtat: faker.datatype.boolean(),
      ...partialData,
    };

    this.#accordéeLe = fixture.accordéeLe;
    this.#accordéePar = fixture.accordéePar;
    this.#format = fixture.réponseSignée.format;
    this.#content = content;
    this.#estUneDécisionDEtat = fixture.estUneDécisionDEtat;

    this.aÉtéCréé = true;
    return fixture;
  }
}
