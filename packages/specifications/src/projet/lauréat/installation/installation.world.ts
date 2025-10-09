import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { LauréatWorld } from '../lauréat.world';

import { ModifierInstallateurFixture } from './fixture/modifierInstallateur.fixture';

export class InstallationWorld {
  #modifierInstallateurFixture: ModifierInstallateurFixture;
  get modifierInstallateurFixture() {
    return this.#modifierInstallateurFixture;
  }

  constructor(public readonly lauréatWorld: LauréatWorld) {
    this.#modifierInstallateurFixture = new ModifierInstallateurFixture();
  }

  mapToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    const installateurÀLaCandidature =
      this.lauréatWorld.candidatureWorld.importerCandidature.dépôtValue.installateur ?? '';

    const typologieInstallationÀLaCandidature =
      this.lauréatWorld.candidatureWorld.importerCandidature.dépôtValue.typologieInstallation;

    if (!installateurÀLaCandidature && !typologieInstallationÀLaCandidature) {
      return Option.none;
    }

    const expected: Lauréat.Installation.ConsulterInstallationReadModel = {
      identifiantProjet,
      installateur: this.#modifierInstallateurFixture.aÉtéCréé
        ? this.#modifierInstallateurFixture.installateur
        : installateurÀLaCandidature,
      typologieInstallation: typologieInstallationÀLaCandidature.map(
        Candidature.TypologieInstallation.convertirEnValueType,
      ),
    };

    return expected;
  }
}
