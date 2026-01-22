import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';

interface AnnulerRecours {
  readonly annuléLe: string;
  readonly annuléPar: string;
}

export class AnnulerRecoursFixture
  extends AbstractFixture<AnnulerRecours>
  implements AnnulerRecours
{
  #annuléLe!: string;

  get annuléLe(): string {
    return this.#annuléLe;
  }

  #annuléPar!: string;

  get annuléPar(): string {
    return this.#annuléPar;
  }

  créer(partialFixture?: Partial<Readonly<AnnulerRecours>>): Readonly<AnnulerRecours> {
    const fixture: AnnulerRecours = {
      annuléLe: faker.date.soon().toISOString(),
      annuléPar: faker.internet.email(),
      ...partialFixture,
    };

    this.#annuléLe = fixture.annuléLe;
    this.#annuléPar = fixture.annuléPar;

    this.aÉtéCréé = true;
    return fixture;
  }
}
