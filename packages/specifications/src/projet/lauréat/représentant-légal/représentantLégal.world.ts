import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { ModifierReprésentantLégalFixture } from './fixtures/modifierReprésentantLégal.fixture';
import { ChangementReprésentantLégalWorld } from './changement/changementReprésentantLégal.world';

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
      this.#changementReprésentantLégalWorld.demanderChangementReprésentantLégalFixture.aÉtéCréé
    ) {
      expected.demandeEnCours = {
        demandéLe:
          this.#changementReprésentantLégalWorld.demanderChangementReprésentantLégalFixture
            .demandéLe,
      };
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
