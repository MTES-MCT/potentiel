import { AggregateNotFoundError, InvalidOperationError } from '@potentiel-domain/core';

export class RecoursDéjàEnInstructionAvecLeMêmeUtilisateurDgecError extends InvalidOperationError {
  constructor() {
    super('Le recours est déjà en instruction avec le même utilisateur dgec');
  }
}

export class AucunRecoursEnCours extends AggregateNotFoundError {
  constructor() {
    super(`Aucun recours n'est en cours`);
  }
}

export class ÉliminéInexistantError extends AggregateNotFoundError {
  constructor() {
    super(`Le projet éliminé n'existe pas`);
  }
}
