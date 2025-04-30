import { Producteur } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ImporterProducteurFixture } from './fixture/importerProducteur.fixture';

export class ProducteurWorld {
  #importerProducteurFixture: ImporterProducteurFixture;
  get importerProducteurFixture() {
    return this.#importerProducteurFixture;
  }

  constructor() {
    this.#importerProducteurFixture = new ImporterProducteurFixture();
  }

  mapToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    const expected: Producteur.ConsulterProducteurReadModel = {
      identifiantProjet,
      producteur: this.#importerProducteurFixture.producteur,
    };

    return expected;
  }
}
