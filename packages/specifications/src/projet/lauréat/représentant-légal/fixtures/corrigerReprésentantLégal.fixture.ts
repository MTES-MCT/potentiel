import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface CorrigerReprésentantLégal {
  readonly nomReprésentantLégal: string;
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

  #dateCorrection!: string;

  get dateCorrection(): string {
    return this.#dateCorrection;
  }

  créer(
    partialFixture?: Partial<Readonly<CorrigerReprésentantLégal>>,
  ): Readonly<CorrigerReprésentantLégal> {
    const fixture = {
      nomReprésentantLégal: faker.person.fullName(),
      dateCorrection: faker.date.recent().toISOString(),
      ...partialFixture,
    };

    this.#nomReprésentantLégal = fixture.nomReprésentantLégal;
    this.#dateCorrection = fixture.dateCorrection;

    this.aÉtéCréé = true;

    return fixture;
  }
}
