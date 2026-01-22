import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable.js';

interface DemanderRecours {
  readonly pièceJustificative: { format: string; content: ReadableStream };
  readonly demandéLe: string;
  readonly demandéPar: string;
  readonly raison: string;
}

export class DemanderRecoursFixture
  extends AbstractFixture<DemanderRecours>
  implements DemanderRecours
{
  #format!: string;
  #content!: string;

  get pièceJustificative(): DemanderRecours['pièceJustificative'] {
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

  créer(partialData?: Partial<DemanderRecours>): Readonly<DemanderRecours> {
    const content = faker.word.words();

    const fixture = {
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      raison: faker.word.words(),
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ...partialData,
    };

    this.#demandéLe = fixture.demandéLe;
    this.#demandéPar = fixture.demandéPar;
    this.#raison = fixture.raison;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;

    this.aÉtéCréé = true;
    return fixture;
  }
}
