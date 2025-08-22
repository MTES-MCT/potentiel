import { AggregateNotFoundError } from '@potentiel-domain/core';
import type { IdentifiantProjet } from '@potentiel-domain/projet';

import type * as TypeTâche from './typeTâche.valueType';

export class TâcheInconnueError extends AggregateNotFoundError {
  constructor(typeTâche: TypeTâche.RawType, identifiantProjet: IdentifiantProjet.RawType) {
    super(`Tâche inconnue`, {
      typeTâche,
      identifiantProjet,
    });
  }
}
