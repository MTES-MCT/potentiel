import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';

export interface ModifierDispositifDeStockage {
  readonly dispositifDeStockage: Lauréat.Installation.DispositifDeStockage.RawType;
  readonly dateModification: string;
  readonly raison: string;
  readonly pièceJustificative: PièceJustificative;
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

  #pièceJustificative!: PièceJustificative;

  get pièceJustificative(): ModifierDispositifDeStockage['pièceJustificative'] {
    return this.#pièceJustificative;
  }

  #raison!: string;
  get raison(): string {
    return this.#raison;
  }

  créer(
    partialFixture?: Partial<Readonly<ModifierDispositifDeStockage>>,
  ): Readonly<ModifierDispositifDeStockage> {
    const installationAvecDispositifDeStockage = faker.datatype.boolean();
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
      pièceJustificative: faker.potentiel.document(),
      raison: faker.word.words(),
      ...partialFixture,
    };

    this.#dispositifDeStockage = fixture.dispositifDeStockage;
    this.#dateModification = fixture.dateModification;
    this.#pièceJustificative = fixture.pièceJustificative;
    this.#raison = fixture.raison;

    this.aÉtéCréé = true;

    return fixture;
  }
}
