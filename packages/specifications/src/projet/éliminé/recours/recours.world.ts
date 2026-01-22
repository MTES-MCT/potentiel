import { DateTime, Email } from '@potentiel-domain/common';
import { Éliminé, IdentifiantProjet } from '@potentiel-domain/projet';
import { DocumentProjet } from '@potentiel-domain/projet';

import { AccorderRecoursFixture } from './fixtures/accorderRecours.fixture.js';
import { AnnulerRecoursFixture } from './fixtures/annulerRecours.fixture.js';
import { DemanderRecoursFixture } from './fixtures/demanderRecours.fixture.js';
import { RejeterRecoursFixture } from './fixtures/rejeterRecours.fixture.js';
import { PasserRecoursEnInstructionFixture } from './fixtures/passerRecoursEnInstruction.fixture.js';

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

  #passerRecoursEnInstructionFixture: PasserRecoursEnInstructionFixture;

  get passerRecoursEnInstructionFixture() {
    return this.#passerRecoursEnInstructionFixture;
  }

  reinitialiserEnDemande() {
    this.#accorderRecoursFixture = new AccorderRecoursFixture();
    this.#annulerRecoursFixture = new AnnulerRecoursFixture();
    this.#rejeterRecoursFixture = new RejeterRecoursFixture();
    this.#passerRecoursEnInstructionFixture = new PasserRecoursEnInstructionFixture();
  }

  constructor() {
    this.#accorderRecoursFixture = new AccorderRecoursFixture();
    this.#annulerRecoursFixture = new AnnulerRecoursFixture();
    this.#rejeterRecoursFixture = new RejeterRecoursFixture();
    this.#demanderRecoursFixture = new DemanderRecoursFixture();
    this.#passerRecoursEnInstructionFixture = new PasserRecoursEnInstructionFixture();
  }

  mapToDemandeRecoursExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    statut: Éliminé.Recours.StatutRecours.ValueType,
  ): Éliminé.Recours.ConsulterDemandeRecoursReadModel {
    if (!this.#demanderRecoursFixture.aÉtéCréé) {
      throw new Error(`Aucune demande de recours n'a été créée dans RecoursWorld`);
    }

    const expected: Éliminé.Recours.ConsulterDemandeRecoursReadModel = {
      statut,
      identifiantProjet,
      demande: {
        demandéLe: DateTime.convertirEnValueType(this.#demanderRecoursFixture.demandéLe),
        demandéPar: Email.convertirEnValueType(this.#demanderRecoursFixture.demandéPar),
        raison: this.#demanderRecoursFixture.raison,
        pièceJustificative: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Éliminé.Recours.TypeDocumentRecours.pièceJustificative.formatter(),
          this.#demanderRecoursFixture.demandéLe,
          this.#demanderRecoursFixture.pièceJustificative.format,
        ),
      },
    };

    // Instruction
    if (this.#passerRecoursEnInstructionFixture.aÉtéCréé) {
      expected.demande.instruction = {
        passéEnInstructionLe: DateTime.convertirEnValueType(
          this.#passerRecoursEnInstructionFixture.passéEnInstructionLe,
        ),
        passéEnInstructionPar: Email.convertirEnValueType(
          this.#passerRecoursEnInstructionFixture.passéEnInstructionPar,
        ),
      };
    }

    // Accord
    if (this.#accorderRecoursFixture.aÉtéCréé) {
      expected.demande.accord = {
        accordéLe: DateTime.convertirEnValueType(this.#accorderRecoursFixture.accordéLe),
        accordéPar: Email.convertirEnValueType(this.#accorderRecoursFixture.accordéPar),
        réponseSignée: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Éliminé.Recours.TypeDocumentRecours.recoursAccordé.formatter(),
          this.#accorderRecoursFixture.accordéLe,
          this.#accorderRecoursFixture.réponseSignée.format,
        ),
      };
    }

    // Rejet ->
    if (this.#rejeterRecoursFixture.aÉtéCréé) {
      expected.demande.rejet = {
        rejetéLe: DateTime.convertirEnValueType(this.#rejeterRecoursFixture.rejetéLe),
        rejetéPar: Email.convertirEnValueType(this.#rejeterRecoursFixture.rejetéPar),
        réponseSignée: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Éliminé.Recours.TypeDocumentRecours.recoursRejeté.formatter(),
          this.#rejeterRecoursFixture.rejetéLe,
          this.#rejeterRecoursFixture.réponseSignée.format,
        ),
      };
    }

    return expected;
  }

  mapToRecoursExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    statut: Éliminé.Recours.StatutRecours.ValueType,
  ): Éliminé.Recours.ConsulterRecoursReadModel {
    if (!this.#demanderRecoursFixture.aÉtéCréé) {
      throw new Error(`Aucune demande de recours n'a été créée dans RecoursWorld`);
    }

    const expected: Éliminé.Recours.ConsulterRecoursReadModel = {
      statut,
      identifiantProjet,
      dateDemande: DateTime.convertirEnValueType(this.#demanderRecoursFixture.demandéLe),
      dateAccord: this.#accorderRecoursFixture.accordéLe
        ? DateTime.convertirEnValueType(this.#accorderRecoursFixture.accordéLe)
        : undefined,
    };

    return expected;
  }
}
