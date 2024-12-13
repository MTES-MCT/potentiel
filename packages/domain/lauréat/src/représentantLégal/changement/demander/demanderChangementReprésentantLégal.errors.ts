import { DomainError } from '@potentiel-domain/core';

export class ProjetAbandonnéError extends DomainError {
  constructor() {
    super('Impossible de demander le changement de réprésentant légal pour un projet abandonné');
  }
}

export class ProjetAvecDemandeAbandonEnCoursError extends DomainError {
  constructor() {
    super(
      "Impossible de demander le changement de réprésentant légal car une demande d'abandon est en cours pour le projet",
    );
  }
}

export class ReprésentantLégalTypeInconnuError extends DomainError {
  constructor() {
    super('Le représentant légal ne peut pas avoir de type inconnu');
  }
}

export class ProjetAchevéError extends DomainError {
  constructor() {
    super('Impossible de demander le changement de représentant légal pour un projet achevé');
  }
}
