import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../fixture.js';

interface CorrigerDemandeDélai {
  readonly corrigéeLe: string;
  readonly corrigéePar: string;
  readonly nombreDeMois: number;
  readonly motif: string;
  readonly raison: string;
  readonly pièceJustificative?: PièceJustificative;
}

export class CorrigerDemandeDélaiFixture
  extends AbstractFixture<CorrigerDemandeDélai>
  implements CorrigerDemandeDélai
{
  #pièceJustificative?: PièceJustificative;
  get pièceJustificative(): PièceJustificative | undefined {
    return this.#pièceJustificative;
  }

  #corrigéeLe!: string;

  get corrigéeLe(): string {
    return this.#corrigéeLe;
  }

  #corrigéePar!: string;

  get corrigéePar(): string {
    return this.#corrigéePar;
  }

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  #nombreDeMois!: number;

  get nombreDeMois(): number {
    return this.#nombreDeMois;
  }

  #motif!: string;

  get motif(): string {
    return this.#motif;
  }

  créer(partialFixture: Partial<Readonly<CorrigerDemandeDélai>>): Readonly<CorrigerDemandeDélai> {
    const fixture = {
      corrigéeLe: faker.date.recent().toISOString(),
      corrigéePar: faker.internet.email(),
      raison: `correction ${faker.word.words()}`,
      nombreDeMois: faker.number.int({ min: 1, max: 100 }),
      motif: faker.helpers.arrayElement(Lauréat.Délai.MotifDemandeDélai.motifs),
      pièceJustificative: faker.potentiel.document(),
      ...partialFixture,
    };

    this.#corrigéeLe = fixture.corrigéeLe;
    this.#corrigéePar = fixture.corrigéePar;
    this.#raison = fixture.raison;
    this.#nombreDeMois = fixture.nombreDeMois;
    this.#pièceJustificative = fixture.pièceJustificative;
    this.#motif = fixture.motif;

    this.aÉtéCréé = true;

    return fixture;
  }
}
