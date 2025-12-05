import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/projet';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';

import { AccorderAbandonFixture } from './fixtures/accorderAbandon.fixture';
import { AnnulerAbandonFixture } from './fixtures/annulerAbandon.fixture';
import { ConfirmerAbandonFixture } from './fixtures/confirmerAbandon.fixture';
import { DemanderAbandonFixture } from './fixtures/demanderAbandon.fixture';
import { DemanderConfirmationAbandonFixture } from './fixtures/demanderConfirmationAbandon.fixture';
import { TransmettrePreuveRecandidatureAbandonFixture } from './fixtures/transmettrePreuveRecandidatureAbandon.fixture';
import { RejetAbandonFixture } from './fixtures/rejeterAbandonFixture';
import { DemanderPreuveRecandidatureAbandonFixture } from './fixtures/demanderPreuveRecandidature.fixture';
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

  #demanderPreuveCandidatureAbandonFixture: DemanderPreuveRecandidatureAbandonFixture;

  get demanderPreuveCandidatureAbandonFixture() {
    return this.#demanderPreuveCandidatureAbandonFixture;
  }

  #rejeterAbandonFixture: RejetAbandonFixture;

  get rejeterAbandonFixture() {
    return this.#rejeterAbandonFixture;
  }

  #passerEnInstructionAbandonFixture: PasserAbandonEnInstructionFixture;

  get passerEnInstructionAbandonFixture() {
    return this.#passerEnInstructionAbandonFixture;
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
    this.#passerEnInstructionAbandonFixture = new PasserAbandonEnInstructionFixture();
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
    this.#passerEnInstructionAbandonFixture = new PasserAbandonEnInstructionFixture();
    this.#transmettrePreuveRecandidatureAbandonFixture =
      new TransmettrePreuveRecandidatureAbandonFixture();
  }

  mapToDemandeAbandonExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    statut: Lauréat.Abandon.StatutAbandon.ValueType,
  ): Lauréat.Abandon.ConsulterDemandeAbandonReadModel {
    if (!this.#demanderAbandonFixture.aÉtéCréé) {
      throw new Error(`Aucune demande d'abandon n'a été créée dans AbandonWorld`);
    }

    const ao = appelsOffreData.find((x) => x.id === identifiantProjet.appelOffre);

    const expected: Lauréat.Abandon.ConsulterDemandeAbandonReadModel = {
      statut,
      identifiantProjet,
      demande: {
        demandéLe: DateTime.convertirEnValueType(this.#demanderAbandonFixture.demandéLe),
        demandéPar: Email.convertirEnValueType(this.#demanderAbandonFixture.demandéPar),
        estUneRecandidature: this.#demanderAbandonFixture.recandidature,
        raison: this.#demanderAbandonFixture.raison,
        recandidature: this.#demanderAbandonFixture.recandidature
          ? {
              statut: Lauréat.Abandon.StatutPreuveRecandidature.enAttente,
            }
          : undefined,
        autoritéCompétente: Lauréat.Abandon.AutoritéCompétente.convertirEnValueType(
          ao!.changement === 'indisponible' || !ao?.changement.abandon.demande
            ? Lauréat.Abandon.AutoritéCompétente.DEFAULT_AUTORITE_COMPETENTE_ABANDON
            : ao.changement.abandon.autoritéCompétente,
        ),
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
        Lauréat.Abandon.TypeDocumentAbandon.pièceJustificative.formatter(),
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

    // instruction
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

    if (
      expected.demande.recandidature?.preuve &&
      this.#transmettrePreuveRecandidatureAbandonFixture.aÉtéCréé
    ) {
      expected.demande.recandidature.statut = Lauréat.Abandon.StatutPreuveRecandidature.transmis;
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
          Lauréat.Abandon.TypeDocumentAbandon.abandonRejeté.formatter(),
          this.#rejeterAbandonFixture.rejetéeLe,
          this.#rejeterAbandonFixture.réponseSignée.format,
        ),
      };
    }

    return expected;
  }

  mapToAbandonExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    statut: Lauréat.Abandon.StatutAbandon.ValueType,
  ): Lauréat.Abandon.ConsulterAbandonReadModel {
    if (!this.#demanderAbandonFixture.aÉtéCréé) {
      throw new Error(`Aucune demande d'abandon n'a été créée dans AbandonWorld`);
    }

    const expected: Lauréat.Abandon.ConsulterAbandonReadModel = {
      identifiantProjet,
      demandeEnCours: statut.estEnCours(),
      demandéLe: DateTime.convertirEnValueType(this.#demanderAbandonFixture.demandéLe),
      estAbandonné: this.#accorderAbandonFixture.aÉtéCréé,
      accordéLe: this.#accorderAbandonFixture.accordéeLe
        ? DateTime.convertirEnValueType(this.#accorderAbandonFixture.accordéeLe)
        : undefined,
    };

    return expected;
  }
}
