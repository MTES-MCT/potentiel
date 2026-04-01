import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';

export interface EnregistrerChangementDispositifDeStockage {
  readonly dispositifDeStockage: Lauréat.Installation.DispositifDeStockage.RawType;
  readonly enregistréLe: string;
  readonly enregistréPar: string;
  readonly pièceJustificative: PièceJustificative;
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

  #enregistréPar!: string;

  get enregistréPar(): string {
    return this.#enregistréPar;
  }

  #pièceJustificative!: PièceJustificative;

  get pièceJustificative(): EnregistrerChangementDispositifDeStockage['pièceJustificative'] {
    return this.#pièceJustificative;
  }

  #raison!: string;
  get raison(): string {
    return this.#raison;
  }

  créer(
    partialFixture?: Partial<Readonly<EnregistrerChangementDispositifDeStockage>>,
  ): Readonly<EnregistrerChangementDispositifDeStockage> {
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
      enregistréLe: faker.date.recent().toISOString(),
      enregistréPar: faker.internet.email(),
      pièceJustificative: faker.potentiel.document(),
      raison: faker.word.words(),
      ...partialFixture,
    };

    this.#dispositifDeStockage = fixture.dispositifDeStockage;
    this.#enregistréLe = fixture.enregistréLe;
    this.#pièceJustificative = fixture.pièceJustificative;
    this.#raison = fixture.raison;
    this.#enregistréPar = fixture.enregistréPar;

    this.aÉtéCréé = true;

    return fixture;
  }
}
