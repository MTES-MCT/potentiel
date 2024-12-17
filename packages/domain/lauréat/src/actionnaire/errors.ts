import { DomainError } from '@potentiel-domain/core';

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

export class DemandeDeChangementInexistanteError extends DomainError {
  constructor() {
    super("La demande de changement d'actionnaire n'existe pas");
  }
}
