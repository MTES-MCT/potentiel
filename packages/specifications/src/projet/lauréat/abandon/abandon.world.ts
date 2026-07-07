import { DateTime, Email } from '@potentiel-domain/common';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { AccorderAbandonFixture } from './fixtures/accorderAbandon.fixture.js';
import { AnnulerAbandonFixture } from './fixtures/annulerAbandon.fixture.js';
import { ConfirmerAbandonFixture } from './fixtures/confirmerAbandon.fixture.js';
import { DemanderAbandonFixture } from './fixtures/demanderAbandon.fixture.js';
import { DemanderConfirmationAbandonFixture } from './fixtures/demanderConfirmationAbandon.fixture.js';
import { DemanderPreuveRecandidatureAbandonFixture } from './fixtures/demanderPreuveRecandidature.fixture.js';
import { PasserAbandonEnInstructionFixture } from './fixtures/passerAbandonEnInstruction.fixture.js';
import { RejetAbandonFixture } from './fixtures/rejeterAbandonFixture.js';
import { TransmettrePreuveRecandidatureAbandonFixture } from './fixtures/transmettrePreuveRecandidatureAbandon.fixture.js';

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

    const règlesChangementDeLAO =
      ao?.periodes.find((période) => période.id === identifiantProjet.période)?.miseÀJour
        ?.changement ?? ao?.miseÀJour.changement;

    const expected: Lauréat.Abandon.ConsulterDemandeAbandonReadModel = {
      statut,
      identifiantProjet,
      demande: {
        demandéLe: DateTime.convertirEnValueType(this.#demanderAbandonFixture.demandéLe),
        demandéPar: Email.convertirEnValueType(this.#demanderAbandonFixture.demandéPar),
        estUneRecandidature: this.#demanderAbandonFixture.recandidature,
        ppaSignalé: this.#demanderAbandonFixture.estPPA ? true : undefined,
        raison: this.#demanderAbandonFixture.raison,
        recandidature: this.#demanderAbandonFixture.recandidature
          ? {
              statut: Lauréat.Abandon.StatutPreuveRecandidature.enAttente,
            }
          : undefined,
        autoritéCompétente: Lauréat.Abandon.AutoritéCompétente.convertirEnValueType(
          règlesChangementDeLAO === 'indisponible' || !règlesChangementDeLAO?.abandon?.demande
            ? Lauréat.Abandon.AutoritéCompétente.DEFAULT_AUTORITE_COMPETENTE_ABANDON
            : règlesChangementDeLAO.abandon.autoritéCompétente,
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
      expected.demande.pièceJustificative = Lauréat.Abandon.DocumentAbandon.pièceJustificative({
        identifiantProjet: identifiantProjet.formatter(),
        demandéLe: this.#demanderAbandonFixture.demandéLe,
        pièceJustificative: this.#demanderAbandonFixture.pièceJustificative,
      });
    }

    if (this.#demanderConfirmationAbandonFixture.aÉtéCréé) {
      expected.demande.confirmation = {
        demandéeLe: DateTime.convertirEnValueType(
          this.#demanderConfirmationAbandonFixture.confirmationDemandéeLe,
        ),
        demandéePar: Email.convertirEnValueType(
          this.#demanderConfirmationAbandonFixture.confirmationDemandéePar,
        ),
        réponseSignée: Lauréat.Abandon.DocumentAbandon.abandonAConfirmer({
          identifiantProjet: identifiantProjet.formatter(),
          confirmationDemandéeLe: this.#demanderConfirmationAbandonFixture.confirmationDemandéeLe,
          réponseSignée: this.#demanderConfirmationAbandonFixture.réponseSignée,
        }),
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
        accordéLe: DateTime.convertirEnValueType(this.#accorderAbandonFixture.accordéLe),
        accordéPar: Email.convertirEnValueType(this.#accorderAbandonFixture.accordéePar),
        réponseSignée: Lauréat.Abandon.DocumentAbandon.abandonAccordé({
          identifiantProjet: identifiantProjet.formatter(),
          accordéLe: this.#accorderAbandonFixture.accordéLe as DateTime.RawType,
          réponseSignée: this.#accorderAbandonFixture.réponseSignée,
        }),
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
        réponseSignée: Lauréat.Abandon.DocumentAbandon.abandonRejeté({
          identifiantProjet: identifiantProjet.formatter(),
          rejetéLe: this.#rejeterAbandonFixture.rejetéeLe,
          réponseSignée: this.#rejeterAbandonFixture.réponseSignée,
        }),
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
      statut,
      demandéLe: DateTime.convertirEnValueType(this.#demanderAbandonFixture.demandéLe),
      accordéLe: this.#accorderAbandonFixture.accordéLe
        ? DateTime.convertirEnValueType(this.#accorderAbandonFixture.accordéLe)
        : undefined,
    };

    return expected;
  }
}
