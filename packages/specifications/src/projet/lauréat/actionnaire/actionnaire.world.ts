import { DateTime, Email } from '@potentiel-domain/common';
import { type IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import type { Option } from '@potentiel-libraries/monads';

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
      attestation:
        this.#accorderChangementActionnaireFixture.aÉtéCréé &&
        this.#demanderChangementActionnaireFixture.aÉtéCréé
          ? Lauréat.Actionnaire.DocumentActionnaire.pièceJustificative({
              identifiantProjet: identifiantProjet.formatter(),
              demandéLe: this.#demanderChangementActionnaireFixture.demandéLe,
              pièceJustificative: {
                format: this.#demanderChangementActionnaireFixture.pièceJustificative.format,
              },
            })
          : this.#enregistrerChangementActionnaireFixture.aÉtéCréé
            ? Lauréat.Actionnaire.DocumentActionnaire.pièceJustificative({
                identifiantProjet: identifiantProjet.formatter(),
                demandéLe: this.#enregistrerChangementActionnaireFixture.demandéLe,
                pièceJustificative: {
                  format: this.#enregistrerChangementActionnaireFixture.pièceJustificative.format,
                },
              })
            : this.#modifierActionnaireFixture.aÉtéCréé &&
                this.#modifierActionnaireFixture.pièceJustificative
              ? Lauréat.Actionnaire.DocumentActionnaire.pièceJustificative({
                  identifiantProjet: identifiantProjet.formatter(),
                  demandéLe: this.#modifierActionnaireFixture.dateModification,
                  pièceJustificative: {
                    format: this.#modifierActionnaireFixture.pièceJustificative.format,
                  },
                })
              : undefined,
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
        pièceJustificative: Lauréat.Actionnaire.DocumentActionnaire.pièceJustificative({
          identifiantProjet: identifiantProjet.formatter(),
          demandéLe: baseFixture.demandéLe,
          pièceJustificative: {
            format: baseFixture.pièceJustificative.format,
          },
        }),

        accord: this.#accorderChangementActionnaireFixture.aÉtéCréé
          ? {
              accordéeLe: DateTime.convertirEnValueType(
                this.#accorderChangementActionnaireFixture.accordéeLe,
              ),
              accordéePar: Email.convertirEnValueType(
                this.#accorderChangementActionnaireFixture.accordéePar,
              ),

              réponseSignée: Lauréat.Actionnaire.DocumentActionnaire.changementAccordé({
                identifiantProjet: identifiantProjet.formatter(),
                accordéLe: this.#accorderChangementActionnaireFixture.accordéeLe,
                réponseSignée: {
                  format: this.#accorderChangementActionnaireFixture.réponseSignée.format,
                },
              }),
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

              réponseSignée: Lauréat.Actionnaire.DocumentActionnaire.changementRejeté({
                identifiantProjet: identifiantProjet.formatter(),
                rejetéLe: this.#rejeterChangementActionnaireFixture.rejetéeLe,
                réponseSignée: {
                  format: this.#rejeterChangementActionnaireFixture.réponseSignée.format,
                },
              }),
            }
          : undefined,
      },
    };
  }

  mapToAttestation() {
    if (
      this.#accorderChangementActionnaireFixture.aÉtéCréé &&
      this.#demanderChangementActionnaireFixture.aÉtéCréé
    ) {
      return this.#demanderChangementActionnaireFixture.pièceJustificative;
    }
    if (this.#enregistrerChangementActionnaireFixture.aÉtéCréé) {
      return this.#enregistrerChangementActionnaireFixture.pièceJustificative;
    }
    if (
      this.#modifierActionnaireFixture.aÉtéCréé &&
      this.#modifierActionnaireFixture.pièceJustificative
    ) {
      return this.#modifierActionnaireFixture.pièceJustificative;
    }
  }
}
