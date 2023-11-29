import { NotFoundError } from '@potentiel-domain/core';

export class AucunCahierDesChargesTrouvéError extends NotFoundError {
  constructor() {
    super(`Aucun cahier des charges n'a été trouvé`);
  }
}
