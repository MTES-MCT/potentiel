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
    super("La puissance d'un projet doit être une valeur positive");
  }
}

export class ProjetAbandonnéError extends DomainError {
  constructor() {
    super('Impossible de demander le changement de puissance pour un projet abandonné');
  }
}

export class ProjetAvecDemandeAbandonEnCoursError extends DomainError {
  constructor() {
    super(
      "Impossible de demander le changement de puissance car une demande d'abandon est en cours pour le projet",
    );
  }
}

export class ProjetAchevéError extends DomainError {
  constructor() {
    super('Impossible de demander le changement de puissance pour un projet achevé');
  }
}
