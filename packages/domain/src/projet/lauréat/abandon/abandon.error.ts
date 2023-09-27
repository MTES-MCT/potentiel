import { InvalidOperationError } from '@potentiel/core-domain';

export class DemandeAbandonEnCoursErreur extends InvalidOperationError {
  constructor() {
    super(`Une demande d'abandon est déjà en cours pour le projet`);
  }
}
