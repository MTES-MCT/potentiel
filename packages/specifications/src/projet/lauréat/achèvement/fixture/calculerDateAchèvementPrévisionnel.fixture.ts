import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';
import { LauréatWorld } from '../../lauréat.world';

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

  constructor(public readonly lauréatWorld: LauréatWorld) {
    super();
  }

  créer(
    partialFixture?: Partial<CalculerDateAchèvementPrévisionnel>,
  ): CalculerDateAchèvementPrévisionnel {
    const fixture: CalculerDateAchèvementPrévisionnel = {
      dateAchèvementPrévisionnel: faker.date
        .between({
          from: new Date(
            new Date(this.lauréatWorld.notifierLauréatFixture.notifiéLe).getTime() + 1,
          ),
          to: new Date(),
        })
        .toISOString(),
      ...partialFixture,
    };

    this.#dateAchèvementPrévisionnel = fixture.dateAchèvementPrévisionnel;

    this.aÉtéCréé = true;

    return fixture;
  }
}
