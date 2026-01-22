import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable.js';

interface EnregistrerChangementProducteur {
  readonly pièceJustificative: { format: string; content: ReadableStream };
  readonly enregistréLe: string;
  readonly enregistréPar: string;
  readonly producteur: string;
}

export class EnregistrerChangementProducteurFixture
  extends AbstractFixture<EnregistrerChangementProducteur>
  implements EnregistrerChangementProducteur
{
  #format!: string;
  #content!: string;

  get pièceJustificative(): EnregistrerChangementProducteur['pièceJustificative'] {
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

  #producteur!: string;

  get producteur(): string {
    return this.#producteur;
  }

  créer(
    partialData?: Partial<EnregistrerChangementProducteur>,
  ): Readonly<EnregistrerChangementProducteur> {
    const content = faker.word.words();

    const fixture: EnregistrerChangementProducteur = {
      enregistréLe: faker.date.recent().toISOString(),
      enregistréPar: faker.internet.email(),
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      producteur: faker.animal.insect(),
      ...partialData,
    };

    this.#enregistréLe = fixture.enregistréLe;
    this.#enregistréPar = fixture.enregistréPar;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;
    this.#producteur = fixture.producteur;

    this.aÉtéCréé = true;
    return fixture;
  }
}
