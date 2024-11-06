import { faker } from '@faker-js/faker';

import { AbstractFixture } from '../../../../fixture';

interface ImporterReprésentantLégal {
  readonly nom: string;
  readonly importéLe: string;
  readonly importéPar: string;
}

export class ImporterReprésentantLégalFixture
  extends AbstractFixture<ImporterReprésentantLégal>
  implements ImporterReprésentantLégal
{
  #nom!: string;

  get nom(): string {
    return this.#nom;
  }

  #importéLe!: string;

  get importéLe(): string {
    return this.#importéLe;
  }

  #importéPar!: string;

  get importéPar(): string {
    return this.#importéPar;
  }

  créer(
    partialFixture?: Partial<Readonly<ImporterReprésentantLégal>>,
  ): Readonly<ImporterReprésentantLégal> {
    const fixture = {
      nom: faker.name.fullName(),
      importéLe: faker.date.recent().toISOString(),
      importéPar: faker.internet.email(),
      ...partialFixture,
    };

    this.#nom = fixture.nom;
    this.#importéLe = fixture.importéLe;
    this.#importéPar = fixture.importéPar;
    this.aÉtéCréé = true;
    return fixture;
  }
}
