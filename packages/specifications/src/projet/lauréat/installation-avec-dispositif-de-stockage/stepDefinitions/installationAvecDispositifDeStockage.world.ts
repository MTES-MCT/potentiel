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
    const dispositifDeStockageÀLaCandidature =
      this.lauréatWorld.candidatureWorld.importerCandidature.dépôtValue.dispositifDeStockage;

    if (!dispositifDeStockageÀLaCandidature) {
      return Option.none;
    }

    const expected: Lauréat.InstallationAvecDispositifDeStockage.ConsulterInstallationAvecDispositifDeStockageReadModel =
      {
        identifiantProjet,
        dispositifDeStockage:
          Lauréat.InstallationAvecDispositifDeStockage.DispositifDeStockage.bind(
            dispositifDeStockageÀLaCandidature,
          ),
      };

    if (this.#modifierInstallationAvecDispositifDeStockageFixture.aÉtéCréé) {
      expected.dispositifDeStockage =
        Lauréat.InstallationAvecDispositifDeStockage.DispositifDeStockage.bind(
          this.#modifierInstallationAvecDispositifDeStockageFixture.dispositifDeStockage,
        );
    }
    return expected;
  }
}
