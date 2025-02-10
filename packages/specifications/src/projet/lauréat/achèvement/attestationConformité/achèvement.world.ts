import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Actionnaire } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { DocumentProjet } from '@potentiel-domain/document';

import { ImporterActionnaireFixture } from './fixtures/importerActionnaire.fixture';
import { ModifierActionnaireFixture } from './fixtures/modifierActionnaire.fixture';

export class AchèvementWorld {
  #transmettreAttestationConformitéFixture: ImporterActionnaireFixture;
  #modifierAttestationConformitéFixture: ModifierActionnaireFixture;

  get transmettreAttestationConformitéFixture() {
    return this.#transmettreAttestationConformitéFixture;
  }

  get modifierAttestationConformitéFixture() {
    return this.#modifierAttestationConformitéFixture;
  }

  constructor() {
    this.#transmettreAttestationConformitéFixture = new ImporterActionnaireFixture();
    this.#modifierAttestationConformitéFixture = new ModifierActionnaireFixture();
  }

  mapoExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    statut: Actionnaire.StatutChangementActionnaire.ValueType,
    estUneNouvelleDemande?: boolean,
  ): Option.Type<Actionnaire.ConsulterChangementActionnaireReadModel> {
    if (!this.transmettreAttestationConformitéFixture.aÉtéCréé) {
      throw new Error(
        `Aucune transmission d'attestation de conformité n'a été crée dans AchèvementWorld`,
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
