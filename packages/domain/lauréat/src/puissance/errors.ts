import { DomainError } from '@potentiel-domain/core';

export class PuissanceIntrouvableError extends DomainError {
  constructor() {
    super("La puissance n'existe pas");
  }
}

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
    super("La puissance d'un projet doit avoir une valeur positive");
  }
}
