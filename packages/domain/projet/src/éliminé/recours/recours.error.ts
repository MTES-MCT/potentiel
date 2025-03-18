import { InvalidOperationError } from '@potentiel-domain/core';

export class RecoursDéjàEnInstructionAvecLeMêmeAdministrateurError extends InvalidOperationError {
  constructor() {
    super('Le recours est déjà en instruction avec le même administrateur');
  }
}
