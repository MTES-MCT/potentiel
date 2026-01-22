import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable.js';

type PièceJustificative = { format: string; content: ReadableStream };

interface DemanderAbandon {
  readonly demandéLe: string;
  readonly demandéPar: string;
  readonly raison: string;
  readonly recandidature: boolean;
  readonly pièceJustificative?: PièceJustificative;
}

export class DemanderAbandonFixture
  extends AbstractFixture<DemanderAbandon>
  implements DemanderAbandon
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

  #recandidature!: boolean;

  get recandidature(): boolean {
    return this.#recandidature;
  }

  #identifiantProjet!: string;

  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  créer(
    partialFixture: Partial<Readonly<DemanderAbandon>> & { identifiantProjet: string },
  ): Readonly<DemanderAbandon> {
    const fixture = {
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      raison: faker.word.words(),
      recandidature: false,
      ...partialFixture,
    };

    this.#demandéLe = fixture.demandéLe;
    this.#demandéPar = fixture.demandéPar;
    this.#raison = fixture.raison;
    this.#recandidature = fixture.recandidature;
    this.#identifiantProjet = fixture.identifiantProjet;

    if (!fixture.recandidature) {
      const content = faker.word.words();
      fixture.pièceJustificative = {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      };
      this.#format = fixture.pièceJustificative.format;
      this.#content = content;
    }

    this.aÉtéCréé = true;
    return fixture;
  }
}
