import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Actionnaire } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { DocumentProjet } from '@potentiel-domain/document';

import { ImporterActionnaireFixture } from './fixtures/importerActionnaire.fixture';
import { ModifierActionnaireFixture } from './fixtures/modifierActionnaire.fixture';
import { DemanderChangementActionnaireFixture } from './fixtures/demanderChangementActionnaire.fixture';
import { AnnulerDemandeChangementActionnaireFixture } from './fixtures/annulerDemandeChangementActionnaire.fixture';
import { AccorderChangementActionnaireFixture } from './fixtures/accorderChangementActionnaire.fixture';

export class ActionnaireWorld {
  #importerActionnaireFixture: ImporterActionnaireFixture;
  #modifierActionnaireFixture: ModifierActionnaireFixture;
  #demanderChangementActionnaireFixture: DemanderChangementActionnaireFixture;
  #annulerDemandeChangementActionnaireFixture: AnnulerDemandeChangementActionnaireFixture;
  #accorderChangementActionnaireFixture: AccorderChangementActionnaireFixture;

  get importerActionnaireFixture() {
    return this.#importerActionnaireFixture;
  }

  get modifierActionnaireFixture() {
    return this.#modifierActionnaireFixture;
  }

  get demanderChangementActionnaireFixture() {
    return this.#demanderChangementActionnaireFixture;
  }

  get annulerDemandeChangementActionnaireFixture() {
    return this.#annulerDemandeChangementActionnaireFixture;
  }

  get accorderChangementActionnaireFixture() {
    return this.#accorderChangementActionnaireFixture;
  }

  constructor() {
    this.#importerActionnaireFixture = new ImporterActionnaireFixture();
    this.#modifierActionnaireFixture = new ModifierActionnaireFixture();
    this.#demanderChangementActionnaireFixture = new DemanderChangementActionnaireFixture();
    this.#annulerDemandeChangementActionnaireFixture =
      new AnnulerDemandeChangementActionnaireFixture();
    this.#accorderChangementActionnaireFixture = new AccorderChangementActionnaireFixture();
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

    return expected;
  }

  mapDemandeToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): Option.Type<Actionnaire.ConsulterChangementActionnaireReadModel> {
    if (!this.demanderChangementActionnaireFixture.aÉtéCréé) {
      return Option.none;
    }

    return {
      identifiantProjet,
      demande: {
        statut: this.#accorderChangementActionnaireFixture.aÉtéCréé
          ? Actionnaire.StatutChangementActionnaire.accordé
          : Actionnaire.StatutChangementActionnaire.demandé,

        demandéLe: DateTime.convertirEnValueType(
          this.#demanderChangementActionnaireFixture.demandéLe,
        ),
        demandéPar: Email.convertirEnValueType(
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
        accord: this.#accorderChangementActionnaireFixture.aÉtéCréé
          ? {
              accordéLe: DateTime.convertirEnValueType(
                this.#accorderChangementActionnaireFixture.accordéLe,
              ),
              accordéPar: Email.convertirEnValueType(
                this.#accorderChangementActionnaireFixture.accordéPar,
              ),

              réponseSignée: DocumentProjet.convertirEnValueType(
                identifiantProjet.formatter(),
                Actionnaire.TypeDocumentActionnaire.changementAccordé.formatter(),
                DateTime.convertirEnValueType(
                  this.#accorderChangementActionnaireFixture.accordéLe,
                ).formatter(),
                this.#accorderChangementActionnaireFixture.réponseSignée.format,
              ),
            }
          : undefined,
      },
    };
  }
}
