import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface AnnulerRecours {
  readonly annuléeLe: string;
  readonly annuléePar: string;
}

export class AnnulerRecoursFixture
  extends AbstractFixture<AnnulerRecours>
  implements AnnulerRecours
{
  #annuléeLe!: string;

  get annuléeLe(): string {
    return this.#annuléeLe;
  }

  #annuléePar!: string;

  get annuléePar(): string {
    return this.#annuléePar;
  }

  créer(partialFixture?: Partial<Readonly<AnnulerRecours>>): Readonly<AnnulerRecours> {
    const fixture: AnnulerRecours = {
      annuléeLe: faker.date.soon().toISOString(),
      annuléePar: faker.internet.email(),
      ...partialFixture,
    };

    this.#annuléeLe = fixture.annuléeLe;
    this.#annuléePar = fixture.annuléePar;

    this.aÉtéCréé = true;
    return fixture;
  }
}
