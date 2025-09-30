import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';
import { Lauréat } from '@potentiel-domain/projet';

export interface ModifierInstallationAvecDispositifDeStockage {
  readonly dispositifDeStockage: Lauréat.InstallationAvecDispositifDeStockage.DispositifDeStockage.RawType;
  readonly dateModification: string;
}

export class ModifierInstallationAvecDispositifDeStockageFixture
  extends AbstractFixture<ModifierInstallationAvecDispositifDeStockage>
  implements ModifierInstallationAvecDispositifDeStockage
{
  #dispositifDeStockage!: Lauréat.InstallationAvecDispositifDeStockage.DispositifDeStockage.RawType;

  get dispositifDeStockage(): Lauréat.InstallationAvecDispositifDeStockage.DispositifDeStockage.RawType {
    return this.#dispositifDeStockage;
  }

  #dateModification!: string;

  get dateModification(): string {
    return this.#dateModification;
  }

  créer(
    partialFixture?: Partial<Readonly<ModifierInstallationAvecDispositifDeStockage>>,
  ): Readonly<ModifierInstallationAvecDispositifDeStockage> {
    const installationAvecDispositifDeStockage = faker.datatype.boolean();

    const fixture = {
      dispositifDeStockage: installationAvecDispositifDeStockage
        ? {
            installationAvecDispositifDeStockage,
            capacitéDuDispositifDeStockage: faker.number.float({
              min: 0,
              max: 1000,
              fractionDigits: 3,
            }),
            puissanceDuDispositifDeStockage: faker.number.float({
              min: 0,
              max: 1000,
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
