import { faker } from '@faker-js/faker';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';

export interface ModifierNomProjet {
  readonly nomProjet: string;
  readonly modifiéLe: string;
  readonly modifiéPar: string;
  readonly pièceJustificative?: PièceJustificative;
  readonly raison?: string;
}

export class ModifierNomProjetFixture
  extends AbstractFixture<ModifierNomProjet>
  implements ModifierNomProjet
{
  #nomProjet!: string;

  get nomProjet(): string {
    return this.#nomProjet;
  }

  #modifiéLe!: string;

  get modifiéLe(): string {
    return this.#modifiéLe;
  }
  #modifiéPar!: string;

  get modifiéPar(): string {
    return this.#modifiéPar;
  }
  #pièceJustificative?: PièceJustificative;

  get pièceJustificative(): ModifierNomProjet['pièceJustificative'] {
    return this.#pièceJustificative;
  }

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  créer(
    partialFixture: Partial<Readonly<ModifierNomProjet>> & { modifiéPar: string },
  ): Readonly<ModifierNomProjet> {
    const fixture = {
      nomProjet: faker.food.dish(),
      modifiéLe: faker.date.recent().toISOString(),
      raison: faker.company.buzzPhrase(),
      pièceJustificative: faker.potentiel.document(),
      ...partialFixture,
    };

    this.#nomProjet = fixture.nomProjet;
    this.#modifiéLe = fixture.modifiéLe;
    this.#modifiéPar = fixture.modifiéPar;
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
