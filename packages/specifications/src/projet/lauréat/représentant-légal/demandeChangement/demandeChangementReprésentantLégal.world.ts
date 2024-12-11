import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { DocumentProjet } from '@potentiel-domain/document';

import { DemanderChangementReprésentantLégalFixture } from './fixtures/demanderChangementReprésentantLégal.fixture';

export class DemandeChangementReprésentantLégalWorld {
  #demanderChangementReprésentantLégalFixture: DemanderChangementReprésentantLégalFixture;

  get demanderChangementReprésentantLégalFixture() {
    return this.#demanderChangementReprésentantLégalFixture;
  }

  constructor() {
    this.#demanderChangementReprésentantLégalFixture =
      new DemanderChangementReprésentantLégalFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): ReprésentantLégal.ConsulterReprésentantLégalReadModel {
    const expected: ReprésentantLégal.ConsulterDemandeChangementReprésentantLégalReadModel = {
      identifiantProjet,
      statut: this.#demanderChangementReprésentantLégalFixture.statut,
      nomReprésentantLégal: this.#demanderChangementReprésentantLégalFixture.nomReprésentantLégal,
      typeReprésentantLégal: this.#demanderChangementReprésentantLégalFixture.typeReprésentantLégal,
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

    return expected;
  }
}
