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

    const baseFixture = this.#enregistrerChangementPuissanceFixture.aÉtéCréé
      ? this.#enregistrerChangementPuissanceFixture
      : this.#demanderChangementPuissanceFixture;

    const commonDemande = {
      nouvellePuissance: baseFixture.ratio * puissanceActuelle,
      demandéeLe: DateTime.convertirEnValueType(baseFixture.demandéLe),
      demandéePar: Email.convertirEnValueType(baseFixture.demandéPar),
      raison: baseFixture.raison,
      pièceJustificative: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Puissance.TypeDocumentPuissance.pièceJustificative.formatter(),
        DateTime.convertirEnValueType(baseFixture.demandéLe).formatter(),
        baseFixture.pièceJustificative.format,
      ),
      statut,
    };

    return {
      identifiantProjet,

      demande: this.#enregistrerChangementPuissanceFixture.aÉtéCréé
        ? {
            ...commonDemande,
            isInformationEnregistrée: true,
          }
        : {
            ...commonDemande,
            isInformationEnregistrée: false,
            autoritéCompétente: Puissance.RatioChangementPuissance.bind({
              ratio: baseFixture.ratio,
            }).getAutoritéCompétente(),
            accord: this.#accorderChangementPuissanceFixture.aÉtéCréé
              ? {
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
                }
              : undefined,
            rejet: undefined,
          },
    };
  }
}
