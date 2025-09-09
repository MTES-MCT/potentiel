import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { LauréatWorld } from '../lauréat.world';

import { ModifierInstallateurFixture } from './fixture/modifierInstallateur.fixture';

export class InstallateurWorld {
  #modifierInstallateurFixture: ModifierInstallateurFixture;
  get modifierInstallateurFixture() {
    return this.#modifierInstallateurFixture;
  }

  constructor(public readonly lauréatWorld: LauréatWorld) {
    this.#modifierInstallateurFixture = new ModifierInstallateurFixture();
  }

  mapToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    const installateurALaCandidature =
      this.lauréatWorld.candidatureWorld.importerCandidature.dépôtValue.installateur;

    if (!installateurALaCandidature) {
      return Option.none;
    }

    const expected: Lauréat.Installateur.ConsulterInstallateurReadModel = {
      identifiantProjet,
      installateur: installateurALaCandidature,
    };

    return expected;
  }
}
