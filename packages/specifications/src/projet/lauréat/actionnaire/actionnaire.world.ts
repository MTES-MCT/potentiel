import { IdentifiantProjet } from '@potentiel-domain/common';
import { Actionnaire } from '@potentiel-domain/laureat';

import { ImporterActionnaireFixture } from './fixtures/importerActionnaire.fixture';
import { ModifierActionnaireFixture } from './fixtures/modifierActionnaire.fixture';
import { demanderChangementActionnaireFixture } from './fixtures/demanderChangementActionnaire.fixture';

export class ActionnaireWorld {
  #importerActionnaireFixture: ImporterActionnaireFixture;
  #modifierActionnaireFixture: ModifierActionnaireFixture;
  #demanderChangementActionnaireFixture: demanderChangementActionnaireFixture;

  get importerActionnaireFixture() {
    return this.#importerActionnaireFixture;
  }

  get modifierActionnaireFixture() {
    return this.#modifierActionnaireFixture;
  }

  get demanderChangementActionnaireFixture() {
    return this.#demanderChangementActionnaireFixture;
  }

  constructor() {
    this.#importerActionnaireFixture = new ImporterActionnaireFixture();
    this.#modifierActionnaireFixture = new ModifierActionnaireFixture();
    this.#demanderChangementActionnaireFixture = new demanderChangementActionnaireFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): Actionnaire.ConsulterActionnaireReadModel {
    const expected: Actionnaire.ConsulterActionnaireReadModel = {
      identifiantProjet,
      actionnaire: this.#importerActionnaireFixture.actionnaire,
    };

    if (this.#modifierActionnaireFixture.aÉtéCréé) {
      expected.actionnaire = this.#modifierActionnaireFixture.actionnaire;
    }

    return expected;
  }
}
