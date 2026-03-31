import { faker } from '@faker-js/faker';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../fixture.js';

interface DemanderConfirmationAbandon {
  readonly confirmationDemandéeLe: string;
  readonly confirmationDemandéePar: string;
  readonly réponseSignée: PièceJustificative;
}

export class DemanderConfirmationAbandonFixture
  extends AbstractFixture<DemanderConfirmationAbandon>
  implements DemanderConfirmationAbandon
{
  #confirmationDemandéeLe!: string;

  get confirmationDemandéeLe(): string {
    return this.#confirmationDemandéeLe;
  }

  #confirmationDemandéePar!: string;

  get confirmationDemandéePar(): string {
    return this.#confirmationDemandéePar;
  }

  #réponseSignée!: PièceJustificative;
  get réponseSignée(): PièceJustificative {
    return this.#réponseSignée;
  }

  créer(
    partialData?: Partial<Readonly<DemanderConfirmationAbandon>>,
  ): Readonly<DemanderConfirmationAbandon> {
    const fixture: DemanderConfirmationAbandon = {
      confirmationDemandéeLe: faker.date.soon().toISOString(),
      confirmationDemandéePar: faker.internet.email(),
      réponseSignée: faker.potentiel.document(),
      ...partialData,
    };

    this.#confirmationDemandéeLe = fixture.confirmationDemandéeLe;
    this.#confirmationDemandéePar = fixture.confirmationDemandéePar;
    this.#réponseSignée = fixture.réponseSignée;

    this.aÉtéCréé = true;
    return fixture;
  }
}
