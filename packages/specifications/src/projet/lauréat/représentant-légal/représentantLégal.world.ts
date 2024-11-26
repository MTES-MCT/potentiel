import { IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { ImporterReprésentantLégalFixture } from './fixtures/importerReprésentantLégal.fixture';
import { ModifierReprésentantLégalFixture } from './fixtures/modifierReprésentantLégal.fixture';

export class ReprésentantLégalWorld {
  #importerReprésentantLégalFixture: ImporterReprésentantLégalFixture;
  #modifierReprésentantLégalFixture: ModifierReprésentantLégalFixture;

  get importerReprésentantLégalFixture() {
    return this.#importerReprésentantLégalFixture;
  }

  get modifierReprésentantLégalFixture() {
    return this.#modifierReprésentantLégalFixture;
  }

  constructor() {
    this.#importerReprésentantLégalFixture = new ImporterReprésentantLégalFixture();
    this.#modifierReprésentantLégalFixture = new ModifierReprésentantLégalFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): ReprésentantLégal.ConsulterReprésentantLégalReadModel {
    const expected: ReprésentantLégal.ConsulterReprésentantLégalReadModel = {
      identifiantProjet,
      nomReprésentantLégal: this.#importerReprésentantLégalFixture.nomReprésentantLégal,
      typeReprésentantLégal: this.#importerReprésentantLégalFixture.typeReprésentantLégal,
    };

    if (this.#modifierReprésentantLégalFixture.aÉtéCréé) {
      expected.nomReprésentantLégal = this.#modifierReprésentantLégalFixture.nomReprésentantLégal;
    }

    return expected;
  }
}
