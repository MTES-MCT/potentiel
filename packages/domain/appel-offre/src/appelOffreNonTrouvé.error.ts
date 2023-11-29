import { NotFoundError } from '@potentiel-domain/core';

export class AppelOffreNonTrouvéErreur extends NotFoundError {
  constructor() {
    super(`Aucun appel d'offre n'a été trouvé pour ce projet`);
  }
}
