import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface ImporterProducteur {
  readonly producteur: string;
  readonly importéLe: string;
}

export class ImporterProducteurFixture
  extends AbstractFixture<ImporterProducteur>
  implements ImporterProducteur
{
  #producteur!: string;

  get producteur(): string {
    return this.#producteur;
  }

  #importéLe!: string;

  get importéLe(): string {
    return this.#importéLe;
  }

  créer(partialFixture?: Partial<Readonly<ImporterProducteur>>): Readonly<ImporterProducteur> {
    const fixture = {
      producteur: faker.animal.insect(),
      importéLe: faker.date.recent().toISOString(),
      ...partialFixture,
    };

    this.#producteur = fixture.producteur;
    this.#importéLe = fixture.importéLe;

    this.aÉtéCréé = true;

    return fixture;
  }
}
