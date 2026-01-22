import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../../fixture.js';

interface RejeterChangementReprésentantLégal {
  readonly motif: string;
  readonly rejetéLe: string;
  readonly rejetéPar: string;
}

export class RejeterChangementReprésentantLégalFixture
  extends AbstractFixture<RejeterChangementReprésentantLégal>
  implements RejeterChangementReprésentantLégal
{
  #motif!: string;

  get motif(): string {
    return this.#motif;
  }

  #rejetéLe!: string;

  get rejetéLe(): string {
    return this.#rejetéLe;
  }

  #rejetéPar!: string;

  get rejetéPar(): string {
    return this.#rejetéPar;
  }

  créer(
    partialFixture?: Partial<RejeterChangementReprésentantLégal>,
  ): RejeterChangementReprésentantLégal {
    const fixture: RejeterChangementReprésentantLégal = {
      motif: faker.lorem.sentence(),
      rejetéLe: faker.date.soon().toISOString(),
      rejetéPar: faker.internet.email(),
      ...partialFixture,
    };

    this.#motif = fixture.motif;
    this.#rejetéLe = fixture.rejetéLe;
    this.#rejetéPar = fixture.rejetéPar;

    this.aÉtéCréé = true;
    return fixture;
  }
}
