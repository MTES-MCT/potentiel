import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

export interface TransmettreActionnaire {
  readonly actionnaire: string;
  readonly dateTransmission: string;
}

export class TransmettreActionnaireFixture
  extends AbstractFixture<TransmettreActionnaire>
  implements TransmettreActionnaire
{
  #actionnaire!: string;

  get actionnaire(): string {
    return this.#actionnaire;
  }

  #dateTransmission!: string;

  get dateTransmission(): string {
    return this.#dateTransmission;
  }

  créer(
    partialFixture?: Partial<Readonly<TransmettreActionnaire>>,
  ): Readonly<TransmettreActionnaire> {
    const fixture = {
      actionnaire: faker.person.fullName(),
      dateTransmission: faker.date.recent().toISOString(),
      ...partialFixture,
    };
    this.#actionnaire = fixture.actionnaire;
    this.#dateTransmission = fixture.dateTransmission;

    this.aÉtéCréé = true;

    return fixture;
  }
}
