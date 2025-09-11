import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { ModifierInstallationAvecDispositifDeStockageFixture } from '../fixture/modifierInstallationAvecDispositifDeStockage.fixture';
import { LauréatWorld } from '../../lauréat.world';

export class InstallationAvecDispositifDeStockageWorld {
  #modifierInstallationAvecDispositifDeStockageFixture: ModifierInstallationAvecDispositifDeStockageFixture;
  get modifierInstallationAvecDispositifDeStockageFixture() {
    return this.#modifierInstallationAvecDispositifDeStockageFixture;
  }

  constructor(public readonly lauréatWorld: LauréatWorld) {
    this.#modifierInstallationAvecDispositifDeStockageFixture =
      new ModifierInstallationAvecDispositifDeStockageFixture();
  }

  mapToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    const installationAvecDispositifDeStockageÀLaCandidature =
      this.lauréatWorld.candidatureWorld.importerCandidature.dépôtValue
        .installationAvecDispositifDeStockage;

    if (!installationAvecDispositifDeStockageÀLaCandidature) {
      return Option.none;
    }

    const expected: Lauréat.InstallationAvecDispositifDeStockage.ConsulterInstallationAvecDispositifDeStockageReadModel =
      {
        identifiantProjet,
        installationAvecDispositifDeStockage: installationAvecDispositifDeStockageÀLaCandidature,
      };

    if (this.#modifierInstallationAvecDispositifDeStockageFixture.aÉtéCréé) {
      expected.installationAvecDispositifDeStockage =
        this.#modifierInstallationAvecDispositifDeStockageFixture.installationAvecDispositifDeStockage;
    }
    return expected;
  }
}
