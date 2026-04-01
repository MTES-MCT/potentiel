import { faker } from '@faker-js/faker';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';

export interface EnregistrerChangementNomProjet {
  readonly nomProjet: string;
  readonly enregistréLe: string;
  readonly enregistréPar: string;
  readonly pièceJustificative: PièceJustificative;
  readonly raison: string;
}

export class EnregistrerChangementNomProjetFixture
  extends AbstractFixture<EnregistrerChangementNomProjet>
  implements EnregistrerChangementNomProjet
{
  #nomProjet!: string;

  get nomProjet(): string {
    return this.#nomProjet;
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

  get pièceJustificative(): EnregistrerChangementNomProjet['pièceJustificative'] {
    return this.#pièceJustificative;
  }

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  créer(
    partialFixture: Partial<Readonly<EnregistrerChangementNomProjet>> & { enregistréPar: string },
  ): Readonly<EnregistrerChangementNomProjet> {
    const fixture = {
      nomProjet: faker.food.dish(),
      enregistréLe: faker.date.recent().toISOString(),
      raison: faker.company.buzzPhrase(),
      pièceJustificative: faker.potentiel.document(),
      ...partialFixture,
    };

    this.#nomProjet = fixture.nomProjet;
    this.#enregistréLe = fixture.enregistréLe;
    this.#enregistréPar = fixture.enregistréPar;
    this.#raison = fixture.raison;
    this.#pièceJustificative = fixture.pièceJustificative;

    this.aÉtéCréé = true;

    return fixture;
  }

  mapToExpected() {
    if (!this.aÉtéCréé) {
      return {};
    }

    return {
      nomProjet: this.nomProjet,
    };
  }
}
