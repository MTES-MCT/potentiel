import { InvalidOperationError } from '@potentiel-domain/core';

export class DemandeMainlevéeNonTrouvéeError extends InvalidOperationError {
  constructor() {
    super(`Il n'y a pas de demande de mainlevée de garanties financières en cours pour ce projet`);
  }
}
