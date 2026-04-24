import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';

interface ModifierProducteur {
  readonly modifiéLe: string;
  readonly modifiéPar: string;
  readonly siret: string;
  readonly producteur: string;
  readonly raison: string;
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

  #siret!: string;

  get siret(): string {
    return this.#siret;
  }

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  créer(partialData?: Partial<ModifierProducteur>): Readonly<ModifierProducteur> {
    const fixture: ModifierProducteur = {
      modifiéLe: faker.date.recent().toISOString(),
      modifiéPar: faker.internet.email(),
      producteur: faker.animal.insect(),
      siret: faker.string.numeric(14),
      raison: faker.company.catchPhrase(),
      ...partialData,
    };

    this.#modifiéLe = fixture.modifiéLe;
    this.#modifiéPar = fixture.modifiéPar;
    this.#producteur = fixture.producteur;
    this.#siret = fixture.siret;
    this.#raison = fixture.raison;

    this.aÉtéCréé = true;
    return fixture;
  }
}
