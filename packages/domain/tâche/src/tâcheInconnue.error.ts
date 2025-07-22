import { AggregateNotFoundError } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import * as TypeTâche from './typeTâche.valueType';

export class TâcheInconnueError extends AggregateNotFoundError {
  constructor(typeTâche: TypeTâche.RawType, identifiantProjet: IdentifiantProjet.RawType) {
    super(`Tâche inconnue`, {
      typeTâche,
      identifiantProjet,
    });
  }
}
