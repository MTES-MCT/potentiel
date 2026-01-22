import { faker } from '@faker-js/faker';

import { Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { Fixture } from '../../../fixture.js';

interface RéclamerProjet {
  readonly email: string;
  readonly identifiantProjet: string;
  readonly prixRéférence?: number;
  readonly numéroCRE?: string;
}

export class RéclamerProjetFixture implements RéclamerProjet, Fixture<RéclamerProjet> {
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  #email!: string;
  get email(): string {
    return this.#email;
  }

  #identifiantProjet!: string;
  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  #prixRéférence?: number;
  get prixRéférence(): number | undefined {
    return this.#prixRéférence;
  }

  #numéroCRE?: string;
  get numéroCRE(): string | undefined {
    return this.#numéroCRE;
  }

  créer(
    partialFixture: Partial<Readonly<RéclamerProjet>> & {
      identifiantProjet: string;
    },
  ): Readonly<RéclamerProjet> {
    const fixture: RéclamerProjet = {
      email: faker.internet.email(),
      ...partialFixture,
    };
    this.#email = fixture.email;
    this.#identifiantProjet = fixture.identifiantProjet;
    this.#prixRéférence = fixture.prixRéférence;
    this.#numéroCRE = fixture.numéroCRE;

    this.#aÉtéCréé = true;
    return fixture;
  }

  mapToExpected() {
    const email = Email.convertirEnValueType(this.email);
    return {
      identifiantUtilisateur: email,
      rôle: Role.porteur,
      région: undefined,
      identifiantGestionnaireRéseau: undefined,
      fonction: undefined,
      zone: undefined,
    };
  }
}
