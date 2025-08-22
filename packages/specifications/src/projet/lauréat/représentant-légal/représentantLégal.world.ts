import { type IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { ChangementReprésentantLégalWorld } from './changement/changementReprésentantLégal.world';
import { ModifierReprésentantLégalFixture } from './fixtures/modifierReprésentantLégal.fixture';

type Expected = Lauréat.ReprésentantLégal.ConsulterReprésentantLégalReadModel & {
  demande?: Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande'];
};

export class ReprésentantLégalWorld {
  #changementReprésentantLégalWorld!: ChangementReprésentantLégalWorld;

  get changementReprésentantLégalWorld() {
    return this.#changementReprésentantLégalWorld;
  }

  #modifierReprésentantLégalFixture: ModifierReprésentantLégalFixture;

  get modifierReprésentantLégalFixture() {
    return this.#modifierReprésentantLégalFixture;
  }

  constructor() {
    // Subworld
    this.#changementReprésentantLégalWorld = new ChangementReprésentantLégalWorld();

    this.#modifierReprésentantLégalFixture = new ModifierReprésentantLégalFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
    nomReprésentantLégal: string,
  ): Lauréat.ReprésentantLégal.ConsulterReprésentantLégalReadModel {
    const expected: Expected = {
      identifiantProjet,
      nomReprésentantLégal,
      typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.inconnu,
    };

    if (this.#modifierReprésentantLégalFixture.aÉtéCréé) {
      expected.nomReprésentantLégal = this.#modifierReprésentantLégalFixture.nomReprésentantLégal;
      expected.typeReprésentantLégal = this.#modifierReprésentantLégalFixture.typeReprésentantLégal;
    }

    if (
      this.#changementReprésentantLégalWorld.demanderOuEnregistrerChangementReprésentantLégalFixture
        .aÉtéCréé
    ) {
      if (
        this.#changementReprésentantLégalWorld.demanderOuEnregistrerChangementReprésentantLégalFixture.statut.estInformationEnregistrée()
      ) {
        expected.nomReprésentantLégal =
          this.#changementReprésentantLégalWorld.demanderOuEnregistrerChangementReprésentantLégalFixture.nomReprésentantLégal;
        expected.typeReprésentantLégal =
          this.#changementReprésentantLégalWorld.demanderOuEnregistrerChangementReprésentantLégalFixture.typeReprésentantLégal;
      } else {
        expected.demandeEnCours = {
          demandéLe:
            this.#changementReprésentantLégalWorld
              .demanderOuEnregistrerChangementReprésentantLégalFixture.demandéLe,
        };
      }
    }

    if (
      this.#changementReprésentantLégalWorld.accorderChangementReprésentantLégalFixture.aÉtéCréé
    ) {
      expected.nomReprésentantLégal =
        this.#changementReprésentantLégalWorld.accorderChangementReprésentantLégalFixture.nomReprésentantLégal;
      expected.typeReprésentantLégal =
        this.#changementReprésentantLégalWorld.accorderChangementReprésentantLégalFixture.typeReprésentantLégal;

      delete expected.demandeEnCours;
    }

    if (this.#changementReprésentantLégalWorld.rejeterChangementReprésentantLégalFixture.aÉtéCréé) {
      delete expected.demandeEnCours;
    }

    if (this.#changementReprésentantLégalWorld.annulerChangementReprésentantLégalFixture.aÉtéCréé) {
      delete expected.demandeEnCours;
    }

    return expected;
  }
}
