import { InvalidOperationError } from '@potentiel-domain/core';

export class ActionnaireIdentifiqueError extends InvalidOperationError {
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

export class DemandeChangementActionnaireInexistanteErreur extends InvalidOperationError {
  constructor() {
    super(`Aucune demande de changement d'actionnaire n'est en cours`);
  }
}
