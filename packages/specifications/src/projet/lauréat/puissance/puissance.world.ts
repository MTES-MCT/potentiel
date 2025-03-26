import { IdentifiantProjet } from '@potentiel-domain/common';
import { Puissance } from '@potentiel-domain/laureat';

import { ImporterPuissanceFixture } from './fixture/importerPuissance.fixture';

export class PuissanceWorld {
  #importerPuissanceFixture: ImporterPuissanceFixture;
  #puissance: number;

  get importerPuissanceFixture() {
    return this.#importerPuissanceFixture;
  }

  get puissance() {
    return this.#puissance;
  }

  set puissance(value: number) {
    this.#puissance = value;
  }

  constructor() {
    this.#importerPuissanceFixture = new ImporterPuissanceFixture();
    this.#puissance = 0;
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): Puissance.ConsulterPuissanceReadModel {
    console.log(this.#puissance);
    return {
      identifiantProjet,
      puissance: this.#puissance,
    };
  }
}
