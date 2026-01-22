import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../../fixture.js';

export type AnnulerDemandeChangementReprésentantLégalFixture = Partial<
  Readonly<AnnulerChangementReprésentantLégal>
> & {
  identifiantProjet: string;
};

export interface AnnulerChangementReprésentantLégal {
  readonly annuléLe: string;
  readonly annuléPar: string;
}

export class AnnulerChangementReprésentantLégalFixture
  extends AbstractFixture<AnnulerChangementReprésentantLégal>
  implements AnnulerChangementReprésentantLégal
{
  #annuléLe!: string;

  get annuléLe(): string {
    return this.#annuléLe;
  }

  #annuléPar!: string;

  get annuléPar(): string {
    return this.#annuléPar;
  }

  créer(
    partialFixture?: AnnulerDemandeChangementReprésentantLégalFixture,
  ): Readonly<AnnulerChangementReprésentantLégal> {
    const fixture = {
      annuléLe: faker.date.recent().toISOString(),
      annuléPar: faker.internet.email(),
      ...partialFixture,
    };

    this.#annuléLe = fixture.annuléLe;
    this.#annuléPar = fixture.annuléPar;

    this.aÉtéCréé = true;

    return fixture;
  }
}
