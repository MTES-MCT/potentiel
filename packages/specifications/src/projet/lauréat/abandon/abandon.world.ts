import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Abandon } from '@potentiel-domain/laureat';

import { AccorderAbandonFixture } from './fixtures/accorderAbandon.fixture';
import { AnnulerAbandonFixture } from './fixtures/annulerAbandon.fixture';
import { ConfirmerAbandonFixture } from './fixtures/confirmerAbandon.fixture';
import { DemanderAbandonFixture } from './fixtures/demanderAbandon.fixture';
import { DemanderConfirmationAbandonFixture } from './fixtures/demanderConfirmationAbandon.fixture';
import { TransmettrePreuveRecandidatureAbandonFixture } from './fixtures/transmettrePreuveRecandidatureAbandon.fixture';
import { RejetAbandonFixture } from './fixtures/rejeterAbandonFixture';
import { DemanderPreuveRecandidatureAbandonFixture } from './fixtures/demanderPreuveRecandidature.fixture';

export class AbandonWord {
  #accorderAbandonFixture: AccorderAbandonFixture;

  get accorderAbandonFixture() {
    return this.#accorderAbandonFixture;
  }

  #annulerAbandonFixture: AnnulerAbandonFixture;

  get annulerAbandonFixture() {
    return this.#annulerAbandonFixture;
  }

  #confirmerAbandonFixture: ConfirmerAbandonFixture;

  get confirmerAbandonFixture() {
    return this.#confirmerAbandonFixture;
  }

  #demanderAbandonFixture: DemanderAbandonFixture;

  get demanderAbandonFixture() {
    return this.#demanderAbandonFixture;
  }

  #demanderConfirmationAbandonFixture: DemanderConfirmationAbandonFixture;

  get demanderConfirmationAbandonFixture() {
    return this.#demanderConfirmationAbandonFixture;
  }

  #demanderPreuveCandidatureAbandonFixture: DemanderPreuveRecandidatureAbandonFixture;

  get demanderPreuveCandidatureAbandonFixture() {
    return this.#demanderPreuveCandidatureAbandonFixture;
  }

  #rejeterAbandonFixture: RejetAbandonFixture;

  get rejeterAbandonFixture() {
    return this.#rejeterAbandonFixture;
  }

  #transmettrePreuveRecandidatureAbandonFixture: TransmettrePreuveRecandidatureAbandonFixture;

  get transmettrePreuveRecandidatureAbandonFixture() {
    return this.#transmettrePreuveRecandidatureAbandonFixture;
  }

  constructor() {
    this.#accorderAbandonFixture = new AccorderAbandonFixture();
    this.#annulerAbandonFixture = new AnnulerAbandonFixture();
    this.#confirmerAbandonFixture = new ConfirmerAbandonFixture();
    this.#demanderAbandonFixture = new DemanderAbandonFixture();
    this.#demanderConfirmationAbandonFixture = new DemanderConfirmationAbandonFixture();
    this.#demanderPreuveCandidatureAbandonFixture = new DemanderPreuveRecandidatureAbandonFixture();
    this.#rejeterAbandonFixture = new RejetAbandonFixture();
    this.#transmettrePreuveRecandidatureAbandonFixture =
      new TransmettrePreuveRecandidatureAbandonFixture();
  }

