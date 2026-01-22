import { faker } from '@faker-js/faker';

import { Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { Fixture } from '../../../fixture.js';

interface InviterPorteur {
  readonly email: string;
}

export type InviterPorteurProps = Partial<Readonly<InviterPorteur>>;

export class InviterPorteurFixture implements InviterPorteur, Fixture<InviterPorteur> {
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  #email!: string;
  get email(): string {
    return this.#email;
  }

  créer(partialFixture: InviterPorteurProps): Readonly<InviterPorteur> {
    const fixture: InviterPorteur = {
      email: faker.internet.email({ firstName: 'porteur' }),
      ...partialFixture,
    };
    this.#email = fixture.email;

    this.#aÉtéCréé = true;
    return fixture;
  }

  mapToExpected() {
    const email = Email.convertirEnValueType(this.email);
    return {
      email,
      rôle: Role.porteur,
    };
  }
}
