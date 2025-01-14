import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { AbstractFixture } from '../../fixture';
import { TypeTâchePlanifiée } from '../tâchePlanifiée.world';

interface AjouterTâchePlanifiée {
  readonly identifiantProjet: IdentifiantProjet.RawType;
  readonly ajoutéeLe: DateTime.RawType;
  readonly àExécuterLe: DateTime.RawType;
  readonly typeTâchePlanifiée: TypeTâchePlanifiée;
}

export class AjouterTâchePlanifiéeFixture
  extends AbstractFixture<AjouterTâchePlanifiée>
  implements AjouterTâchePlanifiée
{
  #identifiantProjet!: IdentifiantProjet.RawType;

  get identifiantProjet(): IdentifiantProjet.RawType {
    return this.#identifiantProjet;
  }

  #ajoutéeLe!: DateTime.RawType;

  get ajoutéeLe(): DateTime.RawType {
    return this.#ajoutéeLe;
  }

  #àExécuterLe!: DateTime.RawType;

  get àExécuterLe(): DateTime.RawType {
    return this.#àExécuterLe;
  }

  #typeTâchePlanifiée!: TypeTâchePlanifiée;

  get typeTâchePlanifiée(): TypeTâchePlanifiée {
    return this.#typeTâchePlanifiée;
  }

  créer(fixture: Readonly<AjouterTâchePlanifiée>): Readonly<AjouterTâchePlanifiée> {
    this.#identifiantProjet = fixture.identifiantProjet;
    this.#ajoutéeLe = fixture.ajoutéeLe;
    this.#àExécuterLe = fixture.àExécuterLe;
    this.#typeTâchePlanifiée = fixture.typeTâchePlanifiée;

    this.aÉtéCréé = true;

    return fixture;
  }
}
