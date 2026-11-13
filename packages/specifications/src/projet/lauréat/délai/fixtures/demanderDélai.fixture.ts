import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../fixture.js';

export type CréerDemandeDélaiFixture = Partial<Readonly<DemanderDélai>> & {
  identifiantProjet: string;
  motif: string;
  nombreDeMois?: number;
};

type Demande = {
  readonly demandéLe: string;
  readonly demandéPar: string;
  readonly nombreDeMois: number;
  readonly raison: string;
  readonly pièceJustificative: PièceJustificative;
  readonly motif: string;
};
interface DemanderDélai {
  readonly demandes: Map<Lauréat.Délai.MotifDemandeDélai.RawType, Demande>;
}

export class DemanderDélaiFixture extends AbstractFixture<DemanderDélai> implements DemanderDélai {
  #demandes: Map<Lauréat.Délai.MotifDemandeDélai.RawType, Demande> = new Map();

  get demandes(): Map<Lauréat.Délai.MotifDemandeDélai.RawType, Demande> {
    return this.#demandes;
  }

  getPièceJustificative(
    motif: Lauréat.Délai.MotifDemandeDélai.RawType,
  ): PièceJustificative | undefined {
    return this.#demandes.get(motif)?.pièceJustificative;
  }

  getDemandéLe(motif: Lauréat.Délai.MotifDemandeDélai.RawType): string | undefined {
    return this.#demandes.get(motif)?.demandéLe;
  }

  getDemandéPar(motif: Lauréat.Délai.MotifDemandeDélai.RawType): string | undefined {
    return this.#demandes.get(motif)?.demandéPar;
  }

  getRaison(motif: Lauréat.Délai.MotifDemandeDélai.RawType): string | undefined {
    return this.#demandes.get(motif)?.raison;
  }

  getNombreDeMois(motif: Lauréat.Délai.MotifDemandeDélai.RawType): number | undefined {
    return this.#demandes.get(motif)?.nombreDeMois;
  }

  #identifiantProjet!: string;

  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  créer(partialFixture: CréerDemandeDélaiFixture): Readonly<DemanderDélai> {
    const fixture = {
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      raison: faker.word.words(),
      nombreDeMois: faker.number.int({ min: 1, max: 100 }),
      pièceJustificative: faker.potentiel.document(),
      ...partialFixture,
    };

    this.#demandes.set(
      Lauréat.Délai.MotifDemandeDélai.convertirEnValueType(fixture.motif).formatter(),
      fixture,
    );

    this.aÉtéCréé = true;

    return this;
  }
}
