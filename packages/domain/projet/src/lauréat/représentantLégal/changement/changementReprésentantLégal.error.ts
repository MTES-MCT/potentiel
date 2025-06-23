import { InvalidOperationError } from '@potentiel-domain/core';

export class DemandeChangementInexistanteError extends InvalidOperationError {
  constructor() {
    super(`Aucun changement de représentant légal n'est en cours`);
  }
}

export class ChangementDéjàAccordéError extends InvalidOperationError {
  constructor() {
    super(`Le changement de représentant légal a déjà été accordé`);
  }
}
export class ChangementDéjàRejetéError extends InvalidOperationError {
  constructor() {
    super(`Le changement de représentant légal a déjà été rejeté`);
  }
}
