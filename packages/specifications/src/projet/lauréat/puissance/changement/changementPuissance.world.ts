import { Puissance } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { DemanderChangementPuissanceFixture } from './fixture/demanderChangementPuissance.fixture';
import { AnnulerChangementPuissanceFixture } from './fixture/annulerChangementPuissance.fixture';
import { AccorderChangementPuissanceFixture } from './fixture/accorderChangementPuissance.fixture';
import { EnregistrerChangementPuissanceFixture } from './fixture/enregistrerChangementPuissance.fixture';
import { RejeterChangementPuissanceFixture } from './fixture/rejeterChangementPuissance.fixture';

type MapToDemandeExpectedProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: Puissance.StatutChangementPuissance.ValueType;
  puissanceActuelle: number;
};

export class ChangementPuissanceWorld {
  #demanderChangementPuissanceFixture: DemanderChangementPuissanceFixture;
  get demanderChangementPuissanceFixture() {
    return this.#demanderChangementPuissanceFixture;
  }

  #annulerChangementPuissanceFixture: AnnulerChangementPuissanceFixture;
  get annulerChangementPuissanceFixture() {
    return this.#annulerChangementPuissanceFixture;
  }

  #enregistrerChangementPuissanceFixture: EnregistrerChangementPuissanceFixture;
  get enregistrerChangementPuissanceFixture() {
    return this.#enregistrerChangementPuissanceFixture;
  }

  #accorderChangementPuissanceFixture: AccorderChangementPuissanceFixture;
  get accorderChangementPuissanceFixture() {
    return this.#accorderChangementPuissanceFixture;
  }

  #rejeterChangementPuissanceFixture: RejeterChangementPuissanceFixture;
  get rejeterChangementPuissanceFixture() {
    return this.#rejeterChangementPuissanceFixture;
  }

  constructor() {
    this.#demanderChangementPuissanceFixture = new DemanderChangementPuissanceFixture();
    this.#annulerChangementPuissanceFixture = new AnnulerChangementPuissanceFixture();
    this.#enregistrerChangementPuissanceFixture = new EnregistrerChangementPuissanceFixture();
    this.#accorderChangementPuissanceFixture = new AccorderChangementPuissanceFixture();
    this.#rejeterChangementPuissanceFixture = new RejeterChangementPuissanceFixture();
  }

  mapToExpected({
    identifiantProjet,
    statut,
    puissanceActuelle,
  }: MapToDemandeExpectedProps): Puissance.ConsulterChangementPuissanceReadModel {
    if (
      !this.demanderChangementPuissanceFixture.aÉtéCréé &&
      !this.#enregistrerChangementPuissanceFixture.aÉtéCréé
    ) {
      throw new Error(
        `Aucune demande ou d'information enregistrée n'a été créée dans PuissanceWorld`,
      );
    }

    const expected: Puissance.ConsulterChangementPuissanceReadModel = {
      identifiantProjet,
      demande: this.demanderChangementPuissanceFixture.aÉtéCréé
        ? {
            demandéeLe: DateTime.convertirEnValueType(
              this.demanderChangementPuissanceFixture.demandéLe,
            ),
            demandéePar: Email.convertirEnValueType(
              this.demanderChangementPuissanceFixture.demandéPar,
            ),
            nouvellePuissance: this.demanderChangementPuissanceFixture.ratio * puissanceActuelle,
            pièceJustificative: DocumentProjet.convertirEnValueType(
              identifiantProjet.formatter(),
              Puissance.TypeDocumentPuissance.pièceJustificative.formatter(),
              DateTime.convertirEnValueType(
                this.demanderChangementPuissanceFixture.demandéLe,
              ).formatter(),
              this.demanderChangementPuissanceFixture.pièceJustificative.format,
            ),
            raison: this.demanderChangementPuissanceFixture.raison,
            statut,
            autoritéCompétente: Puissance.RatioChangementPuissance.bind({
              ratio: this.demanderChangementPuissanceFixture.ratio,
            }).getAutoritéCompétente(),
          }
        : {
            demandéeLe: DateTime.convertirEnValueType(
              this.#enregistrerChangementPuissanceFixture.demandéLe,
            ),
            demandéePar: Email.convertirEnValueType(
              this.#enregistrerChangementPuissanceFixture.demandéPar,
            ),
            nouvellePuissance:
              this.#enregistrerChangementPuissanceFixture.ratio * puissanceActuelle,
            pièceJustificative: DocumentProjet.convertirEnValueType(
              identifiantProjet.formatter(),
              Puissance.TypeDocumentPuissance.pièceJustificative.formatter(),
              DateTime.convertirEnValueType(
                this.#enregistrerChangementPuissanceFixture.demandéLe,
              ).formatter(),
              this.#enregistrerChangementPuissanceFixture.pièceJustificative.format,
            ),
            raison: this.#enregistrerChangementPuissanceFixture.raison,
            statut,
          },
    };

    if (this.#accorderChangementPuissanceFixture.aÉtéCréé) {
      expected.demande.accord = {
        accordéeLe: DateTime.convertirEnValueType(
          this.#accorderChangementPuissanceFixture.accordéeLe,
        ),
        accordéePar: Email.convertirEnValueType(
          this.#accorderChangementPuissanceFixture.accordéePar,
        ),

        réponseSignée: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Puissance.TypeDocumentPuissance.changementAccordé.formatter(),
          DateTime.convertirEnValueType(
            this.#accorderChangementPuissanceFixture.accordéeLe,
          ).formatter(),
          this.#accorderChangementPuissanceFixture.réponseSignée.format,
        ),
      };
    }

    if (this.#rejeterChangementPuissanceFixture.aÉtéCréé) {
      expected.demande.rejet = {
        rejetéeLe: DateTime.convertirEnValueType(this.#rejeterChangementPuissanceFixture.rejetéeLe),
        rejetéePar: Email.convertirEnValueType(this.#rejeterChangementPuissanceFixture.rejetéePar),

        réponseSignée: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Puissance.TypeDocumentPuissance.changementRejeté.formatter(),
          DateTime.convertirEnValueType(
            this.#rejeterChangementPuissanceFixture.rejetéeLe,
          ).formatter(),
          this.#rejeterChangementPuissanceFixture.réponseSignée.format,
        ),
      };
    }

    return expected;
  }
}
