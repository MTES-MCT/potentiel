import { AggregateNotFoundError } from '@potentiel-domain/core';

export class AucunProducteurEnCours extends AggregateNotFoundError {
  constructor() {
    super(`Aucun producteur n'est en cours`);
  }
}
