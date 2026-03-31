import { faker } from '@faker-js/faker';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';

export type CréerDemandeDélaiFixture = Partial<Readonly<DemanderDélai>> & {
  identifiantProjet: string;
};

interface DemanderDélai {
  readonly demandéLe: string;
  readonly demandéPar: string;
  readonly nombreDeMois: number;
  readonly raison: string;
  readonly pièceJustificative: PièceJustificative;
}

export class DemanderDélaiFixture extends AbstractFixture<DemanderDélai> implements DemanderDélai {
  #pièceJustificative!: PièceJustificative;
  get pièceJustificative(): PièceJustificative {
    return this.#pièceJustificative;
  }

  #demandéLe!: string;

  get demandéLe(): string {
    return this.#demandéLe;
  }

  #demandéPar!: string;

  get demandéPar(): string {
    return this.#demandéPar;
  }

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  #nombreDeMois!: number;

  get nombreDeMois(): number {
    return this.#nombreDeMois;
  }

  #identifiantProjet!: string;

  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  créer(
    partialFixture: Partial<Readonly<DemanderDélai>> & { identifiantProjet: string },
  ): Readonly<DemanderDélai> {
    const fixture = {
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      raison: faker.word.words(),
      nombreDeMois: faker.number.int({ min: 1, max: 100 }),
      pièceJustificative: faker.potentiel.document(),
      ...partialFixture,
    };

    this.#demandéLe = fixture.demandéLe;
    this.#demandéPar = fixture.demandéPar;
    this.#raison = fixture.raison;
    this.#nombreDeMois = fixture.nombreDeMois;
    this.#identifiantProjet = fixture.identifiantProjet;
    this.#pièceJustificative = fixture.pièceJustificative;

    this.aÉtéCréé = true;

    return fixture;
  }
}
