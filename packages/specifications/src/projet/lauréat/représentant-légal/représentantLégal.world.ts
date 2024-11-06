import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Abandon } from '@potentiel-domain/laureat';

import { ImporterReprésentantLégalFixture } from './fixtures/importerReprésentantLégal.fixture';

export class ReprésentantLégalWorld {
  #importerReprésentantLégalFixture: ImporterReprésentantLégalFixture;

  get importerReprésentantLégalFixture() {
    return this.#importerReprésentantLégalFixture;
  }

  constructor() {
    this.#importerReprésentantLégalFixture = new ImporterReprésentantLégalFixture();
  }

  reinitialiserEnDemande() {
    this.#importerReprésentantLégalFixture = new ImporterReprésentantLégalFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    statut: ReprésentantLégal.StatutDemandeChangementReprésentantLégal.ValueType,
  ): ReprésentantLégal.ConsulterReprésentantLégalReadModel {
    if (!this.#demanderChangementReprésentantLégalFixture.aÉtéCréé) {
      throw new Error(
        `Aucune demande de changement de représentant légal n'a été créée dans ReprésentantLégalWorld`,
      );
    }

    const expected: ReprésentantLégal.ConsulterReprésentantLégalReadModel = {};

    // if (expected.demande.recandidature && this.#demanderPreuveCandidatureAbandonFixture.aÉtéCréé) {
    //   // expected.demande.recandidature.preuve = {
    //   //   demandéeLe: DateTime.convertirEnValueType(
    //   //     this.#demanderPreuveCandidatureAbandonFixture.demandéeLe,
    //   //   ),
    //   // };
    // }

    return expected;
  }
}
