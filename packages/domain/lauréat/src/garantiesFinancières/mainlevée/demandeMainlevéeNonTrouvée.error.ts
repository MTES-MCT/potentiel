import { InvalidOperationError } from '@potentiel-domain/core';

export class DemandeMainlevéeEnCoursNonTrouvéeError extends InvalidOperationError {
  constructor() {
    super(`Il n'y a pas de demande de mainlevée de garanties financières en cours pour ce projet`);
  }
}

export class MainlevéeAccordéeNonTrouvéeError extends InvalidOperationError {
  constructor() {
    super(`Il n'y a pas de mainlevée de garanties financières accordée pour ce projet`);
  }
}
