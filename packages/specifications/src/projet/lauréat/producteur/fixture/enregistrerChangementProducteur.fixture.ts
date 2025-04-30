import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

interface EnregistrerChangementProducteur {
  readonly pièceJustificative: { format: string; content: ReadableStream };
  readonly demandéLe: string;
  readonly demandéPar: string;
  readonly raison: string;
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

  #raison!: string;

  get raison(): string {
    return this.#raison;
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
      raison: faker.company.catchPhrase(),
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      producteur: faker.animal.insect(),
      ...partialData,
    };

    this.#demandéLe = fixture.demandéLe;
    this.#demandéPar = fixture.demandéPar;
    this.#raison = fixture.raison;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;
    this.#producteur = fixture.producteur;

    this.aÉtéCréé = true;
    return fixture;
  }
}
