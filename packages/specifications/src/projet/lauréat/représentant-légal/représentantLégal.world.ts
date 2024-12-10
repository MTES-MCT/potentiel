import { IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { ImporterReprésentantLégalFixture } from './fixtures/importerReprésentantLégal.fixture';
import { ModifierReprésentantLégalFixture } from './fixtures/modifierReprésentantLégal.fixture';
import { DemandeChangementReprésentantLégalWorld } from './demandeChangement/demandeChangementReprésentantLégal.world';

type Expected = ReprésentantLégal.ConsulterReprésentantLégalReadModel & {
  demande?: ReprésentantLégal.ConsulterDemandeChangementReprésentantLégalReadModel;
};

export class ReprésentantLégalWorld {
  #demandeChangementReprésentantLégalWorld!: DemandeChangementReprésentantLégalWorld;

  get demandeChangementReprésentantLégalWorld() {
    return this.#demandeChangementReprésentantLégalWorld;
  }

  #importerReprésentantLégalFixture: ImporterReprésentantLégalFixture;
  #modifierReprésentantLégalFixture: ModifierReprésentantLégalFixture;

  get importerReprésentantLégalFixture() {
    return this.#importerReprésentantLégalFixture;
  }

  get modifierReprésentantLégalFixture() {
    return this.#modifierReprésentantLégalFixture;
  }

  constructor() {
    // Subworld
    this.#demandeChangementReprésentantLégalWorld = new DemandeChangementReprésentantLégalWorld();

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

    return expected;
  }
}
