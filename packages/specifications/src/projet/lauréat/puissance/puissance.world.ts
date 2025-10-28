import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { ModifierPuissanceFixture } from './fixture/modifierPuissance.fixture';
import { ChangementPuissanceWorld } from './changement/changementPuissance.world';

export class PuissanceWorld {
  #changementPuissanceWorld!: ChangementPuissanceWorld;
  get changementPuissanceWorld() {
    return this.#changementPuissanceWorld;
  }

  #modifierPuissanceFixture: ModifierPuissanceFixture;
  get modifierPuissanceFixture() {
    return this.#modifierPuissanceFixture;
  }

  constructor() {
    this.#modifierPuissanceFixture = new ModifierPuissanceFixture();
    this.#changementPuissanceWorld = new ChangementPuissanceWorld();
  }

  mapExempleToFixtureValues(exemple: Record<string, string>, candidatureValue: number) {
    return {
      ratioPuissance:
        exemple['nouvelle puissance'] !== undefined
          ? Number(exemple['nouvelle puissance']) / candidatureValue
          : Number(exemple['ratio puissance']),
      // viovio - à voir si cela suffit
      puissanceDeSite: exemple['puissance de site']
        ? Number(exemple['puissance de site'])
        : undefined,
    };
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    puissanceInitiale: number,
    unitéPuissance: Candidature.UnitéPuissance.ValueType,
    puissanceDeSiteInitiale?: number,
  ) {
    const expected: Lauréat.Puissance.ConsulterPuissanceReadModel = {
      identifiantProjet,
      puissance: this.#changementPuissanceWorld.enregistrerChangementPuissanceFixture.aÉtéCréé
        ? this.#changementPuissanceWorld.enregistrerChangementPuissanceFixture.ratioPuissance *
          puissanceInitiale
        : this.#modifierPuissanceFixture.aÉtéCréé
          ? this.#modifierPuissanceFixture.puissance
          : puissanceInitiale,
      puissanceDeSite: this.#changementPuissanceWorld.enregistrerChangementPuissanceFixture.aÉtéCréé
        ? this.#changementPuissanceWorld.enregistrerChangementPuissanceFixture.puissanceDeSite
        : this.#modifierPuissanceFixture.aÉtéCréé
          ? this.#modifierPuissanceFixture.puissanceDeSite
          : puissanceDeSiteInitiale,
      puissanceInitiale,
      unitéPuissance,
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
          statut: Lauréat.Puissance.StatutChangementPuissance.accordé,
          puissanceActuelle: puissanceInitiale,
        }).demande.nouvellePuissance;
        expected.dateDemandeEnCours = undefined;
      }

      if (this.#changementPuissanceWorld.rejeterChangementPuissanceFixture.aÉtéCréé) {
        expected.dateDemandeEnCours = undefined;
      }
    }

    return expected;
  }
}
