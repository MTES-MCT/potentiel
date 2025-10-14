import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { LauréatWorld } from '../lauréat.world';

import { ModifierInstallateurFixture } from './fixture/modifierInstallateur.fixture';
import { ModifierTypologieDuProjetFixture } from './fixture/modifierTypologieDuProjet.fixture';

export class InstallationWorld {
  #modifierInstallateurFixture: ModifierInstallateurFixture;
  get modifierInstallateurFixture() {
    return this.#modifierInstallateurFixture;
  }

  #modifierTypologieDuProjetFixture: ModifierTypologieDuProjetFixture;
  get modifierTypologieDuProjetFixture() {
    return this.#modifierTypologieDuProjetFixture;
  }

  constructor(public readonly lauréatWorld: LauréatWorld) {
    this.#modifierInstallateurFixture = new ModifierInstallateurFixture();
    this.#modifierTypologieDuProjetFixture = new ModifierTypologieDuProjetFixture();
  }

  mapToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    const installateurÀLaCandidature =
      this.lauréatWorld.candidatureWorld.importerCandidature.dépôtValue.installateur ?? '';

    const typologieDuProjetÀLaCandidature =
      this.lauréatWorld.candidatureWorld.importerCandidature.dépôtValue.typologieDuProjet;

    if (!installateurÀLaCandidature && !typologieDuProjetÀLaCandidature) {
      return Option.none;
    }

    const expected: Lauréat.Installation.ConsulterInstallationReadModel = {
      identifiantProjet,
      installateur: this.#modifierInstallateurFixture.aÉtéCréé
        ? this.#modifierInstallateurFixture.installateur
        : installateurÀLaCandidature,
      typologieDuProjet: this.#modifierTypologieDuProjetFixture.aÉtéCréé
        ? this.#modifierTypologieDuProjetFixture.typologieDuProjet.map(
            Candidature.TypologieDuProjet.convertirEnValueType,
          )
        : typologieDuProjetÀLaCandidature.map(Candidature.TypologieDuProjet.convertirEnValueType),
    };

    return expected;
  }
}
