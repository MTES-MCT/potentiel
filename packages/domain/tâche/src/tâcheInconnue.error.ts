import { AggregateNotFoundError } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

export class TâcheInconnueError extends AggregateNotFoundError {
  constructor(typeTâche: string, identifiantProjet: IdentifiantProjet.RawType) {
    super(`Tâche inconnue`, {
      typeTâche,
      identifiantProjet,
    });
  }
}
