import { DateTime, Email } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { DocumentProjet, IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { AccorderChangementActionnaireFixture } from './fixtures/accorderChangementActionnaire.fixture.js';
import { AnnulerChangementActionnaireFixture } from './fixtures/annulerChangementActionnaire.fixture.js';
import { DemanderChangementActionnaireFixture } from './fixtures/demanderChangementActionnaire.fixture.js';
import { EnregistrerChangementActionnaireFixture } from './fixtures/enregistrerChangementActionnaire.fixture.js';
import { ModifierActionnaireFixture } from './fixtures/modifierActionnaire.fixture.js';
import { RejeterChangementActionnaireFixture } from './fixtures/rejeterChangementActionnaire.fixture.js';

export class ActionnaireWorld {
  #modifierActionnaireFixture: ModifierActionnaireFixture;
  #demanderChangementActionnaireFixture: DemanderChangementActionnaireFixture;
  #annulerChangementActionnaireFixture: AnnulerChangementActionnaireFixture;
  #accorderChangementActionnaireFixture: AccorderChangementActionnaireFixture;
  #rejeterChangementActionnaireFixture: RejeterChangementActionnaireFixture;
  #enregistrerChangementActionnaireFixture: EnregistrerChangementActionnaireFixture;

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
    this.#modifierActionnaireFixture = new ModifierActionnaireFixture();
    this.#demanderChangementActionnaireFixture = new DemanderChangementActionnaireFixture();
    this.#enregistrerChangementActionnaireFixture = new EnregistrerChangementActionnaireFixture();
    this.#annulerChangementActionnaireFixture = new AnnulerChangementActionnaireFixture();
    this.#accorderChangementActionnaireFixture = new AccorderChangementActionnaireFixture();
    this.#rejeterChangementActionnaireFixture = new RejeterChangementActionnaireFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    actionnaireInitial: string,
  ): Lauréat.Actionnaire.ConsulterActionnaireReadModel {
    return {
      identifiantProjet,
      actionnaire: this.accorderChangementActionnaireFixture.aÉtéCréé
        ? this.#demanderChangementActionnaireFixture.actionnaire
        : this.#enregistrerChangementActionnaireFixture.aÉtéCréé
          ? this.#enregistrerChangementActionnaireFixture.actionnaire
          : this.#modifierActionnaireFixture.aÉtéCréé
            ? this.#modifierActionnaireFixture.actionnaire
            : actionnaireInitial,
      aUneDemandeEnCours:
        this.#demanderChangementActionnaireFixture.aÉtéCréé &&
        !this.#accorderChangementActionnaireFixture.aÉtéCréé &&
        !this.#annulerChangementActionnaireFixture.aÉtéCréé &&
        !this.#rejeterChangementActionnaireFixture.aÉtéCréé,
      dateDernièreDemande: this.#demanderChangementActionnaireFixture.aÉtéCréé
        ? DateTime.convertirEnValueType(this.demanderChangementActionnaireFixture.demandéLe)
        : undefined,
    };
  }

  mapDemandeToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    statut: Lauréat.Actionnaire.StatutChangementActionnaire.ValueType,
  ): Option.Type<Lauréat.Actionnaire.ConsulterChangementActionnaireReadModel> {
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
          Lauréat.Actionnaire.TypeDocumentActionnaire.pièceJustificative.formatter(),
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
                Lauréat.Actionnaire.TypeDocumentActionnaire.changementAccordé.formatter(),
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
                Lauréat.Actionnaire.TypeDocumentActionnaire.changementRejeté.formatter(),
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
