import { faker } from '@faker-js/faker';

import { Fixture } from '../../../../fixture';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

type PièceJustificative = { format: string; content: ReadableStream };

interface DemanderAbandon {
  pièceJustificative?: PièceJustificative;
  demandéLe: string;
  demandéPar: string;
  raison: string;
  recandidature: boolean;
}

export class DemanderAbandonFixture implements DemanderAbandon, Fixture<DemanderAbandon> {
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

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

  #demandéLe!: string;

  get demandéLe(): string {
    return this.#demandéLe;
  }

  set demandéLe(value: string) {
    this.#demandéLe = value;
  }

  #demandéPar!: string;

  get demandéPar(): string {
    return this.#demandéPar;
  }

  set demandéPar(value: string) {
    this.#demandéPar = value;
  }

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  set raison(value: string) {
    this.#raison = value;
  }

  #recandidature!: boolean;

  get recandidature(): boolean {
    return this.#recandidature;
  }

  set recandidature(value: boolean) {
    this.#recandidature = value;
  }

  créer(partialFixture?: Partial<Readonly<DemanderAbandon>>): Readonly<DemanderAbandon> {
    const recandidature = faker.datatype.boolean();

    const fixture: DemanderAbandon = {
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      raison: faker.word.words(),
      recandidature,
      ...partialFixture,
    };

    this.#demandéLe = fixture.demandéLe;
    this.#demandéPar = fixture.demandéPar;
    this.#raison = fixture.raison;
    this.#recandidature = fixture.recandidature;

    if (!fixture.recandidature) {
      const content = faker.word.words();
      fixture.pièceJustificative = {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      };
      this.#format = fixture.pièceJustificative.format;
      this.#content = content;
    }

    this.#aÉtéCréé = true;
    return fixture;
  }
}
