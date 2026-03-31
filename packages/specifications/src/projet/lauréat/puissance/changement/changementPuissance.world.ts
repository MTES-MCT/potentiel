import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';

import { DemanderChangementPuissanceFixture } from './fixture/demanderChangementPuissance.fixture.js';
import { AnnulerChangementPuissanceFixture } from './fixture/annulerChangementPuissance.fixture.js';
import { AccorderChangementPuissanceFixture } from './fixture/accorderChangementPuissance.fixture.js';
import { EnregistrerChangementPuissanceFixture } from './fixture/enregistrerChangementPuissance.fixture.js';
import { RejeterChangementPuissanceFixture } from './fixture/rejeterChangementPuissance.fixture.js';

type MapToDemandeExpectedProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: Lauréat.Puissance.StatutChangementPuissance.ValueType;
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
  }: MapToDemandeExpectedProps): Lauréat.Puissance.ConsulterChangementPuissanceReadModel {
    if (
      !this.demanderChangementPuissanceFixture.aÉtéCréé &&
      !this.#enregistrerChangementPuissanceFixture.aÉtéCréé
    ) {
      throw new Error(
        `Aucune demande ou d'information enregistrée n'a été créée dans PuissanceWorld`,
      );
    }

    const baseFixture = this.demanderChangementPuissanceFixture.aÉtéCréé
      ? this.demanderChangementPuissanceFixture
      : this.#enregistrerChangementPuissanceFixture;

    const expected: Lauréat.Puissance.ConsulterChangementPuissanceReadModel = {
      identifiantProjet,
      demande: {
        demandéeLe: DateTime.convertirEnValueType(baseFixture.demandéLe),
        demandéePar: Email.convertirEnValueType(baseFixture.demandéPar),
        nouvellePuissance: baseFixture.ratioPuissance * puissanceActuelle,
        nouvellePuissanceDeSite: baseFixture.puissanceDeSite,
        pièceJustificative: Lauréat.Puissance.DocumentPuissance.pièceJustificative({
          identifiantProjet: identifiantProjet.formatter(),
          demandéLe: baseFixture.demandéLe,
          pièceJustificative: {
            format: baseFixture.pièceJustificative.format,
          },
        }),
        raison: baseFixture.raison,
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

        réponseSignée: Lauréat.Puissance.DocumentPuissance.changementAccordé({
          identifiantProjet: identifiantProjet.formatter(),
          accordéLe: this.#accorderChangementPuissanceFixture.accordéeLe,
          réponseSignée: {
            format: this.#accorderChangementPuissanceFixture.réponseSignée.format,
          },
        }),
      };
    }

    if (this.#rejeterChangementPuissanceFixture.aÉtéCréé) {
      expected.demande.rejet = {
        rejetéeLe: DateTime.convertirEnValueType(this.#rejeterChangementPuissanceFixture.rejetéeLe),
        rejetéePar: Email.convertirEnValueType(this.#rejeterChangementPuissanceFixture.rejetéePar),

        réponseSignée: Lauréat.Puissance.DocumentPuissance.changementRejeté({
          identifiantProjet: identifiantProjet.formatter(),
          rejetéLe: this.#rejeterChangementPuissanceFixture.rejetéeLe,
          réponseSignée: {
            format: this.#rejeterChangementPuissanceFixture.réponseSignée.format,
          },
        }),
      };
    }

    return expected;
  }
}
