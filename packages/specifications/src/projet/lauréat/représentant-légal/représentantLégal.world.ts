import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { ImporterReprésentantLégalFixture } from './fixtures/importerReprésentantLégal.fixture';

export class ReprésentantLégalWorld {
  #importerReprésentantLégalFixture: ImporterReprésentantLégalFixture;

  get importerReprésentantLégalFixture() {
    return this.#importerReprésentantLégalFixture;
  }

  constructor() {
    this.#importerReprésentantLégalFixture = new ImporterReprésentantLégalFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): ReprésentantLégal.ConsulterReprésentantLégalReadModel {
    const expected: ReprésentantLégal.ConsulterReprésentantLégalReadModel = {
      identifiantProjet,
      nomReprésentantLégal: this.#importerReprésentantLégalFixture.nomReprésentantLégal,
      import: {
        importéLe: DateTime.convertirEnValueType(this.#importerReprésentantLégalFixture.importéLe),
        importéPar: Email.system(),
      },
    };

    return expected;
  }
}
