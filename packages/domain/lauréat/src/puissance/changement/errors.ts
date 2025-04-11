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

export class PuissanceDépassePuissanceMaxAO extends DomainError {
  constructor() {
    super("La puissance dépasse la puissance maximale autorisée par l'appel d'offres");
  }
}

export class PuissanceEnDeçaPuissanceMinAO extends DomainError {
  constructor() {
    super("La puissance est en deça de la puissance minimale autorisée par l'appel d'offres");
  }
}

export class PuissanceDépassePuissanceMaxFamille extends DomainError {
  constructor() {
    super("La puissance dépasse la puissance maximale de la famille de votre appel d'offre");
  }
}

export class PuissanceDépasseVolumeRéservéAO extends DomainError {
  constructor() {
    super("La puissance dépasse le volume réservé de votre appel d'offre");
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
