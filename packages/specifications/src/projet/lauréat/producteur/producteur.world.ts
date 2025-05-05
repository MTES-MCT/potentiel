import { Producteur } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { EnregistrerChangementProducteurFixture } from './fixture/enregistrerChangementProducteur.fixture';
import { ImporterProducteurFixture } from './fixture/importerProducteur.fixture';

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

  mapChangementToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    if (!this.#enregistrerChangementProducteurFixture.aÉtéCréé) {
      throw new Error(`Aucune information enregistrée n'a été créée dans ProducteurWorld`);
    }

    const expected: Producteur.ConsulterChangementProducteurReadModel = {
      identifiantProjet,
      changement: {
        enregistréLe: DateTime.convertirEnValueType(
          this.#enregistrerChangementProducteurFixture.demandéLe,
        ),
        enregistréPar: Email.convertirEnValueType(
          this.#enregistrerChangementProducteurFixture.demandéPar,
        ),
        nouveauProducteur: this.#enregistrerChangementProducteurFixture.producteur,
        pièceJustificative: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Producteur.TypeDocumentProducteur.pièceJustificative.formatter(),
          DateTime.convertirEnValueType(
            this.#enregistrerChangementProducteurFixture.demandéLe,
          ).formatter(),
          this.#enregistrerChangementProducteurFixture.pièceJustificative.format,
        ),
        raison: undefined,
      },
    };

    return expected;
  }
}
