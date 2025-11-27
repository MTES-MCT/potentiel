import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../fixture';

interface RemplacerAccèsProjet {
  readonly email: string;
}

export class RemplacerAccèsProjetFixture extends AbstractFixture<RemplacerAccèsProjet> {
  #email!: string;
  get email(): string {
    return this.#email;
  }

  créer(partialFixture: Partial<Readonly<RemplacerAccèsProjet>>): Readonly<RemplacerAccèsProjet> {
    const fixture: RemplacerAccèsProjet = {
      email: faker.internet.email(),
      ...partialFixture,
    };
    this.#email = fixture.email;

    this.aÉtéCréé = true;
    return fixture;
  }
}
