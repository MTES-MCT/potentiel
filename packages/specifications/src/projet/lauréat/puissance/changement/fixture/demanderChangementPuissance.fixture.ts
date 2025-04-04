import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../../fixture';
import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable';

interface DemanderChangementPuissance {
  readonly pièceJustificative: { format: string; content: ReadableStream };
  readonly demandéLe: string;
  readonly demandéPar: string;
  readonly raison: string;
  readonly ratio: number;
}

export class DemanderChangementPuissanceFixture
  extends AbstractFixture<DemanderChangementPuissance>
  implements DemanderChangementPuissance
{
  #format!: string;
  #content!: string;

  get pièceJustificative(): DemanderChangementPuissance['pièceJustificative'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  #demandéLe!: string;

  get demandéLe(): string {
    return this.#demandéLe;
  }

  #demandéPar!: string;

  get demandéPar(): string {
    return this.#demandéPar;
  }

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  #ratio!: number;

  get ratio(): number {
    return this.#ratio;
  }

  #puissanceActuelle!: number;
  get puissanceActuelle(): number {
    return this.#puissanceActuelle;
  }

  créer(
    partialData?: Omit<Partial<DemanderChangementPuissance>, 'puissanceActuelle'>,
  ): Readonly<DemanderChangementPuissance> {
    const content = faker.word.words();

    const fixture = {
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      raison: faker.company.catchPhrase(),
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ratio: faker.number.float({ min: 0.5, max: 0.8, multipleOf: 0.01 }),
      ...partialData,
    };

    this.#demandéLe = fixture.demandéLe;
    this.#demandéPar = fixture.demandéPar;
    this.#raison = fixture.raison;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;
    this.#ratio = fixture.ratio;

    this.aÉtéCréé = true;

    return fixture;
  }
}
