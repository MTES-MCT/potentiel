import { NotFoundError } from '@potentiel-domain/core';

export class PériodeNonIdentifiéError extends NotFoundError {
  constructor() {
    super(`Le détail de la période n'a pas pu être trouvé.`);
  }
}
