import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

interface EnregistrerChangementProducteur {
  readonly pièceJustificative: { format: string; content: ReadableStream };
  readonly demandéLe: string;
  readonly demandéPar: string;
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

  #demandéLe!: string;

  get demandéLe(): string {
    return this.#demandéLe;
  }

  #demandéPar!: string;

  get demandéPar(): string {
    return this.#demandéPar;
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
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      producteur: faker.animal.insect(),
      ...partialData,
    };

    this.#demandéLe = fixture.demandéLe;
    this.#demandéPar = fixture.demandéPar;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;
    this.#producteur = fixture.producteur;

    this.aÉtéCréé = true;
    return fixture;
  }
}
