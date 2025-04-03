import { IdentifiantProjet } from '@potentiel-domain/common';
import { Puissance } from '@potentiel-domain/laureat';

import { ImporterPuissanceFixture } from './fixture/importerPuissance.fixture';
import { ModifierPuissanceFixture } from './fixture/modifierPuissance.fixture';
import { ChangementPuissanceWorld } from './changement/changementPuissance.world';

export class PuissanceWorld {
  #changementPuissanceWorld!: ChangementPuissanceWorld;
  get changementPuissanceWorld() {
    return this.#changementPuissanceWorld;
  }

  #importerPuissanceFixture: ImporterPuissanceFixture;
  get importerPuissanceFixture() {
    return this.#importerPuissanceFixture;
  }

  #modifierPuissanceFixture: ModifierPuissanceFixture;
  get modifierPuissanceFixture() {
    return this.#modifierPuissanceFixture;
  }

  constructor() {
    this.#importerPuissanceFixture = new ImporterPuissanceFixture();
    this.#modifierPuissanceFixture = new ModifierPuissanceFixture();
    this.#changementPuissanceWorld = new ChangementPuissanceWorld();
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
