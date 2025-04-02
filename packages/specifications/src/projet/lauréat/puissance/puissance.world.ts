import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Puissance } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { DocumentProjet } from '@potentiel-domain/document';

import { ImporterPuissanceFixture } from './fixture/importerPuissance.fixture';
import { ModifierPuissanceFixture } from './fixture/modifierPuissance.fixture';
import { DemanderChangementPuissanceFixture } from './fixture/demanderChangementPuissance.fixture';

export class PuissanceWorld {
  #importerPuissanceFixture: ImporterPuissanceFixture;
  #modifierPuissanceFixture: ModifierPuissanceFixture;
  #demanderChangementPuissanceFixture: DemanderChangementPuissanceFixture;

  get importerPuissanceFixture() {
    return this.#importerPuissanceFixture;
  }

  get modifierPuissanceFixture() {
    return this.#modifierPuissanceFixture;
  }

  get demanderChangementPuissanceFixture() {
    return this.#demanderChangementPuissanceFixture;
  }

  constructor() {
    this.#importerPuissanceFixture = new ImporterPuissanceFixture();
    this.#modifierPuissanceFixture = new ModifierPuissanceFixture();
    this.#demanderChangementPuissanceFixture = new DemanderChangementPuissanceFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): Puissance.ConsulterPuissanceReadModel {
    const expected = {
      identifiantProjet,
      puissance: this.#modifierPuissanceFixture.aÉtéCréé
        ? this.#modifierPuissanceFixture.puissance
        : this.#importerPuissanceFixture.puissance,
    };

    return expected;
  }

  mapDemandeToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    statut: Puissance.StatutChangementPuissance.ValueType,
  ): Option.Type<Puissance.ConsulterChangementPuissanceReadModel> {
    if (!this.demanderChangementPuissanceFixture.aÉtéCréé) {
      throw new Error(`Aucune demande n'a été créée dans PuissanceWorld`);
    }

    const baseFixture = this.#demanderChangementPuissanceFixture;

    return {
      identifiantProjet,

      demande: {
        nouvellePuissance: baseFixture.ratio * this.#importerPuissanceFixture.puissance,
        autoritéCompétente: Puissance.RèglesRatioPuissance.bind({
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
