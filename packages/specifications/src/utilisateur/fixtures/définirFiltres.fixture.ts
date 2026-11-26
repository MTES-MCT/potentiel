import { faker } from '@faker-js/faker';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import type { UserFiltersType } from '@potentiel-domain/utilisateur';

import type { Fixture } from '../../fixture.js';

interface DéfinirFiltresUtilisateur {
  readonly email: string;
  readonly définisLe: string;
  readonly filtres: UserFiltersType;
}

export type DéfinirFiltresUtilisateurProps = Partial<Readonly<DéfinirFiltresUtilisateur>>;

export class DéfinirFiltresUtilisateurFixture
  implements DéfinirFiltresUtilisateur, Fixture<DéfinirFiltresUtilisateur>
{
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  #email!: string;
  get email(): string {
    return this.#email;
  }

  #définisLe!: string;
  get définisLe(): string {
    return this.#définisLe;
  }

  #filtres!: UserFiltersType;
  get filtres(): UserFiltersType {
    return this.#filtres;
  }

  créer(partialFixture: DéfinirFiltresUtilisateurProps): Readonly<DéfinirFiltresUtilisateur> {
    const fixture: DéfinirFiltresUtilisateur = {
      email: faker.internet.email(),
      filtres: {
        technologie: [faker.helpers.arrayElement(AppelOffre.technologies)],
        cycle: [faker.helpers.arrayElement(AppelOffre.cycles)],
      },
      définisLe: DateTime.now().formatter(),
      ...partialFixture,
    };
    this.#email = fixture.email;
    this.#filtres = fixture.filtres;
    this.#définisLe = fixture.définisLe;

    this.#aÉtéCréé = true;
    return fixture;
  }
}
