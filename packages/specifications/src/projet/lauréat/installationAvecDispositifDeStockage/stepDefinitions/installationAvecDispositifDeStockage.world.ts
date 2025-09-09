import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { LauréatWorld } from '../../lauréat.world';

export class InstallationAvecDispositifDeStockageWorld {
  constructor(public readonly lauréatWorld: LauréatWorld) {}

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

    return expected;
  }
}
