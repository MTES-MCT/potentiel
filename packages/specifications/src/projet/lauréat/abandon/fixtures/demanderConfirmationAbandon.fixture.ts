import { faker } from '@faker-js/faker';

import { Fixture } from '../../../../fixture';

interface DemanderConfirmationAbandon {
  confirmationDemandéeLe: string;
  confirmationDemandéePar: string;
  réponseSignée: { format: string; content: ReadableStream };
}

export class DemanderConfirmationAbandonFixture
  implements DemanderConfirmationAbandon, Fixture<DemanderConfirmationAbandon>
{
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  #confirmationDemandéeLe!: string;

  get confirmationDemandéeLe(): string {
    return this.#confirmationDemandéeLe;
  }

  set confirmationDemandéeLe(value: string) {
    this.#confirmationDemandéeLe = value;
  }

  #confirmationDemandéePar!: string;

  get confirmationDemandéePar(): string {
    return this.#confirmationDemandéePar;
  }

  set confirmationDemandéePar(value: string) {
    this.#confirmationDemandéePar = value;
  }

  #réponseSignée!: DemanderConfirmationAbandon['réponseSignée'];

  get réponseSignée(): DemanderConfirmationAbandon['réponseSignée'] {
    return this.#réponseSignée;
  }

  set réponseSignée(value: DemanderConfirmationAbandon['réponseSignée']) {
    this.#réponseSignée = value;
  }

  créer(
    partialData?: Partial<Readonly<DemanderConfirmationAbandon>>,
  ): Readonly<DemanderConfirmationAbandon> {
    const fixture: DemanderConfirmationAbandon = {
      confirmationDemandéeLe: faker.date.soon().toISOString(),
      confirmationDemandéePar: faker.internet.email(),
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content: faker.potentiel.fileContent(),
      },
      ...partialData,
    };

    this.#confirmationDemandéeLe = fixture.confirmationDemandéeLe;
    this.#confirmationDemandéePar = fixture.confirmationDemandéePar;
    this.#réponseSignée = fixture.réponseSignée;

    this.#aÉtéCréé = true;
    return fixture;
  }
}
