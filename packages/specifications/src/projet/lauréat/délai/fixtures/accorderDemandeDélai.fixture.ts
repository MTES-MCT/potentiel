import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../fixture.js';

interface AccorderDemandeDélai {
  readonly réponseSignée: PièceJustificative;
  readonly accordéeLe: string;
  readonly accordéePar: string;
  readonly nombreDeMois: number;
  readonly dateAchèvementPrévisionnelActuelle: string;
  readonly motif: string;
  readonly ancienMotif: string;
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

  #motif!: string;

  get motif(): string {
    return this.#motif;
  }

  #ancienMotif!: string;

  get ancienMotif(): string {
    return this.#ancienMotif;
  }

  #dateAchèvementPrévisionnelActuelle!: string;

  get dateAchèvementPrévisionnelActuelle(): string {
    return this.#dateAchèvementPrévisionnelActuelle;
  }

  créer(partialData?: Partial<AccorderDemandeDélai>): Readonly<AccorderDemandeDélai> {
    const fakeMotif = faker.helpers.arrayElement(Lauréat.Délai.MotifDemandeDélai.motifs);
    const fixture = {
      accordéeLe: faker.date.recent().toISOString(),
      accordéePar: faker.internet.email(),
      réponseSignée: faker.potentiel.document(),
      nombreDeMois: faker.number.int({ min: 1, max: 100 }),
      dateAchèvementPrévisionnelActuelle: faker.date.recent().toISOString(),
      motif: fakeMotif,
      ancienMotif: fakeMotif,
      ...partialData,
    };

    this.#accordéeLe = fixture.accordéeLe;
    this.#accordéePar = fixture.accordéePar;
    this.#réponseSignée = fixture.réponseSignée;
    this.#nombreDeMois = fixture.nombreDeMois;
    this.#dateAchèvementPrévisionnelActuelle = fixture.dateAchèvementPrévisionnelActuelle;
    this.#motif = fixture.motif;
    this.#ancienMotif = fixture.ancienMotif;

    this.aÉtéCréé = true;

    return fixture;
  }
}
