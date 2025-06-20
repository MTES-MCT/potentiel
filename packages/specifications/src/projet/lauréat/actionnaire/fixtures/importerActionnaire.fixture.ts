import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface ImporterActionnaire {
  readonly actionnaire: string;
  readonly importéLe: string;
}

export class ImporterActionnaireFixture
  extends AbstractFixture<ImporterActionnaire>
  implements ImporterActionnaire
{
  #actionnaire!: string;

  get actionnaire(): string {
    return this.#actionnaire;
  }

  #importéLe!: string;

  get importéLe(): string {
    return this.#importéLe;
  }

  créer(partialFixture?: Partial<Readonly<ImporterActionnaire>>): Readonly<ImporterActionnaire> {
    const fixture = {
      actionnaire: faker.company.name(),
      importéLe: faker.date.recent().toISOString(),
      ...partialFixture,
    };

    this.#actionnaire = fixture.actionnaire;
    this.#importéLe = fixture.importéLe;

    this.aÉtéCréé = true;

    return fixture;
  }
}
