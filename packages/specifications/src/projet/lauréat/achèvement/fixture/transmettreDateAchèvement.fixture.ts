import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface TransmettreDateAchèvement {
  readonly dateAchèvement: string;
}

export class TransmettreDateAchèvementFixture
  extends AbstractFixture<TransmettreDateAchèvement>
  implements TransmettreDateAchèvement
{
  #dateAchèvement!: string;

  get dateAchèvement(): string {
    return this.#dateAchèvement;
  }

  créer(partialFixture?: Partial<TransmettreDateAchèvement>): TransmettreDateAchèvement {
    const fixture: TransmettreDateAchèvement = {
      dateAchèvement: faker.date.past().toISOString(),
      ...partialFixture,
    };

    this.#dateAchèvement = fixture.dateAchèvement;

    this.aÉtéCréé = true;

    return fixture;
  }
}
