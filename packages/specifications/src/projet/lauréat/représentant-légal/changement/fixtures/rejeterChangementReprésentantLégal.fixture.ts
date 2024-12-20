import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../../fixture';

interface RejeterChangementReprésentantLégal {
  readonly rejetéeLe: string;
  readonly rejetéePar: string;
}

export class RejeterChangementReprésentantLégalFixture
  extends AbstractFixture<RejeterChangementReprésentantLégal>
  implements RejeterChangementReprésentantLégal
{
  #rejetéLe!: string;

  get rejetéeLe(): string {
    return this.#rejetéLe;
  }

  #rejetéPar!: string;

  get rejetéePar(): string {
    return this.#rejetéPar;
  }

  créer(
    partialFixture?: Partial<RejeterChangementReprésentantLégal>,
  ): RejeterChangementReprésentantLégal {
    const fixture: RejeterChangementReprésentantLégal = {
      rejetéeLe: faker.date.soon().toISOString(),
      rejetéePar: faker.internet.email(),
      ...partialFixture,
    };

    this.#rejetéLe = fixture.rejetéeLe;
    this.#rejetéPar = fixture.rejetéePar;

    this.aÉtéCréé = true;
    return fixture;
  }
}
