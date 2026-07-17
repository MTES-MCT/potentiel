import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';

export interface ModifierActionnaire {
  readonly actionnaire: string;
  readonly dateModification: string;
  readonly modifiéPar: string;
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

  #modifiéPar!: string;

  get modifiéPar(): string {
    return this.#modifiéPar;
  }

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  créer(partialFixture: Partial<Readonly<ModifierActionnaire>>): Readonly<ModifierActionnaire> {
    const fixture = {
      actionnaire: faker.person.fullName(),
      dateModification: faker.date.recent().toISOString(),
      raison: faker.company.catchPhrase(),
      modifiéPar: faker.internet.email(),
      ...partialFixture,
    };

    this.#actionnaire = fixture.actionnaire;
    this.#dateModification = fixture.dateModification;
    this.#modifiéPar = fixture.modifiéPar;
    this.#raison = fixture.raison;

    this.aÉtéCréé = true;

    return fixture;
  }
}
