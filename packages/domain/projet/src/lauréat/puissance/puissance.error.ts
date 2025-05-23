import { DomainError } from '@potentiel-domain/core';

export class PuissanceDéjàImportéeError extends DomainError {
  constructor() {
    super('La puissance a déjà été importée');
  }
}

export class PuissanceIdentiqueError extends DomainError {
  constructor() {
    super('La puissance doit avoir une valeur différente');
  }
}

export class PuissanceNulleOuNégativeError extends DomainError {
  constructor() {
    super("La puissance d'un projet doit être une valeur positive");
  }
}

export class DemandeDeChangementPuissanceEnCoursError extends DomainError {
  constructor() {
    super('Une demande de changement de puissance est déjà en cours');
  }
}
