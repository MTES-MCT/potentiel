import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

interface RejeterDemandeChangementActionnaire {
  readonly réponseSignée: { format: string; content: ReadableStream };
  readonly rejetéeLe: string;
  readonly rejetéePar: string;
}

export class RejeterDemandeChangementActionnaireFixture
  extends AbstractFixture<RejeterDemandeChangementActionnaire>
  implements RejeterDemandeChangementActionnaire
{
  #format!: string;
  #content!: string;

  get réponseSignée(): RejeterDemandeChangementActionnaire['réponseSignée'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  #rejetéeLe!: string;

  get rejetéeLe(): string {
    return this.#rejetéeLe;
  }

  #rejetéePar!: string;

  get rejetéePar(): string {
    return this.#rejetéePar;
  }

  créer(
    partialFixture?: Partial<RejeterDemandeChangementActionnaire>,
  ): RejeterDemandeChangementActionnaire {
    const content = faker.word.words();

    const fixture: RejeterDemandeChangementActionnaire = {
      rejetéeLe: faker.date.soon().toISOString(),
      rejetéePar: faker.internet.email(),
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ...partialFixture,
    };

    this.#rejetéeLe = fixture.rejetéeLe;
    this.#rejetéePar = fixture.rejetéePar;
    this.#format = fixture.réponseSignée.format;
    this.#content = content;

    this.aÉtéCréé = true;
    return fixture;
  }
}
