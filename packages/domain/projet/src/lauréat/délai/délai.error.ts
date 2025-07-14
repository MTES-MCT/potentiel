import { InvalidOperationError } from '@potentiel-domain/core';

export class DemandeDeDélaiInexistanteError extends InvalidOperationError {
  constructor() {
    super("Aucune demande de délai n'est en cours");
  }
}

export class DemandeDélaiDéjàEnInstructionAvecLeMêmeUtilisateurDrealError extends InvalidOperationError {
  constructor() {
    super('La demande de délai est déjà en instruction avec le même utilisateur dreal');
  }
}
