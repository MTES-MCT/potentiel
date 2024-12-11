import { DomainError } from '@potentiel-domain/core';

export class ActionnaireIdentifiqueError extends DomainError {
  constructor() {
    super('Le nouvel actionnaire est identique à celui associé au projet');
  }
}

export class DemandeDeModificationEnCoursError extends DomainError {
  constructor() {
    super('Une demande de modification est déjà en cours');
  }
}
