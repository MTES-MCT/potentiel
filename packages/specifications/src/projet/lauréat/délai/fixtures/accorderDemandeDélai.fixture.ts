import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable.js';

interface AccorderDemandeDélai {
  readonly réponseSignée: { format: string; content: ReadableStream };
  readonly accordéeLe: string;
  readonly accordéePar: string;
  readonly nombreDeMois: number;
  readonly dateAchèvementPrévisionnelActuelle: string;
}

export class AccorderDemandeDélaiFixture
  extends AbstractFixture<AccorderDemandeDélai>
  implements AccorderDemandeDélai
{
  #format!: string;
  #content!: string;

  get réponseSignée(): AccorderDemandeDélai['réponseSignée'] {
    return { format: this.#format, content: convertStringToReadableStream(this.#content) };
  }

  #accordéeLe!: string;

  get accordéeLe(): string {
    return this.#accordéeLe;
  }

  #accordéePar!: string;

  get accordéePar(): string {
    return this.#accordéePar;
  }

  #nombreDeMois!: number;

  get nombreDeMois(): number {
    return this.#nombreDeMois;
  }

  #dateAchèvementPrévisionnelActuelle!: string;

  get dateAchèvementPrévisionnelActuelle(): string {
    return this.#dateAchèvementPrévisionnelActuelle;
  }

  créer(partialData?: Partial<AccorderDemandeDélai>): Readonly<AccorderDemandeDélai> {
    const content = faker.word.words();

    const fixture = {
      accordéeLe: faker.date.recent().toISOString(),
      accordéePar: faker.internet.email(),
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      nombreDeMois: faker.number.int({ min: 1, max: 100 }),
      dateAchèvementPrévisionnelActuelle: faker.date.recent().toISOString(),
      ...partialData,
    };

    this.#accordéeLe = fixture.accordéeLe;
    this.#accordéePar = fixture.accordéePar;
    this.#format = fixture.réponseSignée.format;
    this.#nombreDeMois = fixture.nombreDeMois;
    this.#dateAchèvementPrévisionnelActuelle = fixture.dateAchèvementPrévisionnelActuelle;
    this.#content = content;

    this.aÉtéCréé = true;

    return fixture;
  }
}
