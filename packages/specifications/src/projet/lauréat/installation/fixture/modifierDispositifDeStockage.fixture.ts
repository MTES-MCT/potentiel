import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../../fixture.js';

export interface ModifierDispositifDeStockage {
  readonly dispositifDeStockage: Lauréat.Installation.DispositifDeStockage.RawType;
  readonly dateModification: string;
  readonly raison: string;
  readonly pièceJustificative: {
    readonly content: string;
    readonly format: string;
  };
}

export class ModifierDispositifDeStockageFixture
  extends AbstractFixture<ModifierDispositifDeStockage>
  implements ModifierDispositifDeStockage
{
  #dispositifDeStockage!: Lauréat.Installation.DispositifDeStockage.RawType;

  get dispositifDeStockage(): Lauréat.Installation.DispositifDeStockage.RawType {
    return this.#dispositifDeStockage;
  }

  #dateModification!: string;

  get dateModification(): string {
    return this.#dateModification;
  }

  #format!: string;
  #content!: string;

  get pièceJustificative(): ModifierDispositifDeStockage['pièceJustificative'] {
    return {
      format: this.#format,
      content: this.#content,
    };
  }

  #raison!: string;
  get raison(): string {
    return this.#raison;
  }

  créer(
    partialFixture?: Partial<Readonly<ModifierDispositifDeStockage>>,
  ): Readonly<ModifierDispositifDeStockage> {
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
      dateModification: faker.date.recent().toISOString(),
      pièceJustificative: {
        format: faker.potentiel.fileFormat(),
        content,
      },
      raison: faker.word.words(),
      ...partialFixture,
    };

    this.#dispositifDeStockage = fixture.dispositifDeStockage;
    this.#dateModification = fixture.dateModification;
    this.#format = fixture.pièceJustificative.format;
    this.#content = content;
    this.#raison = fixture.raison;

    this.aÉtéCréé = true;

    return fixture;
  }
}
