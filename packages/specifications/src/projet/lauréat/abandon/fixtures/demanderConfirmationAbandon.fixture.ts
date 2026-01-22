import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture.js';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable.js';

interface DemanderConfirmationAbandon {
  readonly confirmationDemandéeLe: string;
  readonly confirmationDemandéePar: string;
  readonly réponseSignée: { format: string; content: ReadableStream };
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

  #format!: string;
  #content!: string;

  get réponseSignée(): DemanderConfirmationAbandon['réponseSignée'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  créer(
    partialData?: Partial<Readonly<DemanderConfirmationAbandon>>,
  ): Readonly<DemanderConfirmationAbandon> {
    const content = faker.word.words();

    const fixture: DemanderConfirmationAbandon = {
      confirmationDemandéeLe: faker.date.soon().toISOString(),
      confirmationDemandéePar: faker.internet.email(),
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ...partialData,
    };

    this.#confirmationDemandéeLe = fixture.confirmationDemandéeLe;
    this.#confirmationDemandéePar = fixture.confirmationDemandéePar;
    this.#format = fixture.réponseSignée.format;
    this.#content = content;

    this.aÉtéCréé = true;
    return fixture;
  }
}
