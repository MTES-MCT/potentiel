import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

export interface MettreÀJourNomProjet {
  readonly nomProjet: string;
  readonly misÀJourLe: string;
  readonly misÀJourPar: string;
}

export class MettreÀJourNomProjetFixture
  extends AbstractFixture<MettreÀJourNomProjet>
  implements MettreÀJourNomProjet
{
  #nomProjet!: string;

  get nomProjet(): string {
    return this.#nomProjet;
  }

  #misÀJourLe!: string;

  get misÀJourLe(): string {
    return this.#misÀJourLe;
  }
  #misÀJourPar!: string;

  get misÀJourPar(): string {
    return this.#misÀJourPar;
  }

  créer(
    partialFixture: Partial<Readonly<MettreÀJourNomProjet>> & { misÀJourPar: string },
  ): Readonly<MettreÀJourNomProjet> {
    const fixture = {
      nomProjet: faker.food.dish(),
      misÀJourLe: faker.date.recent().toISOString(),
      ...partialFixture,
    };

    this.#nomProjet = fixture.nomProjet;
    this.#misÀJourLe = fixture.misÀJourLe;
    this.#misÀJourPar = fixture.misÀJourPar;

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
