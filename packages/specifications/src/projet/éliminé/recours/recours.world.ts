import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Recours } from '@potentiel-domain/elimine';
import { DocumentProjet } from '@potentiel-domain/document';

import { AccorderRecoursFixture } from './fixtures/accorderRecours.fixture';
import { AnnulerRecoursFixture } from './fixtures/annulerRecours.fixture';
import { DemanderRecoursFixture } from './fixtures/demanderRecours.fixture';
import { RejeterRecoursFixture } from './fixtures/rejeterRecours.fixture';

export class RecoursWord {
  #accorderRecoursFixture: AccorderRecoursFixture;

  get accorderRecoursFixture() {
    return this.#accorderRecoursFixture;
  }

  #annulerRecoursFixture: AnnulerRecoursFixture;

  get annulerRecoursFixture() {
    return this.#annulerRecoursFixture;
  }

  #rejeterRecoursFixture: RejeterRecoursFixture;

  get rejeterRecoursFixture() {
    return this.#rejeterRecoursFixture;
  }

  #demanderRecoursFixture: DemanderRecoursFixture;

  get demanderRecoursFixture() {
    return this.#demanderRecoursFixture;
  }

  reinitialiserEnDemande() {
    this.#accorderRecoursFixture = new AccorderRecoursFixture();
    this.#annulerRecoursFixture = new AnnulerRecoursFixture();
    this.#rejeterRecoursFixture = new RejeterRecoursFixture();
  }

  constructor() {
    this.#accorderRecoursFixture = new AccorderRecoursFixture();
    this.#annulerRecoursFixture = new AnnulerRecoursFixture();
    this.#rejeterRecoursFixture = new RejeterRecoursFixture();
    this.#demanderRecoursFixture = new DemanderRecoursFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    statut: Recours.StatutRecours.ValueType,
  ): Recours.ConsulterRecoursReadModel {
    if (!this.#demanderRecoursFixture.aÉtéCréé) {
      throw new Error(`Aucune demande de recours n'a été créée dans RecoursWorld`);
    }

    const expected: Recours.ConsulterRecoursReadModel = {
      statut,
      identifiantProjet,
      demande: {
        demandéLe: DateTime.convertirEnValueType(this.#demanderRecoursFixture.demandéLe),
        demandéPar: Email.convertirEnValueType(this.#demanderRecoursFixture.demandéPar),
        raison: this.#demanderRecoursFixture.raison,
        pièceJustificative: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Recours.TypeDocumentRecours.pièceJustificative.formatter(),
          this.#demanderRecoursFixture.demandéLe,
          this.#demanderRecoursFixture.pièceJustificative.format,
        ),
      },
    };

    // Accord
    if (this.#accorderRecoursFixture.aÉtéCréé) {
      expected.demande.accord = {
        accordéLe: DateTime.convertirEnValueType(this.#accorderRecoursFixture.accordéeLe),
        accordéPar: Email.convertirEnValueType(this.#accorderRecoursFixture.accordéePar),
        réponseSignée: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Recours.TypeDocumentRecours.recoursAccordé.formatter(),
          this.#accorderRecoursFixture.accordéeLe,
          this.#accorderRecoursFixture.réponseSignée.format,
        ),
      };
    }

    // Rejet ->
    if (this.#rejeterRecoursFixture.aÉtéCréé) {
      expected.demande.rejet = {
        rejetéLe: DateTime.convertirEnValueType(this.#rejeterRecoursFixture.rejetéeLe),
        rejetéPar: Email.convertirEnValueType(this.#rejeterRecoursFixture.rejetéePar),
        réponseSignée: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Recours.TypeDocumentRecours.recoursRejeté.formatter(),
          this.#rejeterRecoursFixture.rejetéeLe,
          this.#rejeterRecoursFixture.réponseSignée.format,
        ),
      };
    }

    return expected;
  }
}
