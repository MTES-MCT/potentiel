import { NotFoundError } from '@potentiel-domain/core';

/**
 * @deprecated L'erreur région trouvée n'est pas une erreur common mais une erreur métier
 */
export class RégionNonTrouvéeError extends NotFoundError {
  constructor() {
    super(`La région n'a pas pu être identifiée.`);
  }
}
