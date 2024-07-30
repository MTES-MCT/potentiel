import { AggregateNotFoundError } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

export class TâchePlanifiéeInconnueError extends AggregateNotFoundError {
  constructor(typeTâche: string, identifiantProjet: IdentifiantProjet.RawType) {
    super(`Tâche planifiée inconnue`, {
      typeTâche,
      identifiantProjet,
    });
  }
}
