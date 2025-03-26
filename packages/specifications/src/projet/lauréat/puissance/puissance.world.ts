import { IdentifiantProjet } from '@potentiel-domain/common';
import { Puissance } from '@potentiel-domain/laureat';

import { ImporterPuissanceFixture } from './fixture/importerPuissance.fixture';

export class PuissanceWorld {
  #importerPuissanceFixture: ImporterPuissanceFixture;

  get importerPuissanceFixture() {
    return this.#importerPuissanceFixture;
  }

  constructor() {
    this.#importerPuissanceFixture = new ImporterPuissanceFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): Puissance.ConsulterPuissanceReadModel {
    const expected = {
      identifiantProjet,
      puissance: this.#importerPuissanceFixture.puissance,
    };

    return expected;
  }
}
