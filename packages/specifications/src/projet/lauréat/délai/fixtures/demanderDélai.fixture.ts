import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable.js';

type PièceJustificative = { format: string; content: ReadableStream };

export type CréerDemandeDélaiFixture = Partial<Readonly<DemanderDélai>> & {
  identifiantProjet: string;
};

interface DemanderDélai {
  readonly demandéLe: string;
  readonly demandéPar: string;
  readonly nombreDeMois: number;
  readonly raison: string;
  readonly pièceJustificative: PièceJustificative;
}

export class DemanderDélaiFixture extends AbstractFixture<DemanderDélai> implements DemanderDélai {
  #format!: string;
  #content!: string;

  get pièceJustificative(): PièceJustificative {
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

  #nombreDeMois!: number;

  get nombreDeMois(): number {
    return this.#nombreDeMois;
  }

  #identifiantProjet!: string;

  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  créer(
    partialFixture: Partial<Readonly<DemanderDélai>> & { identifiantProjet: string },
  ): Readonly<DemanderDélai> {
    const content = faker.word.words();

    const fixture = {
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      raison: faker.word.words(),
      nombreDeMois: faker.number.int({ min: 1, max: 100 }),
      pièceJustificative: {
        format: 'application/pdf',
        content: convertStringToReadableStream(content),
      },
      ...partialFixture,
    };

    this.#demandéLe = fixture.demandéLe;
    this.#demandéPar = fixture.demandéPar;
    this.#raison = fixture.raison;
    this.#nombreDeMois = fixture.nombreDeMois;
    this.#identifiantProjet = fixture.identifiantProjet;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;

    this.aÉtéCréé = true;

    return fixture;
  }
}
