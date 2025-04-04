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

export class DemandeDoitÊtreInstruiteParDGECError extends DomainError {
  constructor() {
    super('Une demande de changement de puissance à la hausse doit être instruite par la DGEC');
  }
}
export class DemandeDoitÊtreInstruiteParDREALError extends DomainError {
  constructor() {
    super('Une demande de changement de puissance à la baisse doit être instruite par la DREAL');
  }
}
