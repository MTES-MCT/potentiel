import { Puissance } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Option } from '@potentiel-libraries/monads';

import { DemanderChangementPuissanceFixture } from './fixture/demanderChangementPuissance.fixture';
import { AnnulerChangementPuissanceFixture } from './fixture/annulerChangementPuissance.fixture';
import { EnregistrerChangementPuissanceFixture } from './fixture/enregistrerChangementPuissance.fixture';

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

  constructor() {
    this.#demanderChangementPuissanceFixture = new DemanderChangementPuissanceFixture();
    this.#annulerChangementPuissanceFixture = new AnnulerChangementPuissanceFixture();
    this.#enregistrerChangementPuissanceFixture = new EnregistrerChangementPuissanceFixture();
  }

  mapToExpected({
    identifiantProjet,
    statut,
    puissanceActuelle,
  }: MapToDemandeExpectedProps): Option.Type<Puissance.ConsulterChangementPuissanceReadModel> {
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

    return {
      identifiantProjet,

      demande: {
        nouvellePuissance: baseFixture.ratio * puissanceActuelle,
        autoritéCompétente: this.#enregistrerChangementPuissanceFixture.aÉtéCréé
          ? undefined
          : Puissance.RatioChangementPuissance.bind({
              ratio: baseFixture.ratio,
            }).getAutoritéCompétente(),
        statut,
        demandéeLe: DateTime.convertirEnValueType(baseFixture.demandéLe),
        demandéePar: Email.convertirEnValueType(baseFixture.demandéPar),
        raison: baseFixture.raison,
        pièceJustificative: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Puissance.TypeDocumentPuissance.pièceJustificative.formatter(),
          DateTime.convertirEnValueType(baseFixture.demandéLe).formatter(),
          baseFixture.pièceJustificative.format,
        ),

        accord: undefined,

        rejet: undefined,
      },
    };
  }
}
