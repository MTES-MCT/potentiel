import { Puissance } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { ImporterPuissanceFixture } from './fixture/importerPuissance.fixture';
import { ModifierPuissanceFixture } from './fixture/modifierPuissance.fixture';
import { ChangementPuissanceWorld } from './changement/changementPuissance.world';

export class PuissanceWorld {
  #changementPuissanceWorld!: ChangementPuissanceWorld;
  get changementPuissanceWorld() {
    return this.#changementPuissanceWorld;
  }

  #importerPuissanceFixture: ImporterPuissanceFixture;
  get importerPuissanceFixture() {
    return this.#importerPuissanceFixture;
  }

  #modifierPuissanceFixture: ModifierPuissanceFixture;
  get modifierPuissanceFixture() {
    return this.#modifierPuissanceFixture;
  }

  constructor() {
    this.#importerPuissanceFixture = new ImporterPuissanceFixture();
    this.#modifierPuissanceFixture = new ModifierPuissanceFixture();
    this.#changementPuissanceWorld = new ChangementPuissanceWorld();
  }

  mapToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    const expected: Puissance.ConsulterPuissanceReadModel = {
      identifiantProjet,
      puissance: this.#importerPuissanceFixture.puissance,
    };

    if (this.#modifierPuissanceFixture.aÉtéCréé) {
      expected.puissance = this.#modifierPuissanceFixture.puissance;
    }

    if (this.#changementPuissanceWorld.demanderChangementPuissanceFixture.aÉtéCréé) {
      expected.dateDemandeEnCours = DateTime.convertirEnValueType(
        this.#changementPuissanceWorld.demanderChangementPuissanceFixture.demandéLe,
      );

      if (this.#changementPuissanceWorld.accorderChangementPuissanceFixture.aÉtéCréé) {
        expected.puissance = this.#changementPuissanceWorld.mapToExpected({
          identifiantProjet,
          statut: Puissance.StatutChangementPuissance.accordé,
          puissanceActuelle: expected.puissance,
        }).demande.nouvellePuissance;
        expected.dateDemandeEnCours = undefined;
      }
    }

    return expected;
  }
}
