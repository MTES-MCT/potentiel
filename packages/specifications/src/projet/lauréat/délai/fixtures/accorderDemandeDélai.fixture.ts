import { faker } from '@faker-js/faker';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';

interface AccorderDemandeDélai {
  readonly réponseSignée: PièceJustificative;
  readonly accordéeLe: string;
  readonly accordéePar: string;
  readonly nombreDeMois: number;
  readonly dateAchèvementPrévisionnelActuelle: string;
}

export class AccorderDemandeDélaiFixture
  extends AbstractFixture<AccorderDemandeDélai>
  implements AccorderDemandeDélai
{
  #réponseSignée!: PièceJustificative;

  get réponseSignée(): PièceJustificative {
    return this.#réponseSignée;
  }

  #accordéeLe!: string;

  get accordéeLe(): string {
    return this.#accordéeLe;
  }

  #accordéePar!: string;

  get accordéePar(): string {
    return this.#accordéePar;
  }

  #nombreDeMois!: number;

  get nombreDeMois(): number {
    return this.#nombreDeMois;
  }

  #dateAchèvementPrévisionnelActuelle!: string;

  get dateAchèvementPrévisionnelActuelle(): string {
    return this.#dateAchèvementPrévisionnelActuelle;
  }

  créer(partialData?: Partial<AccorderDemandeDélai>): Readonly<AccorderDemandeDélai> {
    const fixture = {
      accordéeLe: faker.date.recent().toISOString(),
      accordéePar: faker.internet.email(),
      réponseSignée: faker.potentiel.document(),
      nombreDeMois: faker.number.int({ min: 1, max: 100 }),
      dateAchèvementPrévisionnelActuelle: faker.date.recent().toISOString(),
      ...partialData,
    };

    this.#accordéeLe = fixture.accordéeLe;
    this.#accordéePar = fixture.accordéePar;
    this.#réponseSignée = fixture.réponseSignée;
    this.#nombreDeMois = fixture.nombreDeMois;
    this.#dateAchèvementPrévisionnelActuelle = fixture.dateAchèvementPrévisionnelActuelle;

    this.aÉtéCréé = true;

    return fixture;
  }
}
