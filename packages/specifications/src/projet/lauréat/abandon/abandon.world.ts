import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { AccorderAbandonFixture } from './fixtures/accorderAbandon.fixture';
import { AnnulerAbandonFixture } from './fixtures/annulerAbandon.fixture';
import { ConfirmerAbandonFixture } from './fixtures/confirmerAbandon.fixture';
import { DemanderAbandonFixture } from './fixtures/demanderAbandon.fixture';
import { DemanderConfirmationAbandonFixture } from './fixtures/demanderConfirmationAbandon.fixture';
import { RejetAbandonFixture } from './fixtures/rejeterAbandonFixture';
import { PasserAbandonEnInstructionFixture } from './fixtures/passerAbandonEnInstruction.fixture';

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

  #rejeterAbandonFixture: RejetAbandonFixture;

  get rejeterAbandonFixture() {
    return this.#rejeterAbandonFixture;
  }

  #passerEnInstructionAbandonFixture: PasserAbandonEnInstructionFixture;

  get passerEnInstructionAbandonFixture() {
    return this.#passerEnInstructionAbandonFixture;
  }

  constructor() {
    this.#accorderAbandonFixture = new AccorderAbandonFixture();
    this.#annulerAbandonFixture = new AnnulerAbandonFixture();
    this.#confirmerAbandonFixture = new ConfirmerAbandonFixture();
    this.#demanderAbandonFixture = new DemanderAbandonFixture();
    this.#demanderConfirmationAbandonFixture = new DemanderConfirmationAbandonFixture();
    this.#rejeterAbandonFixture = new RejetAbandonFixture();
    this.#passerEnInstructionAbandonFixture = new PasserAbandonEnInstructionFixture();
  }

  reinitialiserEnDemande() {
    this.#accorderAbandonFixture = new AccorderAbandonFixture();
    this.#annulerAbandonFixture = new AnnulerAbandonFixture();
    this.#confirmerAbandonFixture = new ConfirmerAbandonFixture();
    this.#demanderConfirmationAbandonFixture = new DemanderConfirmationAbandonFixture();
    this.#rejeterAbandonFixture = new RejetAbandonFixture();
    this.#passerEnInstructionAbandonFixture = new PasserAbandonEnInstructionFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    statut: Lauréat.Abandon.StatutAbandon.ValueType,
  ): Lauréat.Abandon.ConsulterAbandonReadModel {
    if (!this.#demanderAbandonFixture.aÉtéCréé) {
      throw new Error(`Aucune demande d'abandon n'a été créée dans AbandonWorld`);
    }

    const expected: Lauréat.Abandon.ConsulterAbandonReadModel = {
      statut,
      identifiantProjet,
      demande: {
        demandéLe: DateTime.convertirEnValueType(this.#demanderAbandonFixture.demandéLe),
        demandéPar: Email.convertirEnValueType(this.#demanderAbandonFixture.demandéPar),
        estUneRecandidature: false,
        raison: this.#demanderAbandonFixture.raison,
      },
    };

    if (this.#demanderAbandonFixture.pièceJustificative) {
      expected.demande.pièceJustificative = DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Lauréat.Abandon.TypeDocumentAbandon.pièceJustificative.formatter(),
        this.#demanderAbandonFixture.demandéLe,
        this.#demanderAbandonFixture.pièceJustificative.format,
      );
    }

    // Demande de confirmation
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
          Lauréat.Abandon.TypeDocumentAbandon.abandonÀConfirmer.formatter(),
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

    // Instruction
    if (this.#passerEnInstructionAbandonFixture.aÉtéCréé) {
      expected.demande.instruction = {
        passéEnInstructionLe: DateTime.convertirEnValueType(
          this.#passerEnInstructionAbandonFixture.passéEnInstructionLe,
        ),
        passéEnInstructionPar: Email.convertirEnValueType(
          this.#passerEnInstructionAbandonFixture.passéEnInstructionPar,
        ),
      };
    }

    // Accord
    if (this.#accorderAbandonFixture.aÉtéCréé) {
      expected.demande.accord = {
        accordéLe: DateTime.convertirEnValueType(this.#accorderAbandonFixture.accordéeLe),
        accordéPar: Email.convertirEnValueType(this.#accorderAbandonFixture.accordéePar),
        réponseSignée: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Lauréat.Abandon.TypeDocumentAbandon.abandonAccordé.formatter(),
          this.#accorderAbandonFixture.accordéeLe,
          this.#accorderAbandonFixture.réponseSignée.format,
        ),
      };
    }

    // Rejet
    if (this.#rejeterAbandonFixture.aÉtéCréé) {
      expected.demande.rejet = {
        rejetéLe: DateTime.convertirEnValueType(this.#rejeterAbandonFixture.rejetéeLe),
        rejetéPar: Email.convertirEnValueType(this.#rejeterAbandonFixture.rejetéePar),
        réponseSignée: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Lauréat.Abandon.TypeDocumentAbandon.abandonRejeté.formatter(),
          this.#rejeterAbandonFixture.rejetéeLe,
          this.#rejeterAbandonFixture.réponseSignée.format,
        ),
      };
    }

    return expected;
  }
}
