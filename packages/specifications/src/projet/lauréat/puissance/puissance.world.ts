import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { ModifierPuissanceFixture } from './fixture/modifierPuissance.fixture.js';
import { ChangementPuissanceWorld } from './changement/changementPuissance.world.js';

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

  mapExempleToFixtureValues(exemple: Record<string, string>) {
    return {
      ratioPuissance: Number(exemple['ratio puissance']),
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
      aUneDemandeEnCours: false,
    };

    if (this.#modifierPuissanceFixture.aÉtéCréé) {
      expected.puissance = this.#modifierPuissanceFixture.puissance;
    }

    if (this.#changementPuissanceWorld.demanderChangementPuissanceFixture.aÉtéCréé) {
      expected.dateDernièreDemande = DateTime.convertirEnValueType(
        this.#changementPuissanceWorld.demanderChangementPuissanceFixture.demandéLe,
      );
      expected.aUneDemandeEnCours = true;

      if (
        this.#changementPuissanceWorld.annulerChangementPuissanceFixture.aÉtéCréé ||
        this.#changementPuissanceWorld.rejeterChangementPuissanceFixture.aÉtéCréé
      ) {
        expected.aUneDemandeEnCours = false;
      }

      if (this.#changementPuissanceWorld.accorderChangementPuissanceFixture.aÉtéCréé) {
        expected.puissance = this.#changementPuissanceWorld.mapToExpected({
          identifiantProjet,
          statut: Lauréat.Puissance.StatutChangementPuissance.accordé,
          puissanceActuelle: puissanceInitiale,
        }).demande.nouvellePuissance;
        expected.puissanceDeSite = this.#changementPuissanceWorld.mapToExpected({
          identifiantProjet,
          statut: Lauréat.Puissance.StatutChangementPuissance.accordé,
          puissanceActuelle: puissanceInitiale,
        }).demande.nouvellePuissanceDeSite;
        expected.aUneDemandeEnCours = false;
      }
    }

    return expected;
  }
}
