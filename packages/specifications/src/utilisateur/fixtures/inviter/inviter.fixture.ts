import { faker } from '@faker-js/faker';

import { Fixture } from '../../../fixture';

interface InviterPorteur {
  readonly email: string;
  readonly rôle: string;
  readonly région?: string | undefined;
  readonly identifiantGestionnaireRéseau?: string | undefined;
}

export class InviterUtilisateurFixture implements InviterPorteur, Fixture<InviterPorteur> {
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  #email!: string;
  get email(): string {
    return this.#email;
  }

  #rôle!: string;
  get rôle(): string {
    return this.#rôle;
  }

  #région?: string;
  get région(): string | undefined {
    return this.#région;
  }

  #identifiantGestionnaireRéseau?: string;
  get identifiantGestionnaireRéseau(): string | undefined {
    return this.#identifiantGestionnaireRéseau;
  }

  créer(
    partialFixture: Partial<Readonly<InviterPorteur>> & Pick<InviterPorteur, 'rôle'>,
  ): Readonly<InviterPorteur> {
    const fixture: InviterPorteur = {
      email: faker.internet.email(),
      ...partialFixture,
    };
    this.#email = fixture.email;
    this.#rôle = fixture.rôle;
    this.#région = fixture.région;
    this.#identifiantGestionnaireRéseau = fixture.identifiantGestionnaireRéseau;

    this.#aÉtéCréé = true;
    return fixture;
  }
}
