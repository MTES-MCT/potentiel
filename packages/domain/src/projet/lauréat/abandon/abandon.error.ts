import { InvalidOperationError } from '@potentiel/core-domain';

export class DemandeAbandonEnCoursErreur extends InvalidOperationError {
  constructor() {
    super(`Une demande d'abandon est déjà en cours pour le projet`);
  }
}

export class DemandeAbandonInconnuErreur extends InvalidOperationError {
  constructor() {
    super(`Demande d'abandon inconnu`);
  }
}
