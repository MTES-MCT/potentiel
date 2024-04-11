import { NotFoundError } from '@potentiel-domain/core';

export class périodeNonIdentifiéError extends NotFoundError {
  constructor() {
    super(`Le détail de la période n'a pas pu être trouvé.`);
  }
}
