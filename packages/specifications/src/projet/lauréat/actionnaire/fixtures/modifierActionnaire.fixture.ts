import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

export interface ModifierActionnaire {
  readonly actionnaire: string;
  readonly dateModification: string;
}

export class ModifierActionnaireFixture
  extends AbstractFixture<ModifierActionnaire>
  implements ModifierActionnaire
{
  #actionnaire!: string;

  get actionnaire(): string {
    return this.#actionnaire;
  }

  #dateModification!: string;

  get dateModification(): string {
    return this.#dateModification;
  }

  créer(partialFixture?: Partial<Readonly<ModifierActionnaire>>): Readonly<ModifierActionnaire> {
    const fixture = {
      actionnaire: faker.person.fullName(),
      dateModification: faker.date.recent().toISOString(),
      ...partialFixture,
    };

    this.#actionnaire = fixture.actionnaire;
    this.#dateModification = fixture.dateModification;

    this.aÉtéCréé = true;

    return fixture;
  }
}
