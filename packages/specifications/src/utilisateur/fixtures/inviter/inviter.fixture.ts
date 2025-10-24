import { faker } from '@faker-js/faker';

import { Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { Fixture } from '../../../fixture';

interface InviterUtilisateur {
  readonly email: string;
  readonly rôle: string;
  readonly fonction?: string | undefined;
  readonly nomComplet?: string | undefined;
  readonly région?: string | undefined;
  readonly zone?: string | undefined;
  readonly identifiantGestionnaireRéseau?: string | undefined;
}

export type InviterUtilisateurProps = Partial<Readonly<InviterUtilisateur>> &
  Pick<InviterUtilisateur, 'rôle'>;

export class InviterUtilisateurFixture implements InviterUtilisateur, Fixture<InviterUtilisateur> {
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

  #fonction?: string;
  get fonction(): string | undefined {
    return this.#fonction;
  }

  #nomComplet?: string;
  get nomComplet(): string | undefined {
    return this.#nomComplet;
  }

  #région?: string;
  get région(): string | undefined {
    return this.#région;
  }
  #zone?: string;
  get zone(): string | undefined {
    return this.#zone;
  }

  #identifiantGestionnaireRéseau?: string;
  get identifiantGestionnaireRéseau(): string | undefined {
    return this.#identifiantGestionnaireRéseau;
  }

  créer(partialFixture: InviterUtilisateurProps): Readonly<InviterUtilisateur> {
    const fixture: InviterUtilisateur = {
      email: faker.internet.email({ firstName: partialFixture.rôle }),
      ...partialFixture,
    };
    this.#email = fixture.email;
    this.#rôle = fixture.rôle;
    this.#fonction = fixture.fonction;
    this.#nomComplet = fixture.nomComplet;
    this.#région = fixture.région;
    this.#zone = fixture.zone;
    this.#identifiantGestionnaireRéseau = fixture.identifiantGestionnaireRéseau;

    this.#aÉtéCréé = true;
    return fixture;
  }

  mapToExpected() {
    const email = Email.convertirEnValueType(this.email);
    return {
      identifiantUtilisateur: email,
      rôle: Role.convertirEnValueType(this.rôle),
      région: this.région ?? Option.none,
      zone: this.zone ?? Option.none,
      identifiantGestionnaireRéseau: this.identifiantGestionnaireRéseau ?? Option.none,
      fonction: this.fonction ?? Option.none,
    };
  }
}
