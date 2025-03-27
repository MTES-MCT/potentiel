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
import { EnregistrerChangementActionnaireFixture } from './fixtures/enregistrerChangementActionnaire.fixture';

export class ActionnaireWorld {
  #importerActionnaireFixture: ImporterActionnaireFixture;
  #modifierActionnaireFixture: ModifierActionnaireFixture;
  #demanderChangementActionnaireFixture: DemanderChangementActionnaireFixture;
  #annulerChangementActionnaireFixture: AnnulerChangementActionnaireFixture;
  #accorderChangementActionnaireFixture: AccorderChangementActionnaireFixture;
  #rejeterChangementActionnaireFixture: RejeterChangementActionnaireFixture;
  #enregistrerChangementActionnaireFixture: EnregistrerChangementActionnaireFixture;

  get importerActionnaireFixture() {
    return this.#importerActionnaireFixture;
  }

  get modifierActionnaireFixture() {
    return this.#modifierActionnaireFixture;
  }

  get demanderChangementActionnaireFixture() {
    return this.#demanderChangementActionnaireFixture;
  }

  get enregistrerChangementActionnaireFixture() {
    return this.#enregistrerChangementActionnaireFixture;
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

  constructor() {
    this.#importerActionnaireFixture = new ImporterActionnaireFixture();
    this.#modifierActionnaireFixture = new ModifierActionnaireFixture();
    this.#demanderChangementActionnaireFixture = new DemanderChangementActionnaireFixture();
    this.#enregistrerChangementActionnaireFixture = new EnregistrerChangementActionnaireFixture();
    this.#annulerChangementActionnaireFixture = new AnnulerChangementActionnaireFixture();
    this.#accorderChangementActionnaireFixture = new AccorderChangementActionnaireFixture();
    this.#rejeterChangementActionnaireFixture = new RejeterChangementActionnaireFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): Actionnaire.ConsulterActionnaireReadModel {
    return {
      identifiantProjet,
      actionnaire: this.accorderChangementActionnaireFixture.aÉtéCréé
        ? this.#demanderChangementActionnaireFixture.actionnaire
        : this.#enregistrerChangementActionnaireFixture.aÉtéCréé
          ? this.#enregistrerChangementActionnaireFixture.actionnaire
          : this.#modifierActionnaireFixture.aÉtéCréé
            ? this.#modifierActionnaireFixture.actionnaire
            : this.#importerActionnaireFixture.actionnaire,
    };
  }

  mapDemandeToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    statut: Actionnaire.StatutChangementActionnaire.ValueType,
  ): Option.Type<Actionnaire.ConsulterChangementActionnaireReadModel> {
    if (
      !this.enregistrerChangementActionnaireFixture.aÉtéCréé &&
      !this.demanderChangementActionnaireFixture.aÉtéCréé
    ) {
      throw new Error(
        `Aucune information enregistrée ou demande n'a été créée dans ActionnaireWorld`,
      );
    }

    const baseFixture = this.#enregistrerChangementActionnaireFixture.aÉtéCréé
      ? this.#enregistrerChangementActionnaireFixture
      : this.#demanderChangementActionnaireFixture;

    return {
      identifiantProjet,

      demande: {
        nouvelActionnaire: baseFixture.actionnaire,
        statut,
        demandéeLe: DateTime.convertirEnValueType(baseFixture.demandéLe),
        demandéePar: Email.convertirEnValueType(baseFixture.demandéPar),
        raison: baseFixture.raison,
        pièceJustificative: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Actionnaire.TypeDocumentActionnaire.pièceJustificative.formatter(),
          DateTime.convertirEnValueType(baseFixture.demandéLe).formatter(),
          baseFixture.pièceJustificative.format,
        ),

        accord: this.#accorderChangementActionnaireFixture.aÉtéCréé
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

        rejet: this.#rejeterChangementActionnaireFixture.aÉtéCréé
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
