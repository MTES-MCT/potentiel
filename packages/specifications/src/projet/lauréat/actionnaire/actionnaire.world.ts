import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Actionnaire } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { DocumentProjet } from '@potentiel-domain/document';

import { ImporterActionnaireFixture } from './fixtures/importerActionnaire.fixture';
import { ModifierActionnaireFixture } from './fixtures/modifierActionnaire.fixture';
import { DemanderChangementActionnaireFixture } from './fixtures/demanderChangementActionnaire.fixture';
import { AnnulerDemandeChangementActionnaireFixture } from './fixtures/annulerDemandeChangementActionnaire.fixture';
import { AccorderChangementActionnaireFixture } from './fixtures/accorderChangementActionnaire.fixture';
import { RejeterDemandeChangementActionnaireFixture } from './fixtures/rejeterDemandeChangementActionnaire.fixture';
import { TransmettreActionnaireFixture } from './fixtures/transmettreActionnaire.fixture';

export class ActionnaireWorld {
  #importerActionnaireFixture: ImporterActionnaireFixture;
  #modifierActionnaireFixture: ModifierActionnaireFixture;
  #transmettreActionnaireFixture: TransmettreActionnaireFixture;
  #demanderChangementActionnaireFixture: DemanderChangementActionnaireFixture;
  #annulerDemandeChangementActionnaireFixture: AnnulerDemandeChangementActionnaireFixture;
  #accorderDemandeChangementActionnaireFixture: AccorderChangementActionnaireFixture;
  #rejeterDemandeChangementActionnaireFixture: RejeterDemandeChangementActionnaireFixture;

  get importerActionnaireFixture() {
    return this.#importerActionnaireFixture;
  }

  get modifierActionnaireFixture() {
    return this.#modifierActionnaireFixture;
  }

  get transmettreActionnaireFixture() {
    return this.#transmettreActionnaireFixture;
  }

  get demanderChangementActionnaireFixture() {
    return this.#demanderChangementActionnaireFixture;
  }

  get annulerDemandeChangementActionnaireFixture() {
    return this.#annulerDemandeChangementActionnaireFixture;
  }

  get accorderDemandeChangementActionnaireFixture() {
    return this.#accorderDemandeChangementActionnaireFixture;
  }

  get rejeterDemandeChangementActionnaireFixture() {
    return this.#rejeterDemandeChangementActionnaireFixture;
  }

  constructor() {
    this.#importerActionnaireFixture = new ImporterActionnaireFixture();
    this.#modifierActionnaireFixture = new ModifierActionnaireFixture();
    this.#transmettreActionnaireFixture = new TransmettreActionnaireFixture();
    this.#demanderChangementActionnaireFixture = new DemanderChangementActionnaireFixture();
    this.#annulerDemandeChangementActionnaireFixture =
      new AnnulerDemandeChangementActionnaireFixture();
    this.#accorderDemandeChangementActionnaireFixture = new AccorderChangementActionnaireFixture();
    this.#rejeterDemandeChangementActionnaireFixture =
      new RejeterDemandeChangementActionnaireFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): Actionnaire.ConsulterActionnaireReadModel {
    const expected: Actionnaire.ConsulterActionnaireReadModel = {
      identifiantProjet,
      actionnaire: this.#importerActionnaireFixture.actionnaire,
    };

    if (this.#demanderChangementActionnaireFixture.aÉtéCréé) {
      expected.actionnaire = this.#demanderChangementActionnaireFixture.actionnaire;
    }

    if (this.#modifierActionnaireFixture.aÉtéCréé) {
      expected.actionnaire = this.#modifierActionnaireFixture.actionnaire;
    }

    if (this.#transmettreActionnaireFixture.aÉtéCréé) {
      expected.actionnaire = this.#transmettreActionnaireFixture.actionnaire;
    }

    if (this.#accorderDemandeChangementActionnaireFixture.aÉtéCréé) {
      expected.actionnaire = this.#demanderChangementActionnaireFixture.actionnaire;
    }

    if (this.#rejeterDemandeChangementActionnaireFixture.aÉtéCréé) {
      expected.actionnaire = this.#importerActionnaireFixture.actionnaire;
    }

    return expected;
  }

  mapDemandeToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    statut: Actionnaire.StatutChangementActionnaire.ValueType,
    estUneNouvelleDemande?: boolean,
  ): Option.Type<Actionnaire.ConsulterChangementActionnaireReadModel> {
    if (!this.demanderChangementActionnaireFixture.aÉtéCréé) {
      throw new Error(
        `Aucune demande de changement d'actionnaire n'a été créée dans ActionnaireWorld`,
      );
    }

    return {
      identifiantProjet,
      demande: {
        statut,
        demandéeLe: DateTime.convertirEnValueType(
          this.#demanderChangementActionnaireFixture.demandéLe,
        ),
        demandéePar: Email.convertirEnValueType(
          this.#demanderChangementActionnaireFixture.demandéPar,
        ),
        raison: this.#demanderChangementActionnaireFixture.raison,
        pièceJustificative: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Actionnaire.TypeDocumentActionnaire.pièceJustificative.formatter(),
          DateTime.convertirEnValueType(
            this.#demanderChangementActionnaireFixture.demandéLe,
          ).formatter(),
          this.#demanderChangementActionnaireFixture.pièceJustificative.format,
        ),

        accord:
          this.#accorderDemandeChangementActionnaireFixture.aÉtéCréé && !estUneNouvelleDemande
            ? {
                accordéeLe: DateTime.convertirEnValueType(
                  this.#accorderDemandeChangementActionnaireFixture.accordéeLe,
                ),
                accordéePar: Email.convertirEnValueType(
                  this.#accorderDemandeChangementActionnaireFixture.accordéePar,
                ),

                réponseSignée: DocumentProjet.convertirEnValueType(
                  identifiantProjet.formatter(),
                  Actionnaire.TypeDocumentActionnaire.changementAccordé.formatter(),
                  DateTime.convertirEnValueType(
                    this.#accorderDemandeChangementActionnaireFixture.accordéeLe,
                  ).formatter(),
                  this.#accorderDemandeChangementActionnaireFixture.réponseSignée.format,
                ),
              }
            : undefined,

        rejet:
          this.#rejeterDemandeChangementActionnaireFixture.aÉtéCréé && !estUneNouvelleDemande
            ? {
                rejetéeLe: DateTime.convertirEnValueType(
                  this.#rejeterDemandeChangementActionnaireFixture.rejetéeLe,
                ),
                rejetéePar: Email.convertirEnValueType(
                  this.#rejeterDemandeChangementActionnaireFixture.rejetéePar,
                ),

                réponseSignée: DocumentProjet.convertirEnValueType(
                  identifiantProjet.formatter(),
                  Actionnaire.TypeDocumentActionnaire.changementRejeté.formatter(),
                  DateTime.convertirEnValueType(
                    this.#rejeterDemandeChangementActionnaireFixture.rejetéeLe,
                  ).formatter(),
                  this.#rejeterDemandeChangementActionnaireFixture.réponseSignée.format,
                ),
              }
            : undefined,
      },
    };
  }
}
