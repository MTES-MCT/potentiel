import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable.js';

type PièceJustificative = { format: string; content: ReadableStream };

interface CorrigerDemandeDélai {
  readonly corrigéeLe: string;
  readonly corrigéePar: string;
  readonly nombreDeMois: number;
  readonly raison: string;
  readonly pièceJustificative?: PièceJustificative;
}

export class CorrigerDemandeDélaiFixture
  extends AbstractFixture<CorrigerDemandeDélai>
  implements CorrigerDemandeDélai
{
  #format?: string;
  #content?: string;

  get pièceJustificative(): PièceJustificative | undefined {
    return this.#format && this.#content
      ? {
          format: this.#format,
          content: convertStringToReadableStream(this.#content),
        }
      : undefined;
  }

  #corrigéeLe!: string;

  get corrigéeLe(): string {
    return this.#corrigéeLe;
  }

  #corrigéePar!: string;

  get corrigéePar(): string {
    return this.#corrigéePar;
  }

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  #nombreDeMois!: number;

  get nombreDeMois(): number {
    return this.#nombreDeMois;
  }

  créer(partialFixture: Partial<Readonly<CorrigerDemandeDélai>>): Readonly<CorrigerDemandeDélai> {
    const content = faker.word.words();

    const fixture = {
      corrigéeLe: faker.date.recent().toISOString(),
      corrigéePar: faker.internet.email(),
      raison: faker.word.words(),
      nombreDeMois: faker.number.int({ min: 1, max: 100 }),
      pièceJustificative: {
        format: 'application/pdf',
        content: convertStringToReadableStream(content),
      },
      ...partialFixture,
    };

    this.#corrigéeLe = fixture.corrigéeLe;
    this.#corrigéePar = fixture.corrigéePar;
    this.#raison = fixture.raison;
    this.#nombreDeMois = fixture.nombreDeMois;
    this.#format = fixture.pièceJustificative ? fixture.pièceJustificative.format : undefined;
    this.#content = fixture.pièceJustificative ? content : undefined;

    this.aÉtéCréé = true;

    return fixture;
  }
}
