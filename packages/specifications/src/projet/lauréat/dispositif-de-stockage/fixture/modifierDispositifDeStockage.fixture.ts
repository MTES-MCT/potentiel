import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../../fixture';

export interface ModifierDispositifDeStockage {
  readonly dispositifDeStockage: Lauréat.DispositifDeStockage.DispositifDeStockage.RawType;
  readonly dateModification: string;
}

export class ModifierDispositifDeStockageFixture
  extends AbstractFixture<ModifierDispositifDeStockage>
  implements ModifierDispositifDeStockage
{
  #dispositifDeStockage!: Lauréat.DispositifDeStockage.DispositifDeStockage.RawType;

  get dispositifDeStockage(): Lauréat.DispositifDeStockage.DispositifDeStockage.RawType {
    return this.#dispositifDeStockage;
  }

  #dateModification!: string;

  get dateModification(): string {
    return this.#dateModification;
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
      ...partialFixture,
    };

    this.#dispositifDeStockage = fixture.dispositifDeStockage;
    this.#dateModification = fixture.dateModification;

    this.aÉtéCréé = true;

    return fixture;
  }
}
