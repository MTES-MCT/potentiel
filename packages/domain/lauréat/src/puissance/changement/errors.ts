import { DomainError } from '@potentiel-domain/core';

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

export class DemandeDeChangementInexistanteError extends DomainError {
  constructor() {
    super("Aucune demande de changement de puissance n'est en cours");
  }
}

export class PuissanceNePeutPasÊtreModifiéeDirectementError extends DomainError {
  constructor() {
    super('La demande de changement de puissance a déjà été accordée');
  }
}
