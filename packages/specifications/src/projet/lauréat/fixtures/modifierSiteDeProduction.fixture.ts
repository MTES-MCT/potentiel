import { faker } from '@faker-js/faker';

import { Candidature } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../../fixture';
import { getFakeLocation } from '../../../helpers/getFakeLocation';

export interface ModifierSiteDeProduction {
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

export class ModifierSiteDeProductionFixture
  extends AbstractFixture<ModifierSiteDeProduction>
  implements ModifierSiteDeProduction
{
  #modifiéLe!: string;

  get modifiéLe(): string {
    return this.#modifiéLe;
  }
  #modifiéPar!: string;

  get modifiéPar(): string {
    return this.#modifiéPar;
  }

  #localité!: ModifierSiteDeProduction['localité'];

  get localité(): ModifierSiteDeProduction['localité'] {
    return this.#localité;
  }

  créer(
    partialFixture: Partial<Readonly<ModifierSiteDeProduction>> & { modifiéPar: string },
  ): Readonly<ModifierSiteDeProduction> {
    const fixture = {
      modifiéLe: faker.date.recent().toISOString(),
      localité: {
        adresse1: faker.location.streetAddress(),
        adresse2: faker.location.streetAddress(),
        ...getFakeLocation(),
      },
      ...partialFixture,
    };

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
      localité: Candidature.Localité.bind(this.localité),
    };
  }
}
