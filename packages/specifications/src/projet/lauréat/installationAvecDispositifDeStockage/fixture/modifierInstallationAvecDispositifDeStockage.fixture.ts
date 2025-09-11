import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

export interface ModifierInstallationAvecDispositifDeStockage {
  readonly installationAvecDispositifDeStockage: boolean;
  readonly dateModification: string;
}

export class ModifierInstallationAvecDispositifDeStockageFixture
  extends AbstractFixture<ModifierInstallationAvecDispositifDeStockage>
  implements ModifierInstallationAvecDispositifDeStockage
{
  #installationAvecDispositifDeStockage!: boolean;

  get installationAvecDispositifDeStockage(): boolean {
    return this.#installationAvecDispositifDeStockage;
  }

  #dateModification!: string;

  get dateModification(): string {
    return this.#dateModification;
  }

  créer(
    partialFixture?: Partial<Readonly<ModifierInstallationAvecDispositifDeStockage>>,
  ): Readonly<ModifierInstallationAvecDispositifDeStockage> {
    const fixture = {
      installationAvecDispositifDeStockage: faker.datatype.boolean(),
      dateModification: faker.date.recent().toISOString(),
      ...partialFixture,
    };

    this.#installationAvecDispositifDeStockage = fixture.installationAvecDispositifDeStockage;
    this.#dateModification = fixture.dateModification;

    this.aÉtéCréé = true;

    return fixture;
  }
}
