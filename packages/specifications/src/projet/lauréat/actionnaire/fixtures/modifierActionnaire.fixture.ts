import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';

export interface ModifierActionnaire {
  readonly actionnaire: string;
  readonly dateModification: string;
  readonly raison: string;
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

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  créer(partialFixture?: Partial<Readonly<ModifierActionnaire>>): Readonly<ModifierActionnaire> {
    const fixture = {
      actionnaire: faker.person.fullName(),
      dateModification: faker.date.recent().toISOString(),
      raison: faker.company.catchPhrase(),
      ...partialFixture,
    };

    this.#actionnaire = fixture.actionnaire;
    this.#dateModification = fixture.dateModification;
    this.#raison = fixture.raison;

    this.aÉtéCréé = true;

    return fixture;
  }
}
