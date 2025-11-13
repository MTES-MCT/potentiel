import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

export interface ModifierNomProjet {
  readonly nomProjet: string;
  readonly modifiéLe: string;
  readonly modifiéPar: string;
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

  créer(
    partialFixture: Partial<Readonly<ModifierNomProjet>> & { modifiéPar: string },
  ): Readonly<ModifierNomProjet> {
    const fixture = {
      nomProjet: faker.food.dish(),
      modifiéLe: faker.date.recent().toISOString(),
      ...partialFixture,
    };

    this.#nomProjet = fixture.nomProjet;
    this.#modifiéLe = fixture.modifiéLe;
    this.#modifiéPar = fixture.modifiéPar;

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
