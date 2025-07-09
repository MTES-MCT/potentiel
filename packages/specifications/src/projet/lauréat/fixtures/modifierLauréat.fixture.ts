import { faker } from '@faker-js/faker';

import { Candidature } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../fixture';
import { getFakeLocation } from '../../../helpers/getFakeLocation';

export interface ModifierLauréat {
  readonly nomProjet: string;
  readonly modifiéLe: string;
  readonly modifiéPar: string;
  readonly localité: {
    adresse1: string;
    adresse2: string;
    codePostal: string;
    commune: string;
    département: string;
    région: string;
  };
}

export class ModifierLauréatFixture
  extends AbstractFixture<ModifierLauréat>
  implements ModifierLauréat
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

  #localité!: ModifierLauréat['localité'];

  get localité(): ModifierLauréat['localité'] {
    return this.#localité;
  }

  créer(
    partialFixture: Partial<Readonly<ModifierLauréat>> & { modifiéPar: string },
  ): Readonly<ModifierLauréat> {
    const fixture = {
      nomProjet: faker.person.fullName(),
      modifiéLe: faker.date.recent().toISOString(),
      localité: {
        adresse1: faker.location.streetAddress(),
        adresse2: faker.location.streetAddress(),
        ...getFakeLocation(),
      },
      ...partialFixture,
    };

    this.#nomProjet = fixture.nomProjet;
    this.#localité = fixture.localité;
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
      localité: Candidature.Localité.bind(this.localité),
    };
  }
}
