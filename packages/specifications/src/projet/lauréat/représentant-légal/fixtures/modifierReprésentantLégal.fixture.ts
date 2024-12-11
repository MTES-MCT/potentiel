import { faker } from '@faker-js/faker';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { AbstractFixture } from '../../../../fixture';

export interface ModifierReprésentantLégal {
  readonly nomReprésentantLégal: string;
  readonly typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.ValueType;
  readonly dateModification: string;
}

export class ModifierReprésentantLégalFixture
  extends AbstractFixture<ModifierReprésentantLégal>
  implements ModifierReprésentantLégal
{
  #nomReprésentantLégal!: string;

  get nomReprésentantLégal(): string {
    return this.#nomReprésentantLégal;
  }

  #typeReprésentantLégal!: ReprésentantLégal.TypeReprésentantLégal.ValueType;

  get typeReprésentantLégal(): ReprésentantLégal.TypeReprésentantLégal.ValueType {
    return this.#typeReprésentantLégal;
  }

  #dateModification!: string;

  get dateModification(): string {
    return this.#dateModification;
  }

  créer(
    partialFixture?: Partial<Readonly<ModifierReprésentantLégal>>,
  ): Readonly<ModifierReprésentantLégal> {
    const fixture = {
      nomReprésentantLégal: faker.person.fullName(),
      typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.inconnu,
      dateModification: faker.date.recent().toISOString(),
      ...partialFixture,
    };

    this.#nomReprésentantLégal = fixture.nomReprésentantLégal;
    this.#typeReprésentantLégal = fixture.typeReprésentantLégal;
    this.#dateModification = fixture.dateModification;

    this.aÉtéCréé = true;

    return fixture;
  }
}