  reinitialiserEnDemande() {
    this.#accorderAbandonFixture = new AccorderAbandonFixture();
    this.#annulerAbandonFixture = new AnnulerAbandonFixture();
    this.#confirmerAbandonFixture = new ConfirmerAbandonFixture();
    this.#demanderConfirmationAbandonFixture = new DemanderConfirmationAbandonFixture();
    this.#demanderPreuveCandidatureAbandonFixture = new DemanderPreuveRecandidatureAbandonFixture();
    this.#rejeterAbandonFixture = new RejetAbandonFixture();
    this.#transmettrePreuveRecandidatureAbandonFixture =
      new TransmettrePreuveRecandidatureAbandonFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    statut: Abandon.StatutAbandon.ValueType,
  ): Abandon.ConsulterAbandonReadModel {
    if (!this.#demanderAbandonFixture.aÉtéCréé) {
      throw new Error(`Aucune demande d'abandon n'a été créée dans AbandonWorld`);
    }

    const expected: Abandon.ConsulterAbandonReadModel = {
      statut,
      identifiantProjet,
      demande: {
        demandéLe: DateTime.convertirEnValueType(this.#demanderAbandonFixture.demandéLe),
        demandéPar: Email.convertirEnValueType(this.#demanderAbandonFixture.demandéPar),
        estUneRecandidature: this.#demanderAbandonFixture.recandidature,
        raison: this.#demanderAbandonFixture.raison,
        recandidature: this.#demanderAbandonFixture.recandidature
          ? {
              statut: Abandon.StatutPreuveRecandidature.enAttente,
            }
          : undefined,
      },
    };

    if (expected.demande.recandidature && this.#demanderPreuveCandidatureAbandonFixture.aÉtéCréé) {
      expected.demande.recandidature.preuve = {
        demandéeLe: DateTime.convertirEnValueType(
          this.#demanderPreuveCandidatureAbandonFixture.demandéeLe,
        ),
      };
    }

    if (this.#demanderAbandonFixture.pièceJustificative) {
      expected.demande.pièceJustificative = DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Abandon.TypeDocumentAbandon.pièceJustificative.formatter(),
        this.#demanderAbandonFixture.demandéLe,
        this.#demanderAbandonFixture.pièceJustificative.format,
      );
    }

    if (this.#demanderConfirmationAbandonFixture.aÉtéCréé) {
      expected.demande.confirmation = {
        demandéeLe: DateTime.convertirEnValueType(
          this.#demanderConfirmationAbandonFixture.confirmationDemandéeLe,
        ),
        demandéePar: Email.convertirEnValueType(
          this.#demanderConfirmationAbandonFixture.confirmationDemandéePar,
        ),
        réponseSignée: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Abandon.TypeDocumentAbandon.abandonÀConfirmer.formatter(),
          this.#demanderConfirmationAbandonFixture.confirmationDemandéeLe,
          this.#demanderConfirmationAbandonFixture.réponseSignée.format,
        ),
      };
    }

    if (expected.demande.confirmation && this.#confirmerAbandonFixture.aÉtéCréé) {
      expected.demande.confirmation.confirméLe = DateTime.convertirEnValueType(
        this.#confirmerAbandonFixture.confirméeLe,
      );
      expected.demande.confirmation.confirméPar = Email.convertirEnValueType(
        this.#confirmerAbandonFixture.confirméePar,
      );
    }

    // Accord
    if (this.#accorderAbandonFixture.aÉtéCréé) {
      expected.demande.accord = {
        accordéLe: DateTime.convertirEnValueType(this.#accorderAbandonFixture.accordéeLe),
        accordéPar: Email.convertirEnValueType(this.#accorderAbandonFixture.accordéePar),
        réponseSignée: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Abandon.TypeDocumentAbandon.abandonAccordé.formatter(),
          this.#accorderAbandonFixture.accordéeLe,
          this.#accorderAbandonFixture.réponseSignée.format,
        ),
      };
    }

    if (
      expected.demande.recandidature?.preuve &&
      this.#transmettrePreuveRecandidatureAbandonFixture.aÉtéCréé
    ) {
      expected.demande.recandidature.statut = Abandon.StatutPreuveRecandidature.transmis;
      expected.demande.recandidature.preuve.transmiseLe = DateTime.convertirEnValueType(
        this.#transmettrePreuveRecandidatureAbandonFixture.transmiseLe,
      );
      expected.demande.recandidature.preuve.transmisePar = Email.convertirEnValueType(
        this.#transmettrePreuveRecandidatureAbandonFixture.transmisePar,
      );
      expected.demande.recandidature.preuve.identifiantProjet =
        IdentifiantProjet.convertirEnValueType(
          this.#transmettrePreuveRecandidatureAbandonFixture.preuveRecandidature,
        );
    }

    // Rejet ->
    if (this.#rejeterAbandonFixture.aÉtéCréé) {
      expected.demande.rejet = {
        rejetéLe: DateTime.convertirEnValueType(this.#rejeterAbandonFixture.rejetéeLe),
        rejetéPar: Email.convertirEnValueType(this.#rejeterAbandonFixture.rejetéePar),
        réponseSignée: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Abandon.TypeDocumentAbandon.abandonRejeté.formatter(),
          this.#rejeterAbandonFixture.rejetéeLe,
          this.#rejeterAbandonFixture.réponseSignée.format,
        ),
      };
    }

    return expected;
  }
}
