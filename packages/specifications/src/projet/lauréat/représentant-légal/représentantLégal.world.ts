import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { DocumentProjet } from '@potentiel-domain/document';

import { ImporterReprésentantLégalFixture } from './fixtures/importerReprésentantLégal.fixture';
import { ModifierReprésentantLégalFixture } from './fixtures/modifierReprésentantLégal.fixture';
import { DemanderChangementReprésentantLégalFixture } from './demandeChangement/fixtures/demanderChangementReprésentantLégal.fixture';

export class ReprésentantLégalWorld {
  #importerReprésentantLégalFixture: ImporterReprésentantLégalFixture;
  #modifierReprésentantLégalFixture: ModifierReprésentantLégalFixture;
  #demanderChangementReprésentantLégalFixture: DemanderChangementReprésentantLégalFixture;

  get importerReprésentantLégalFixture() {
    return this.#importerReprésentantLégalFixture;
  }

  get modifierReprésentantLégalFixture() {
    return this.#modifierReprésentantLégalFixture;
  }

  get demanderChangementReprésentantLégalFixture() {
    return this.#demanderChangementReprésentantLégalFixture;
  }

  constructor() {
    this.#importerReprésentantLégalFixture = new ImporterReprésentantLégalFixture();
    this.#modifierReprésentantLégalFixture = new ModifierReprésentantLégalFixture();
    this.#demanderChangementReprésentantLégalFixture =
      new DemanderChangementReprésentantLégalFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): ReprésentantLégal.ConsulterReprésentantLégalReadModel {
    const expected: ReprésentantLégal.ConsulterReprésentantLégalReadModel = {
      identifiantProjet,
      nomReprésentantLégal: this.#importerReprésentantLégalFixture.nomReprésentantLégal,
      typeReprésentantLégal: this.#importerReprésentantLégalFixture.typeReprésentantLégal,
    };

    if (this.#modifierReprésentantLégalFixture.aÉtéCréé) {
      expected.nomReprésentantLégal = this.#modifierReprésentantLégalFixture.nomReprésentantLégal;
      expected.typeReprésentantLégal = this.#modifierReprésentantLégalFixture.typeReprésentantLégal;
    }

    if (this.#demanderChangementReprésentantLégalFixture.aÉtéCréé) {
      expected.demande = {
        statut: this.#demanderChangementReprésentantLégalFixture.statut,
        nomReprésentantLégal: this.#demanderChangementReprésentantLégalFixture.nomReprésentantLégal,
        typeReprésentantLégal:
          this.#demanderChangementReprésentantLégalFixture.typeReprésentantLégal,
        demandéLe: DateTime.convertirEnValueType(
          this.#demanderChangementReprésentantLégalFixture.demandéLe,
        ),
        demandéPar: Email.convertirEnValueType(
          this.#demanderChangementReprésentantLégalFixture.demandéPar,
        ),
        pièceJustificative: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          ReprésentantLégal.TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
          this.#demanderChangementReprésentantLégalFixture.demandéLe,
          this.#demanderChangementReprésentantLégalFixture.pièceJustificative!.format,
        ),
      };
    }

    return expected;
  }
}
