import { NotFoundError } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import * as TypeTâche from './typeTâche.valueType';

export class TâcheInconnueError extends NotFoundError {
  constructor(typeTâche: TypeTâche.RawType, identifiantProjet: IdentifiantProjet.RawType) {
    super(`Tâche inconnue`, {
      typeTâche,
      identifiantProjet,
    });
  }
}
