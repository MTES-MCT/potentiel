import { AggregateNotFoundError, InvalidOperationError } from '@potentiel-domain/core';

export class RecoursDéjàEnInstructionAvecLeMêmeAdministrateurError extends InvalidOperationError {
  constructor() {
    super('Le recours est déjà en instruction avec le même administrateur');
  }
}

export class AucunRecoursEnCours extends AggregateNotFoundError {
  constructor() {
    super(`Aucun recours n'est en cours`);
  }
}

export class RecoursImpossiblePourPériodeError extends InvalidOperationError {
  constructor() {
    super('La période ne permet pas de faire une demande de recours');
  }
}
