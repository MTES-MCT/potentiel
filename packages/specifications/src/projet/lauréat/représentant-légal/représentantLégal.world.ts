import { IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { ImporterReprésentantLégalFixture } from './fixtures/importerReprésentantLégal.fixture';
import { CorrigerReprésentantLégalFixture } from './fixtures/corrigerReprésentantLégal.fixture';

export class ReprésentantLégalWorld {
  #importerReprésentantLégalFixture: ImporterReprésentantLégalFixture;
  #corrigerReprésentantLégalFixture: CorrigerReprésentantLégalFixture;

  get importerReprésentantLégalFixture() {
    return this.#importerReprésentantLégalFixture;
  }

  get corrigerReprésentantLégalFixture() {
    return this.#corrigerReprésentantLégalFixture;
  }

  constructor() {
    this.#importerReprésentantLégalFixture = new ImporterReprésentantLégalFixture();
    this.#corrigerReprésentantLégalFixture = new CorrigerReprésentantLégalFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): ReprésentantLégal.ConsulterReprésentantLégalReadModel {
    const expected: ReprésentantLégal.ConsulterReprésentantLégalReadModel = {
      identifiantProjet,
      nomReprésentantLégal: this.#importerReprésentantLégalFixture.nomReprésentantLégal,
      typeReprésentantLégal: this.#importerReprésentantLégalFixture.typeReprésentantLégal,
    };

    if (this.#corrigerReprésentantLégalFixture.aÉtéCréé) {
      expected.nomReprésentantLégal = this.#corrigerReprésentantLégalFixture.nomReprésentantLégal;
    }

    return expected;
  }
}
