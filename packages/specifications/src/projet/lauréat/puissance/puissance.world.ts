import { IdentifiantProjet } from '@potentiel-domain/common';
import { Puissance } from '@potentiel-domain/laureat';

import { ImporterPuissanceFixture } from './fixture/importerPuissance.fixture';
import { ModifierPuissanceFixture } from './fixture/modifierPuissance.fixture';

export class PuissanceWorld {
  #importerPuissanceFixture: ImporterPuissanceFixture;
  #modifierPuissanceFixture: ModifierPuissanceFixture;

  get importerPuissanceFixture() {
    return this.#importerPuissanceFixture;
  }

  get modifierPuissanceFixture() {
    return this.#modifierPuissanceFixture;
  }

  constructor() {
    this.#importerPuissanceFixture = new ImporterPuissanceFixture();
    this.#modifierPuissanceFixture = new ModifierPuissanceFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): Puissance.ConsulterPuissanceReadModel {
    const expected = {
      identifiantProjet,
      puissance: this.#modifierPuissanceFixture.aÉtéCréé
        ? this.#modifierPuissanceFixture.puissance
        : this.#importerPuissanceFixture.puissance,
    };

    return expected;
  }
}
