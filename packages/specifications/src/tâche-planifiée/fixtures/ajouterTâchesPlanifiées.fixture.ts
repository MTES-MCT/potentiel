import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { AbstractFixture } from '../../fixture';
import { TypeTâchePlanifiée } from '../tâchePlanifiée.world';

type TâchePlanifiée = {
  identifiantProjet: IdentifiantProjet.RawType;
  ajoutéeLe: DateTime.RawType;
  àExécuterLe: DateTime.RawType;
  typeTâchePlanifiée: TypeTâchePlanifiée;
};

interface AjouterTâchesPlanifiées {
  readonly tâches: Array<TâchePlanifiée>;
}

export class AjouterTâchesPlanifiéesFixture
  extends AbstractFixture<AjouterTâchesPlanifiées>
  implements AjouterTâchesPlanifiées
{
  #tâches!: Array<TâchePlanifiée>;

  get tâches(): AjouterTâchesPlanifiées['tâches'] {
    return this.#tâches;
  }

  créer(fixture: AjouterTâchesPlanifiées): AjouterTâchesPlanifiées {
    this.#tâches = fixture.tâches;

    this.aÉtéCréé = true;

    return fixture;
  }
}
