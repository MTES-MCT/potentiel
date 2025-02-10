
}

import { faker } from '@faker-js/faker';

import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';
import { AbstractFixture } from '../../../../fixture';

interface TransmettreAttestationConformitéActionnaire {
  readonly réponseSignée: { format: string; content: ReadableStream };
  readonly accordéeLe: string;
  readonly accordéePar: string;
}

export class TransmettreAttestationConformitéActionnaireFixture
  extends AbstractFixture<TransmettreAttestationConformitéActionnaire>
  implements TransmettreAttestationConformitéActionnaire
{
  #format!: string;
  #content!: string;

  get réponseSignée(): TransmettreAttestationConformitéActionnaire['réponseSignée'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  #accordéeLe!: string;

  get accordéeLe(): string {
    return this.#accordéeLe;
  }

  #accordéePar!: string;

  get accordéePar(): string {
    return this.#accordéePar;
  }

  créer(partialFixture?: Partial<TransmettreAttestationConformitéActionnaire>): TransmettreAttestationConformitéActionnaire {
    const content = faker.word.words();

    const fixture: TransmettreAttestationConformitéActionnaire = {
      accordéeLe: faker.date.soon().toISOString(),
      accordéePar: faker.internet.email(),
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ...partialFixture,
    };

    this.#accordéeLe = fixture.accordéeLe;
    this.#accordéePar = fixture.accordéePar;
    this.#format = fixture.réponseSignée.format;
    this.#content = content;

    this.aÉtéCréé = true;
    return fixture;
  }
}
