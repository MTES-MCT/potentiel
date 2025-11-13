import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../../fixture';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

export interface EnregistrerChangementDispositifDeStockage {
  readonly dispositifDeStockage: Lauréat.Installation.DispositifDeStockage.RawType;
  readonly enregistréLe: string;
  readonly pièceJustificative: { format: string; content: ReadableStream };
  readonly raison: string;
}

export class EnregistrerChangementDispositifDeStockageFixture
  extends AbstractFixture<EnregistrerChangementDispositifDeStockage>
  implements EnregistrerChangementDispositifDeStockage
{
  #dispositifDeStockage!: Lauréat.Installation.DispositifDeStockage.RawType;

  get dispositifDeStockage(): Lauréat.Installation.DispositifDeStockage.RawType {
    return this.#dispositifDeStockage;
  }

  #enregistréLe!: string;

  get enregistréLe(): string {
    return this.#enregistréLe;
  }

  #format!: string;
  #content!: string;

  get pièceJustificative(): EnregistrerChangementDispositifDeStockage['pièceJustificative'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  #raison!: string;
  get raison(): string {
    return this.#raison;
  }

  créer(
    partialFixture?: Partial<Readonly<EnregistrerChangementDispositifDeStockage>>,
  ): Readonly<EnregistrerChangementDispositifDeStockage> {
    const installationAvecDispositifDeStockage = faker.datatype.boolean();
    const content = faker.word.words();

    const fixture = {
      dispositifDeStockage: installationAvecDispositifDeStockage
        ? {
            installationAvecDispositifDeStockage,
            capacitéDuDispositifDeStockageEnKWh: faker.number.float({
              min: 0,
              fractionDigits: 3,
            }),
            puissanceDuDispositifDeStockageEnKW: faker.number.float({
              min: 0,
              fractionDigits: 3,
            }),
          }
        : { installationAvecDispositifDeStockage },
      enregistréLe: faker.date.recent().toISOString(),
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      raison: faker.word.words(),
      ...partialFixture,
    };

    this.#dispositifDeStockage = fixture.dispositifDeStockage;
    this.#enregistréLe = fixture.enregistréLe;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;
    this.#raison = fixture.raison;

    this.aÉtéCréé = true;

    return fixture;
  }
}
