import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface TransmettreDateAchèvement {
  readonly dateAchèvement: string;
  readonly transmiseLe: string;
  readonly transmisePar: string;
}

export class TransmettreDateAchèvementFixture
  extends AbstractFixture<TransmettreDateAchèvement>
  implements TransmettreDateAchèvement
{
  #dateAchèvement!: string;

  get dateAchèvement(): string {
    return this.#dateAchèvement;
  }

  #transmiseLe!: string;

  get transmiseLe(): string {
    return this.#transmiseLe;
  }

  #transmisePar!: string;

  get transmisePar(): string {
    return this.#transmisePar;
  }
  créer(partialFixture?: Partial<TransmettreDateAchèvement>): TransmettreDateAchèvement {
    const fixture: TransmettreDateAchèvement = {
      dateAchèvement: faker.date.past().toISOString(),
      transmiseLe: faker.date.recent().toISOString(),
      transmisePar: faker.internet.email(),
      ...partialFixture,
    };

    this.#dateAchèvement = fixture.dateAchèvement;

    this.aÉtéCréé = true;

    return fixture;
  }
}
