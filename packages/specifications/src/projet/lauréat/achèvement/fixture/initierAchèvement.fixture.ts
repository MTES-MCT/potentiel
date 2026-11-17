import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';

import { AbstractFixture } from '../../../../fixture.js';

interface InitierAchèvement {
  readonly initiéLe: string;
  readonly initiéPar: string;
}

export class InitierAchèvementFixture
  extends AbstractFixture<InitierAchèvement>
  implements InitierAchèvement
{
  #initiéLe!: string;

  get initiéLe(): string {
    return this.#initiéLe;
  }

  #initiéPar!: string;

  get initiéPar(): string {
    return this.#initiéPar;
  }

  créer(partialFixture?: Partial<InitierAchèvement>): InitierAchèvement {
    const fixture: InitierAchèvement = {
      initiéLe: faker.date.recent().toISOString(),
      initiéPar: faker.internet.email(),
      ...partialFixture,
    };

    this.#initiéLe = fixture.initiéLe;
    this.#initiéPar = fixture.initiéPar;

    this.aÉtéCréé = true;

    return this;
  }

  mapToExpected() {
    return {
      achèvementEnAttente: true,
      initiéLe: DateTime.convertirEnValueType(this.initiéLe),
    };
  }
}
