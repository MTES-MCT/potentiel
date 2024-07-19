import { AggregateNotFoundError } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import * as TypeTâchePlanifiée from './typeTâchePlanifiée.valueType';

export class TâchePlanifiéeInconnueError extends AggregateNotFoundError {
  constructor(typeTâche: TypeTâchePlanifiée.RawType, identifiantProjet: IdentifiantProjet.RawType) {
    super(`Tâche planifiée inconnue`, {
      typeTâche,
      identifiantProjet,
    });
  }
}
