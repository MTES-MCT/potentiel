import { NotFoundError } from '@potentiel-domain/core';

export class AucunAbandonEnCours extends NotFoundError {
  constructor() {
    super(`Aucun abandon n'est en cours`);
  }
}
