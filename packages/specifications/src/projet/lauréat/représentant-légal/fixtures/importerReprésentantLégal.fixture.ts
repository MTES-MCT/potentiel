import { faker } from '@faker-js/faker';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { AbstractFixture } from '../../../../fixture';

interface ImporterReprésentantLégal {
  readonly nomReprésentantLégal: string;
  readonly typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.ValueType;
  readonly importéLe: string;
}

export class ImporterReprésentantLégalFixture
  extends AbstractFixture<ImporterReprésentantLégal>
  implements ImporterReprésentantLégal
{
  #nomReprésentantLégal!: string;

  get nomReprésentantLégal(): string {
    return this.#nomReprésentantLégal;
  }

  #typeReprésentantLégal!: ReprésentantLégal.TypeReprésentantLégal.ValueType;

  get typeReprésentantLégal(): ReprésentantLégal.TypeReprésentantLégal.ValueType {
    return this.#typeReprésentantLégal;
  }

  #importéLe!: string;

  get importéLe(): string {
    return this.#importéLe;
  }

  créer(
    partialFixture?: Partial<Readonly<ImporterReprésentantLégal>>,
  ): Readonly<ImporterReprésentantLégal> {
    const fixture = {
      nomReprésentantLégal: faker.person.fullName(),
      typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.inconnu,
      importéLe: faker.date.recent().toISOString(),
      ...partialFixture,
    };

    this.#nomReprésentantLégal = fixture.nomReprésentantLégal;
    this.#typeReprésentantLégal = fixture.typeReprésentantLégal;
    this.#importéLe = fixture.importéLe;

    this.aÉtéCréé = true;

    return fixture;
  }
}
