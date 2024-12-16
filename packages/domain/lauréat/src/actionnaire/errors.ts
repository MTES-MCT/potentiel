import { DomainError, InvalidOperationError } from '@potentiel-domain/core';

export class ActionnaireIdentifiqueError extends DomainError {
  constructor() {
    super('Le nouvel actionnaire est identique à celui associé au projet');
  }
}

export class DemandeDeChangementEnCoursError extends DomainError {
  constructor() {
    super('Une demande de changement est déjà en cours');
  }
}

export class DemandeChangementActionnaireInexistanteErreur extends InvalidOperationError {
  constructor() {
    super(`Aucune demande de changement d'actionnaire n'est en cours`);
  }
}
