import { DomainError, InvalidOperationError } from '@potentiel-domain/core';

export class ActionnaireIdentiqueError extends InvalidOperationError {
  constructor() {
    super('Le nouvel actionnaire est identique à celui associé au projet');
  }
}

export class ActionnaireDéjàTransmisError extends InvalidOperationError {
  constructor() {
    super("L'actionnaire a déjà été transmis");
  }
}

export class DemandeDeChangementEnCoursError extends InvalidOperationError {
  constructor() {
    super('Une demande de changement est déjà en cours');
  }
}

export class ChangementActionnaireInexistanteErreur extends InvalidOperationError {
  constructor() {
    super(`Aucune demande de changement d'actionnaire n'est en cours`);
  }
}

export class ProjetAbandonnéError extends DomainError {
  constructor() {
    super("Impossible de demander le changement d'actionnaire pour un projet abandonné");
  }
}

export class ProjetAvecDemandeAbandonEnCoursError extends DomainError {
  constructor() {
    super(
      "Impossible de demander le changement d'actionnaire car une demande d'abandon est en cours pour le projet",
    );
  }
}

export class ProjetAchevéError extends DomainError {
  constructor() {
    super("Impossible de demander le changement d'actionnaire pour un projet achevé");
  }
}

export class ActionnaireNePeutPasÊtreModifiéDirectement extends DomainError {
  constructor() {
    super("Impossible de modifier directement l'actionnaire dans ces conditions");
  }
}
