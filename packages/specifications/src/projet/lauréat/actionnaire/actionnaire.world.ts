import { IdentifiantProjet } from '@potentiel-domain/common';
import { Actionnaire } from '@potentiel-domain/laureat';

import { ImporterActionnaireFixture } from './fixtures/importerActionnaire.fixture';
import { ModifierActionnaireFixture } from './fixtures/modifierActionnaire.fixture';

export class ActionnaireWorld {
  #importerActionnaireFixture: ImporterActionnaireFixture;
  #modifierActionnaireFixture: ModifierActionnaireFixture;

  get importerActionnaireFixture() {
    return this.#importerActionnaireFixture;
  }

  get modifierActionnaireFixture() {
    return this.#modifierActionnaireFixture;
  }

  constructor() {
    this.#importerActionnaireFixture = new ImporterActionnaireFixture();
    this.#modifierActionnaireFixture = new ModifierActionnaireFixture();
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
