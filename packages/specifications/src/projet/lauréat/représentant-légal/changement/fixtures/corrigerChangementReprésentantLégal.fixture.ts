import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../../fixture.js';

export type CréerCorrectionChangementReprésentantLégalFixture = Partial<
  Readonly<CorrigerChangementReprésentantLégal>
> & {
  identifiantProjet: string;
};

export interface CorrigerChangementReprésentantLégal {
  readonly nomReprésentantLégal: string;
  readonly typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType;
  readonly pièceJustificative?: PièceJustificative;
  readonly corrigéLe: string;
  readonly corrigéPar: string;
}

export class CorrigerChangementReprésentantLégalFixture
  extends AbstractFixture<CorrigerChangementReprésentantLégal>
  implements CorrigerChangementReprésentantLégal
{
  #identifiantProjet!: string;

  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  #nomReprésentantLégal!: string;

  get nomReprésentantLégal(): string {
    return this.#nomReprésentantLégal;
  }

  #typeReprésentantLégal!: Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType;

  get typeReprésentantLégal(): Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType {
    return this.#typeReprésentantLégal;
  }

  #pièceJustificative!: PièceJustificative;
  get pièceJustificative(): PièceJustificative {
    return this.#pièceJustificative;
  }

  #corrigéLe!: string;

  get corrigéLe(): string {
    return this.#corrigéLe;
  }

  #corrigéPar!: string;

  get corrigéPar(): string {
    return this.#corrigéPar;
  }

  #statut!: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.ValueType;

  get statut(): Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.ValueType {
    return this.#statut;
  }

  créer(
    partialFixture: CréerCorrectionChangementReprésentantLégalFixture,
  ): Readonly<CorrigerChangementReprésentantLégal> {
    const fixture = {
      statut: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.demandé,
      nomReprésentantLégal: faker.person.fullName(),
      typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.personneMorale,
      corrigéLe: faker.date.recent().toISOString(),
      corrigéPar: faker.internet.email(),
      pièceJustificative: faker.potentiel.document(),
      ...partialFixture,
    };

    this.#identifiantProjet = fixture.identifiantProjet;
    this.#nomReprésentantLégal = fixture.nomReprésentantLégal;
    this.#typeReprésentantLégal = fixture.typeReprésentantLégal;
    this.#corrigéLe = fixture.corrigéLe;
    this.#corrigéPar = fixture.corrigéPar;
    this.#statut = fixture.statut;
    this.#pièceJustificative = fixture.pièceJustificative;

    this.aÉtéCréé = true;

    return fixture;
  }
}
