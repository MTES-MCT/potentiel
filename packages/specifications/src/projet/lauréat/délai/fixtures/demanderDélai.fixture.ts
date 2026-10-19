import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../fixture.js';

export type CréerDemandeDélaiFixture = Partial<Readonly<DemanderDélai>> & {
  identifiantProjet: string;
  motif?: string;
};

interface DemanderDélai {
  readonly demandéLe: string;
  readonly demandéPar: string;
  readonly nombreDeMois: number;
  readonly raison: string;
  readonly pièceJustificative: PièceJustificative;
  readonly motif: string;
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

  #motif!: string;

  get motif(): string {
    return this.#motif;
  }

  créer(partialFixture: CréerDemandeDélaiFixture): Readonly<DemanderDélai> {
    const fixture = {
      motif: Lauréat.Délai.MotifDemandeDélai.forceMajeure.motif,
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
    this.#motif = fixture.motif;

    this.aÉtéCréé = true;

    return fixture;
  }
}
