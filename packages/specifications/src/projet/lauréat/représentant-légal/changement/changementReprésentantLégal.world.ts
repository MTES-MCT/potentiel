import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { DocumentProjet } from '@potentiel-domain/document';

import { DemanderChangementReprésentantLégalFixture } from './fixtures/demanderChangementReprésentantLégal.fixture';
import { AccorderChangementReprésentantLégalFixture } from './fixtures/accorderChangementReprésentantLégal.fixture';
import { RejeterChangementReprésentantLégalFixture } from './fixtures/rejeterChangementReprésentantLégal.fixture';

export class ChangementReprésentantLégalWorld {
  #demanderChangementReprésentantLégalFixture: DemanderChangementReprésentantLégalFixture;

  get demanderChangementReprésentantLégalFixture() {
    return this.#demanderChangementReprésentantLégalFixture;
  }

  #accorderChangementReprésentantLégalFixture: AccorderChangementReprésentantLégalFixture;

  get accorderChangementReprésentantLégalFixture() {
    return this.#accorderChangementReprésentantLégalFixture;
  }

  #rejeterChangementReprésentantLégalFixture: RejeterChangementReprésentantLégalFixture;

  get rejeterChangementReprésentantLégalFixture() {
    return this.#rejeterChangementReprésentantLégalFixture;
  }

  constructor() {
    this.#demanderChangementReprésentantLégalFixture =
      new DemanderChangementReprésentantLégalFixture();
    this.#accorderChangementReprésentantLégalFixture =
      new AccorderChangementReprésentantLégalFixture();
    this.#rejeterChangementReprésentantLégalFixture =
      new RejeterChangementReprésentantLégalFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    statut?: ReprésentantLégal.StatutChangementReprésentantLégal.ValueType,
  ): ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel {
    const expected: ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel = {
      identifiantProjet,
      demande: {
        statut: statut ?? this.#demanderChangementReprésentantLégalFixture.statut,
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

    if (this.accorderChangementReprésentantLégalFixture.aÉtéCréé) {
      expected.demande.accord = {
        nomReprésentantLégal: this.accorderChangementReprésentantLégalFixture.nomReprésentantLégal,
        typeReprésentantLégal:
          this.accorderChangementReprésentantLégalFixture.typeReprésentantLégal,
        accordéLe: DateTime.convertirEnValueType(
          this.accorderChangementReprésentantLégalFixture.accordéeLe,
        ),
        accordéPar: Email.convertirEnValueType(
          this.accorderChangementReprésentantLégalFixture.accordéePar,
        ),
      };
    }

    if (this.rejeterChangementReprésentantLégalFixture.aÉtéCréé) {
      expected.demande.rejet = {
        rejetéLe: DateTime.convertirEnValueType(
          this.rejeterChangementReprésentantLégalFixture.rejetéeLe,
        ),
        rejetéPar: Email.convertirEnValueType(
          this.rejeterChangementReprésentantLégalFixture.rejetéePar,
        ),
      };
    }

    return expected;
  }
}
