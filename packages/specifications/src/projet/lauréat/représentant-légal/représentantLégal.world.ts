import { IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { ImporterReprésentantLégalFixture } from './fixtures/importerReprésentantLégal.fixture';
import { ModifierReprésentantLégalFixture } from './fixtures/modifierReprésentantLégal.fixture';
import { ChangementReprésentantLégalWorld } from './changement/changementReprésentantLégal.world';

type Expected = ReprésentantLégal.ConsulterReprésentantLégalReadModel & {
  demande?: ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande'];
};

export class ReprésentantLégalWorld {
  #changementReprésentantLégalWorld!: ChangementReprésentantLégalWorld;

  get changementReprésentantLégalWorld() {
    return this.#changementReprésentantLégalWorld;
  }

  #importerReprésentantLégalFixture: ImporterReprésentantLégalFixture;

  get importerReprésentantLégalFixture() {
    return this.#importerReprésentantLégalFixture;
  }

  #modifierReprésentantLégalFixture: ModifierReprésentantLégalFixture;

  get modifierReprésentantLégalFixture() {
    return this.#modifierReprésentantLégalFixture;
  }

  constructor() {
    // Subworld
    this.#changementReprésentantLégalWorld = new ChangementReprésentantLégalWorld();

    this.#importerReprésentantLégalFixture = new ImporterReprésentantLégalFixture();
    this.#modifierReprésentantLégalFixture = new ModifierReprésentantLégalFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): ReprésentantLégal.ConsulterReprésentantLégalReadModel {
    const expected: Expected = {
      identifiantProjet,
      nomReprésentantLégal: this.#importerReprésentantLégalFixture.nomReprésentantLégal,
      typeReprésentantLégal: this.#importerReprésentantLégalFixture.typeReprésentantLégal,
    };

    if (this.#modifierReprésentantLégalFixture.aÉtéCréé) {
      expected.nomReprésentantLégal = this.#modifierReprésentantLégalFixture.nomReprésentantLégal;
      expected.typeReprésentantLégal = this.#modifierReprésentantLégalFixture.typeReprésentantLégal;
    }

    if (
      this.#changementReprésentantLégalWorld.accorderChangementReprésentantLégalFixture.aÉtéCréé
    ) {
      expected.nomReprésentantLégal =
        this.#changementReprésentantLégalWorld.accorderChangementReprésentantLégalFixture.nomReprésentantLégal;
      expected.typeReprésentantLégal =
        this.#changementReprésentantLégalWorld.accorderChangementReprésentantLégalFixture.typeReprésentantLégal;
    }

    return expected;
  }
}
