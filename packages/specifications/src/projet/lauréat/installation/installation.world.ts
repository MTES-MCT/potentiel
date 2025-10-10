import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { LauréatWorld } from '../lauréat.world';

import { ModifierInstallateurFixture } from './fixture/modifierInstallateur.fixture';
import { ModifierTypologieInstallationFixture } from './fixture/modifierTypologieInstallation.fixture';

export class InstallationWorld {
  #modifierInstallateurFixture: ModifierInstallateurFixture;
  get modifierInstallateurFixture() {
    return this.#modifierInstallateurFixture;
  }

  #modifierTypologieInstallationFixture: ModifierTypologieInstallationFixture;
  get modifierTypologieInstallationFixture() {
    return this.#modifierTypologieInstallationFixture;
  }

  constructor(public readonly lauréatWorld: LauréatWorld) {
    this.#modifierInstallateurFixture = new ModifierInstallateurFixture();
    this.#modifierTypologieInstallationFixture = new ModifierTypologieInstallationFixture();
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
      typologieInstallation: this.#modifierTypologieInstallationFixture.aÉtéCréé
        ? this.#modifierTypologieInstallationFixture.typologieInstallation.map(
            Candidature.TypologieInstallation.convertirEnValueType,
          )
        : typologieInstallationÀLaCandidature.map(
            Candidature.TypologieInstallation.convertirEnValueType,
          ),
    };

    return expected;
  }
}
