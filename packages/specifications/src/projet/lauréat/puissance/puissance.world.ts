import { IdentifiantProjet } from '@potentiel-domain/common';
import { Puissance } from '@potentiel-domain/laureat';

import { ImporterPuissanceFixture } from './fixture/importerPuissance.fixture';
import { ModifierPuissanceFixture } from './fixture/modifierPuissance.fixture';
import { DemanderChangementPuissanceFixture } from './fixture/demanderChangementPuissance.fixture';

export class PuissanceWorld {
  #importerPuissanceFixture: ImporterPuissanceFixture;
  #modifierPuissanceFixture: ModifierPuissanceFixture;
  #demanderChangementPuissanceFixture: DemanderChangementPuissanceFixture;

  get importerPuissanceFixture() {
    return this.#importerPuissanceFixture;
  }

  get modifierPuissanceFixture() {
    return this.#modifierPuissanceFixture;
  }

  get demanderChangementPuissanceFixture() {
    return this.#demanderChangementPuissanceFixture;
  }

  constructor() {
    this.#importerPuissanceFixture = new ImporterPuissanceFixture();
    this.#modifierPuissanceFixture = new ModifierPuissanceFixture();
    this.#demanderChangementPuissanceFixture = new DemanderChangementPuissanceFixture();
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
