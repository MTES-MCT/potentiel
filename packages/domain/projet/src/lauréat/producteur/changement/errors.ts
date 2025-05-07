import { DomainError, InvalidOperationError } from '@potentiel-domain/core';

export class ProducteurIdentiqueError extends DomainError {
  constructor() {
    super('Le nouveau producteur est identique à celui associé au projet');
  }
}

export class ProjetAbandonnéError extends DomainError {
  constructor() {
    super("Impossible d'enregistrer un changement de producteur pour un projet abandonné");
  }
}

export class ProjetAvecDemandeAbandonEnCoursError extends DomainError {
  constructor() {
    super(
      "Impossible d'enregistrer un changement de producteur car une demande d'abandon est en cours pour le projet",
    );
  }
}

export class ProjetAchevéError extends DomainError {
  constructor() {
    super("Impossible d'enregistrer un changement de producteur pour un projet achevé");
  }
}

export class AppelOffreInexistantError extends InvalidOperationError {
  constructor(appelOffre: string) {
    super(`L'appel d'offre spécifié n'existe pas`, { appelOffre });
  }
}

export class AOEmpêcheChangementProducteurError extends InvalidOperationError {
  constructor() {
    super(
      "L'appel d'offre du projet empêche un changement de producteur avant l'achèvement du projet",
    );
  }
}
