import { faker } from '@faker-js/faker';

import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';
import { AbstractFixture } from '../../../../fixture';

interface EnregistrerChangementActionnaire {
  readonly pièceJustificative: { format: string; content: ReadableStream };
  readonly enregistréLe: string;
  readonly enregistréPar: string;
  readonly raison: string;
  readonly actionnaire: string;
}

export class EnregistrerChangementActionnaireFixture
  extends AbstractFixture<EnregistrerChangementActionnaire>
  implements EnregistrerChangementActionnaire
{
  #format!: string;
  #content!: string;

  get pièceJustificative(): EnregistrerChangementActionnaire['pièceJustificative'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  #enregistréLe!: string;

  get enregistréLe(): string {
    return this.#enregistréLe;
  }

  #enregistréPar!: string;

  get enregistréPar(): string {
    return this.#enregistréPar;
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
    partialData?: Partial<EnregistrerChangementActionnaire>,
  ): Readonly<EnregistrerChangementActionnaire> {
    const content = faker.word.words();

    const fixture = {
      enregistréLe: faker.date.recent().toISOString(),
      enregistréPar: faker.internet.email(),
      raison: faker.company.catchPhrase(),
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      actionnaire: faker.company.name(),
      ...partialData,
    };

    this.#enregistréLe = fixture.enregistréLe;
    this.#enregistréPar = fixture.enregistréPar;
    this.#raison = fixture.raison;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;
    this.#actionnaire = fixture.actionnaire;

    this.aÉtéCréé = true;
    return fixture;
  }
}
