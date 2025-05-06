import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface ModifierProducteur {
  readonly modifiéLe: string;
  readonly modifiéPar: string;
  readonly producteur: string;
}

export class ModifierProducteurFixture
  extends AbstractFixture<ModifierProducteur>
  implements ModifierProducteur
{
  #modifiéLe!: string;

  get modifiéLe(): string {
    return this.#modifiéLe;
  }

  #modifiéPar!: string;

  get modifiéPar(): string {
    return this.#modifiéPar;
  }

  #producteur!: string;

  get producteur(): string {
    return this.#producteur;
  }

  créer(partialData?: Partial<ModifierProducteur>): Readonly<ModifierProducteur> {
    const fixture: ModifierProducteur = {
      modifiéLe: faker.date.recent().toISOString(),
      modifiéPar: faker.internet.email(),
      producteur: faker.animal.insect(),
      ...partialData,
    };

    this.#modifiéLe = fixture.modifiéLe;
    this.#modifiéPar = fixture.modifiéPar;
    this.#producteur = fixture.producteur;

    this.aÉtéCréé = true;
    return fixture;
  }
}
