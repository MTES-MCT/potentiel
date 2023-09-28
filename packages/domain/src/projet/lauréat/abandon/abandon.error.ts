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

export class AbandonDéjàAccordéError extends InvalidOperationError {
  constructor() {
    super(`Abandon déjà accprdé`);
  }
}

export class AbandonDéjàRejetéError extends InvalidOperationError {
  constructor() {
    super(`Abandon déjà rejeté`);
  }
}

export class AbandonDéjàConfirméError extends InvalidOperationError {
  constructor() {
    super(`Abandon déjà confirmé`);
  }
}

export class ConfirmationAbandonDéjàDemandéError extends InvalidOperationError {
  constructor() {
    super(`Confirmation de l'abandon déjà demandé`);
  }
}

export class AucuneDemandeConfirmationAbandonError extends InvalidOperationError {
  constructor() {
    super(`Aucune demande de confirmation d'abandon en attente`);
  }
}
