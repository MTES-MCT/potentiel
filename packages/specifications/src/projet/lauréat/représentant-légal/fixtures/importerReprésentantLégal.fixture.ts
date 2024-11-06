import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface ImporterReprésentantLégal {
  readonly nomReprésentantLégal: string;
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

  #importéLe!: string;

  get importéLe(): string {
    return this.#importéLe;
  }

  créer(
    partialFixture?: Partial<Readonly<ImporterReprésentantLégal>>,
  ): Readonly<ImporterReprésentantLégal> {
    const fixture = {
      nomReprésentantLégal: faker.person.fullName(),
      importéLe: faker.date.recent().toISOString(),
      ...partialFixture,
    };

    this.#nomReprésentantLégal = fixture.nomReprésentantLégal;
    this.#importéLe = fixture.importéLe;

    this.aÉtéCréé = true;

    return fixture;
  }
}
