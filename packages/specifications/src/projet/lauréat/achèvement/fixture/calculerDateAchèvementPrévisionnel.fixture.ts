import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface CalculerDateAchèvementPrévisionnel {
  readonly dateAchèvementPrévisionnel: string;
}

export class CalculerDateAchèvementPrévisionnelFixture
  extends AbstractFixture<CalculerDateAchèvementPrévisionnel>
  implements CalculerDateAchèvementPrévisionnel
{
  #dateAchèvementPrévisionnel!: string;

  get dateAchèvementPrévisionnel(): string {
    return this.#dateAchèvementPrévisionnel;
  }

  créer(
    partialFixture?: Partial<CalculerDateAchèvementPrévisionnel>,
  ): CalculerDateAchèvementPrévisionnel {
    const fixture: CalculerDateAchèvementPrévisionnel = {
      dateAchèvementPrévisionnel: faker.date.past().toISOString(),
      ...partialFixture,
    };

    this.#dateAchèvementPrévisionnel = fixture.dateAchèvementPrévisionnel;

    this.aÉtéCréé = true;

    return fixture;
  }
}
