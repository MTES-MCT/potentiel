import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { LauréatWorld } from '../../lauréat.world';
import { ModifierDispositifDeStockageFixture } from '../fixture/modifierDispositifDeStockage.fixture';

export class DispositifDeStockageWorld {
  #modifierDispositifDeStockageFixture: ModifierDispositifDeStockageFixture;
  get modifierDispositifDeStockageFixture() {
    return this.#modifierDispositifDeStockageFixture;
  }

  constructor(public readonly lauréatWorld: LauréatWorld) {
    this.#modifierDispositifDeStockageFixture = new ModifierDispositifDeStockageFixture();
  }

  mapToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    const dispositifDeStockageÀLaCandidature =
      this.lauréatWorld.candidatureWorld.importerCandidature.dépôtValue.dispositifDeStockage;

    if (!dispositifDeStockageÀLaCandidature) {
      return Option.none;
    }

    const expected: Lauréat.DispositifDeStockage.ConsulterDispositifDeStockageReadModel = {
      identifiantProjet,
      dispositifDeStockage: Lauréat.DispositifDeStockage.DispositifDeStockage.bind(
        dispositifDeStockageÀLaCandidature,
      ),
    };

    if (this.#modifierDispositifDeStockageFixture.aÉtéCréé) {
      expected.dispositifDeStockage = Lauréat.DispositifDeStockage.DispositifDeStockage.bind(
        this.#modifierDispositifDeStockageFixture.dispositifDeStockage,
      );
    }
    return expected;
  }
}
