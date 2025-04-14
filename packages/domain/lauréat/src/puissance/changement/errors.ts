import { DomainError, InvalidOperationError } from '@potentiel-domain/core';

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

export class RéponseSignéeObligatoireSiAccordSansDécisionDeLEtatError extends DomainError {
  constructor() {
    super("La réponse signée est obligatoire si l'accord n'est pas une décision de l'État");
  }
}

export class AppelOffreInexistantError extends InvalidOperationError {
  constructor(appelOffre: string) {
    super(`L'appel d'offre spécifié n'existe pas`, { appelOffre });
  }
}

export class PériodeInexistanteError extends InvalidOperationError {
  constructor(période: string) {
    super(`La période spécifiée n'existe pas`, { période });
  }
}

export class CahierDesChargesInexistantError extends InvalidOperationError {
  constructor() {
    super(`Le cahier des charges spécifié n'existe pas`);
  }
}
