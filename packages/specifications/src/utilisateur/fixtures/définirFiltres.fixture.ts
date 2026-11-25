import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';
import { Filtres } from '@potentiel-domain/utilisateur';

import type { Fixture } from '../../fixture.js';

interface DéfinirFiltresUtilisateur {
  readonly email: string;
  readonly définisLe: string;
  readonly filtres: Filtres.Type;
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

  #filtres!: Filtres.Type;
  get filtres(): Filtres.Type {
    return this.#filtres;
  }

  créer(partialFixture: DéfinirFiltresUtilisateurProps): Readonly<DéfinirFiltresUtilisateur> {
    const fixture: DéfinirFiltresUtilisateur = {
      email: faker.internet.email(),
      filtres: {
        technologie: [faker.helpers.arrayElement(Filtres.technologie)],
        cycle: [faker.helpers.arrayElement(Filtres.cycle)],
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
