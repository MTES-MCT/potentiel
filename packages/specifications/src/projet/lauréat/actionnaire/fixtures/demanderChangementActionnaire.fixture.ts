import { faker } from '@faker-js/faker';

import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable.js';
import { AbstractFixture } from '../../../../fixture.js';

interface DemanderChangementActionnaire {
  readonly pièceJustificative: { format: string; content: ReadableStream };
  readonly demandéLe: string;
  readonly demandéPar: string;
  readonly raison: string;
  readonly actionnaire: string;
}

export class DemanderChangementActionnaireFixture
  extends AbstractFixture<DemanderChangementActionnaire>
  implements DemanderChangementActionnaire
{
  #format!: string;
  #content!: string;

  get pièceJustificative(): DemanderChangementActionnaire['pièceJustificative'] {
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

  #actionnaire!: string;

  get actionnaire(): string {
    return this.#actionnaire;
  }

  créer(
    partialData?: Partial<DemanderChangementActionnaire>,
  ): Readonly<DemanderChangementActionnaire> {
    const content = faker.word.words();

    const fixture = {
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      raison: faker.company.catchPhrase(),
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      actionnaire: faker.company.name(),
      ...partialData,
    };

    this.#demandéLe = fixture.demandéLe;
    this.#demandéPar = fixture.demandéPar;
    this.#raison = fixture.raison;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;
    this.#actionnaire = fixture.actionnaire;

    this.aÉtéCréé = true;
    return fixture;
  }
}
