import { faker } from '@faker-js/faker';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { AbstractFixture } from '../../../../fixture';

interface CorrigerReprésentantLégal {
  readonly nomReprésentantLégal: string;
  readonly typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.ValueType;
  readonly dateCorrection: string;
}

export class CorrigerReprésentantLégalFixture
  extends AbstractFixture<CorrigerReprésentantLégal>
  implements CorrigerReprésentantLégal
{
  #nomReprésentantLégal!: string;

  get nomReprésentantLégal(): string {
    return this.#nomReprésentantLégal;
  }

  #typeReprésentantLégal!: ReprésentantLégal.TypeReprésentantLégal.ValueType;

  get typeReprésentantLégal(): ReprésentantLégal.TypeReprésentantLégal.ValueType {
    return this.#typeReprésentantLégal;
  }

  #dateCorrection!: string;

  get dateCorrection(): string {
    return this.#dateCorrection;
  }

  créer(
    partialFixture?: Partial<Readonly<CorrigerReprésentantLégal>>,
  ): Readonly<CorrigerReprésentantLégal> {
    const fixture = {
      nomReprésentantLégal: faker.person.fullName(),
      typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.inconnu,
      dateCorrection: faker.date.recent().toISOString(),
      ...partialFixture,
    };

    this.#nomReprésentantLégal = fixture.nomReprésentantLégal;
    this.#typeReprésentantLégal = fixture.typeReprésentantLégal;
    this.#dateCorrection = fixture.dateCorrection;

    this.aÉtéCréé = true;

    return fixture;
  }
}
