import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface AnnulerDemandeChangementActionnaire {
  readonly annuléeLe: string;
  readonly annuléePar: string;
}

export class AnnulerDemandeChangementActionnaireFixture
  extends AbstractFixture<AnnulerDemandeChangementActionnaire>
  implements AnnulerDemandeChangementActionnaire
{
  #annuléeLe!: string;

  get annuléeLe(): string {
    return this.#annuléeLe;
  }

  #annuléePar!: string;

  get annuléePar(): string {
    return this.#annuléePar;
  }

  créer(
    partialData?: Partial<AnnulerDemandeChangementActionnaire>,
  ): Readonly<AnnulerDemandeChangementActionnaire> {
    const fixture = {
      annuléeLe: faker.date.recent().toISOString(),
      annuléePar: faker.internet.email(),
      ...partialData,
    };

    this.#annuléeLe = fixture.annuléeLe;
    this.#annuléePar = fixture.annuléePar;

    this.aÉtéCréé = true;
    return fixture;
  }
}
