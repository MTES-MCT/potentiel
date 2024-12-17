import { faker } from '@faker-js/faker';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { AbstractFixture } from '../../../../../fixture';
import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable';

interface AccorderChangementReprésentantLégal {
  readonly nomReprésentantLégal: string;
  readonly typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.ValueType;
  readonly réponseSignée: { format: string; content: ReadableStream };
  readonly accordéeLe: string;
  readonly accordéePar: string;
}

export class AccorderChangementReprésentantLégalFixture
  extends AbstractFixture<AccorderChangementReprésentantLégal>
  implements AccorderChangementReprésentantLégal
{
  #format!: string;
  #content!: string;

  get réponseSignée(): AccorderChangementReprésentantLégal['réponseSignée'] {
    return {
      format: this.#format,
      content: convertStringToReadableStream(this.#content),
    };
  }

  #nomReprésentantLégal!: string;

  get nomReprésentantLégal(): string {
    return this.#nomReprésentantLégal;
  }

  #typeReprésentantLégal!: ReprésentantLégal.TypeReprésentantLégal.ValueType;

  get typeReprésentantLégal(): ReprésentantLégal.TypeReprésentantLégal.ValueType {
    return this.#typeReprésentantLégal;
  }

  #accordéLe!: string;

  get accordéeLe(): string {
    return this.#accordéLe;
  }

  #accordéPar!: string;

  get accordéePar(): string {
    return this.#accordéPar;
  }

  créer(
    partialFixture?: Partial<AccorderChangementReprésentantLégal>,
  ): AccorderChangementReprésentantLégal {
    const content = faker.word.words();

    const fixture: AccorderChangementReprésentantLégal = {
      nomReprésentantLégal: faker.person.fullName(),
      typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.personnePhysique,
      accordéeLe: faker.date.soon().toISOString(),
      accordéePar: faker.internet.email(),
      réponseSignée: {
        format: faker.potentiel.fileFormat(),
        content: convertStringToReadableStream(content),
      },
      ...partialFixture,
    };

    this.#accordéLe = fixture.accordéeLe;
    this.#accordéPar = fixture.accordéePar;
    this.#format = fixture.réponseSignée.format;
    this.#content = content;

    this.aÉtéCréé = true;
    return fixture;
  }
}
