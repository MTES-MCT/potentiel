import { DomainError, InvalidOperationError } from '@potentiel-domain/core';

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

export class ActionnaireNePeutPasÊtreModifiéDirectement extends DomainError {
  constructor() {
    super("Impossible de modifier directement l'actionnaire dans ces conditions");
  }
}
