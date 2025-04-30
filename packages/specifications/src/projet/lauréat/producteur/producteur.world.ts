import { Producteur } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ImporterProducteurFixture } from './fixture/importerProducteur.fixture';
import { EnregistrerChangementProducteurFixture } from './fixture/enregistrerChangementProducteur.fixture';

export class ProducteurWorld {
  #importerProducteurFixture: ImporterProducteurFixture;
  get importerProducteurFixture() {
    return this.#importerProducteurFixture;
  }

  #enregistrerChangementProducteurFixture: EnregistrerChangementProducteurFixture;
  get enregistrerChangementProducteurFixture() {
    return this.#enregistrerChangementProducteurFixture;
  }

  constructor() {
    this.#importerProducteurFixture = new ImporterProducteurFixture();
    this.#enregistrerChangementProducteurFixture = new EnregistrerChangementProducteurFixture();
  }

  mapToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    const expected: Producteur.ConsulterProducteurReadModel = {
      identifiantProjet,
      producteur: this.#enregistrerChangementProducteurFixture.aÉtéCréé
        ? this.#enregistrerChangementProducteurFixture.producteur
        : this.#importerProducteurFixture.producteur,
    };

    return expected;
  }
}
