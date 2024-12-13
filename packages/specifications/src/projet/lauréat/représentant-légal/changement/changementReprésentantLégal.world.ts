import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { DocumentProjet } from '@potentiel-domain/document';

import { DemanderChangementReprésentantLégalFixture } from './fixtures/demanderChangementReprésentantLégal.fixture';

export class ChangementReprésentantLégalWorld {
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
  ): ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel {
    const expected: ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel = {
      identifiantProjet,
      statut: this.#demanderChangementReprésentantLégalFixture.statut,
      demande: {
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
      },
    };

    return expected;
  }
}
