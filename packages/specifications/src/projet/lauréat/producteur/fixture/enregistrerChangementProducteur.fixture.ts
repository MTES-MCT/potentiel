import { faker } from '@faker-js/faker';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';

interface EnregistrerChangementProducteur {
  readonly pièceJustificative: PièceJustificative;
  readonly enregistréLe: string;
  readonly enregistréPar: string;
  readonly producteur: string;
  readonly siret: string;
}

export class EnregistrerChangementProducteurFixture
  extends AbstractFixture<EnregistrerChangementProducteur>
  implements EnregistrerChangementProducteur
{
  #pièceJustificative!: PièceJustificative;

  get pièceJustificative(): PièceJustificative {
    return this.#pièceJustificative;
  }

  #enregistréLe!: string;

  get enregistréLe(): string {
    return this.#enregistréLe;
  }

  #enregistréPar!: string;

  get enregistréPar(): string {
    return this.#enregistréPar;
  }

  #producteur!: string;

  get producteur(): string {
    return this.#producteur;
  }

  #siret!: string;

  get siret(): string {
    return this.#siret;
  }

  créer(
    partialData?: Partial<EnregistrerChangementProducteur>,
  ): Readonly<EnregistrerChangementProducteur> {
    const fixture: EnregistrerChangementProducteur = {
      enregistréLe: faker.date.recent().toISOString(),
      enregistréPar: faker.internet.email(),
      pièceJustificative: faker.potentiel.document(),
      producteur: faker.animal.insect(),
      siret: faker.string.numeric(14),
      ...partialData,
    };

    this.#enregistréLe = fixture.enregistréLe;
    this.#enregistréPar = fixture.enregistréPar;
    this.#pièceJustificative = fixture.pièceJustificative;
    this.#producteur = fixture.producteur;
    this.#siret = fixture.siret;

    this.aÉtéCréé = true;
    return fixture;
  }
}
