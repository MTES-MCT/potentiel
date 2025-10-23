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

export class ModificationPuissanceDeSiteRequiseError extends DomainError {
  constructor() {
    super('La puissance de site doit être modifiée');
  }
}

export class PuissanceNulleOuNégativeError extends DomainError {
  constructor() {
    super("La puissance d'un projet doit avoir une valeur positive");
  }
}

export class PuissanceDeSiteNulleOuNégativeError extends DomainError {
  constructor() {
    super("La puissance de site d'un projet doit avoir une valeur positive");
  }
}
export class DemandeDeChangementPuissanceEnCoursError extends DomainError {
  constructor() {
    super('Une demande de changement de puissance est déjà en cours');
  }
}
