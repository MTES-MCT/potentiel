import { InvalidOperationError, NotFoundError } from '@potentiel-domain/core';

export class AbandonEnCoursErreur extends InvalidOperationError {
  constructor() {
    super(`Une demande d'abandon est déjà en cours pour le projet`);
  }
}

export class AbandonInconnuErreur extends NotFoundError {
  constructor() {
    super(`Abandon inconnu`);
  }
}

export class AbandonDéjàAccordéError extends InvalidOperationError {
  constructor() {
    super(`Abandon déjà accordé`);
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

export class AbandonEnAttenteConfirmationError extends InvalidOperationError {
  constructor() {
    super(`L'abandon est en attente de confirmation`);
  }
}

export class PièceJustificativeAbandonInconnueErreur extends NotFoundError {
  constructor(raison: 'format' | 'contenu') {
    super(`Pièce justificative abandon inconnue`, {
      raison,
    });
  }
}
