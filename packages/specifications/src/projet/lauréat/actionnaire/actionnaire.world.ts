import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Actionnaire } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { DocumentProjet } from '@potentiel-domain/document';

import { ImporterActionnaireFixture } from './fixtures/importerActionnaire.fixture';
import { ModifierActionnaireFixture } from './fixtures/modifierActionnaire.fixture';
import { DemanderChangementActionnaireFixture } from './fixtures/demanderChangementActionnaire.fixture';
import { AnnulerChangementActionnaireFixture } from './fixtures/annulerChangementActionnaire.fixture';
import { AccorderChangementActionnaireFixture } from './fixtures/accorderChangementActionnaire.fixture';
import { RejeterChangementActionnaireFixture } from './fixtures/rejeterChangementActionnaire.fixture';

export class ActionnaireWorld {
  #importerActionnaireFixture: ImporterActionnaireFixture;
  #modifierActionnaireFixture: ModifierActionnaireFixture;
  #demanderChangementActionnaireFixture: DemanderChangementActionnaireFixture;
  #annulerChangementActionnaireFixture: AnnulerChangementActionnaireFixture;
  #accorderChangementActionnaireFixture: AccorderChangementActionnaireFixture;
  #rejeterChangementActionnaireFixture: RejeterChangementActionnaireFixture;
  #actionnaire: string;

  get importerActionnaireFixture() {
    return this.#importerActionnaireFixture;
  }

  get modifierActionnaireFixture() {
    return this.#modifierActionnaireFixture;
  }

  get demanderChangementActionnaireFixture() {
    return this.#demanderChangementActionnaireFixture;
  }

  get annulerChangementActionnaireFixture() {
    return this.#annulerChangementActionnaireFixture;
  }

  get accorderChangementActionnaireFixture() {
    return this.#accorderChangementActionnaireFixture;
  }

  get rejeterChangementActionnaireFixture() {
    return this.#rejeterChangementActionnaireFixture;
  }

  get actionnaire() {
    return this.#actionnaire;
  }

  set actionnaire(value: string) {
    this.#actionnaire = value;
  }

  constructor() {
    this.#importerActionnaireFixture = new ImporterActionnaireFixture();
    this.#modifierActionnaireFixture = new ModifierActionnaireFixture();
    this.#demanderChangementActionnaireFixture = new DemanderChangementActionnaireFixture();
    this.#annulerChangementActionnaireFixture = new AnnulerChangementActionnaireFixture();
    this.#accorderChangementActionnaireFixture = new AccorderChangementActionnaireFixture();
    this.#rejeterChangementActionnaireFixture = new RejeterChangementActionnaireFixture();
    this.#actionnaire = '';
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): Actionnaire.ConsulterActionnaireReadModel {
    return {
      identifiantProjet,
      actionnaire: this.#actionnaire,
    };
  }

  mapDemandeToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    statut: Actionnaire.StatutChangementActionnaire.ValueType,
    estUneNouvelleDemande?: boolean,
  ): Option.Type<Actionnaire.ConsulterChangementActionnaireEnCoursReadModel> {
    if (!this.demanderChangementActionnaireFixture.aÉtéCréé) {
      throw new Error(
        `Aucune demande de changement d'actionnaire n'a été créée dans ActionnaireWorld`,
      );
    }

    return {
      identifiantProjet,

      demande: {
        nouvelActionnaire: this.#demanderChangementActionnaireFixture.actionnaire,
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
          this.#accorderChangementActionnaireFixture.aÉtéCréé && !estUneNouvelleDemande
            ? {
                accordéeLe: DateTime.convertirEnValueType(
                  this.#accorderChangementActionnaireFixture.accordéeLe,
                ),
                accordéePar: Email.convertirEnValueType(
                  this.#accorderChangementActionnaireFixture.accordéePar,
                ),

                réponseSignée: DocumentProjet.convertirEnValueType(
                  identifiantProjet.formatter(),
                  Actionnaire.TypeDocumentActionnaire.changementAccordé.formatter(),
                  DateTime.convertirEnValueType(
                    this.#accorderChangementActionnaireFixture.accordéeLe,
                  ).formatter(),
                  this.#accorderChangementActionnaireFixture.réponseSignée.format,
                ),
              }
            : undefined,

        rejet:
          this.#rejeterChangementActionnaireFixture.aÉtéCréé && !estUneNouvelleDemande
            ? {
                rejetéeLe: DateTime.convertirEnValueType(
                  this.#rejeterChangementActionnaireFixture.rejetéeLe,
                ),
                rejetéePar: Email.convertirEnValueType(
                  this.#rejeterChangementActionnaireFixture.rejetéePar,
                ),

                réponseSignée: DocumentProjet.convertirEnValueType(
                  identifiantProjet.formatter(),
                  Actionnaire.TypeDocumentActionnaire.changementRejeté.formatter(),
                  DateTime.convertirEnValueType(
                    this.#rejeterChangementActionnaireFixture.rejetéeLe,
                  ).formatter(),
                  this.#rejeterChangementActionnaireFixture.réponseSignée.format,
                ),
              }
            : undefined,
      },
    };
  }
}
