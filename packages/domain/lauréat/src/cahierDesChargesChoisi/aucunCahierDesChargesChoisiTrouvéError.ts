import { NotFoundError } from '@potentiel-domain/core';

export class AucunCahierDesChargesChoisiTrouvéError extends NotFoundError {
  constructor() {
    super(`Aucun cahier des charges choisi n'a été trouvé`);
  }
}
